import { AppDispatch, AppState } from '@/redux/store';
import { productActions } from './';
import { supabase } from '@/config/supabase';
import { Category, Product, Size, Unit } from './types';
import { message } from 'antd';
import { BUCKETS } from '@/constants/buckets';
import { RcFile } from 'antd/es/upload';
import { MAX_USERS } from '@/routes/module-access';
import { PLANS_IDS } from '@/constants/membership-plans';
import ExcelJS from 'exceljs';

export interface FetchFunction {
  refetch?: boolean;
  startLoading?: boolean;
}

const customActions = {
  fetchProducts:
    (args?: FetchFunction) =>
    async (dispatch: AppDispatch, getState: AppState) => {
      let products = getState()?.products?.products || [];
      const company_id = getState().app?.company?.company_id;
      const { categories, order_by } =
        getState()?.products?.filters?.products || {};

      if (!products.length || args?.refetch) {
        dispatch(productActions.setLoading(true));
        const supabaseQuery = supabase
          .from('products')
          .select(`*, categories(category_id,name), units(*), sizes(*)`)
          .eq('company_id', company_id);

        if (categories?.length) {
          supabaseQuery.in('category_id', categories);
        }

        if (order_by) {
          const [field, order] = order_by.split(',');
          supabaseQuery.order(field, { ascending: order === 'asc' });
        }

        const { data, error } = await supabaseQuery;
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo obtener la información de los productos');
          return;
        }

        products = data || [];

        dispatch(productActions.setProducts(products));
      }
    },
  getProductById:
    (product_id: number) => async (dispatch: AppDispatch, _: AppState) => {
      const { data, error } = await supabase
        .from('products')
        .select(`*, categories(category_id,name), units(*), sizes(*)`)
        .eq('product_id', product_id)
        .single();

      if (error) {
        message.error('No se pudo obtener la información del producto');
        return;
      }

      dispatch(productActions.setCurrentProduct(data));
    },
  saveImage: async (image: RcFile): Promise<string | null> => {
    const filename = image.uid;
    const { data, error } = await supabase.storage
      .from('deliz')
      .upload(`products/images/${filename}`, image, {
        upsert: true,
      });

    if (data?.fullPath && !error) {
      message.success('¡Imagen guardada!', 4);
      return BUCKETS.PRODUCTS.IMAGES`${data?.fullPath}`;
    }

    message.error('No se pudo guardar la imagen.', 4);
    return null;
  },
  deleteImage:
    (uid: string) => async (dispatch: AppDispatch, getState: AppState) => {
      const product = getState().products.current_product;
      const { error } = await supabase.storage
        .from('deliz')
        .remove([`products/images/${uid}`]);
      if (error) {
        message.error('Error al eliminar la imagen');
        return;
      }

      const result = await supabase
        .from('products')
        .update({ image_url: null })
        .eq('product_id', product.product_id)
        .select()
        .single();

      dispatch(
        productActions.setCurrentProduct({ ...product, ...result.data }),
      );
      message.info('Imagen eliminada');
    },
  saveProduct:
    (product: Partial<Product>) =>
    async (dispatch: AppDispatch, getState: AppState) => {
      dispatch(productActions.setLoading(true));
      const { company_id, membership_id } = getState().app?.company;

      const has100Products =
        getState()?.products?.products?.length >= MAX_USERS[PLANS_IDS.BASIC];

      if (has100Products && membership_id === PLANS_IDS.BASIC) {
        message.error('Tu membresía no te permite tener más de 100 productos');
        dispatch(productActions.setLoading(false));
        return false;
      }

      const result = await supabase
        .from('products')
        .insert({ ...product, company_id });

      dispatch(productActions.setLoading(false));

      if (result.error) {
        let errorMessage = 'No se pudo guardar el producto';
        if (result.error.details.includes('Key (code)=')) {
          errorMessage = 'El código de barras ya existe';
        }
        if (result.error.details.includes('Key (sku)=')) {
          errorMessage = 'El SKU ya existe';
        }
        message.error(errorMessage, 4);
        return false;
      }

      message.success('¡Producto agregado con éxito!', 4);
      return true;
    },
  updateProduct:
    (product: Partial<Product>) => async (dispatch: AppDispatch) => {
      dispatch(productActions.setLoading(true));
      const result = await supabase
        .from('products')
        .update(product)
        .eq('product_id', product.product_id)
        .select()
        .single();
      dispatch(productActions.setLoading(false));

      if (result.error) {
        let errorMessage = 'No se pudo actualizar el producto';
        if (result.error.details.includes('Key (code)=')) {
          errorMessage = 'El código de barras ya existe';
        }
        if (result.error.details.includes('Key (sku)=')) {
          errorMessage = 'El SKU ya existe';
        }
        message.error(errorMessage, 4);
        return false;
      }

      dispatch(productActions.setCurrentProduct(result.data));
      message.success('¡Producto actualizado con éxito!', 4);
      return true;
    },
  deleteProduct: (product: Product) => async (dispatch: AppDispatch) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', product.product_id);

    if (error) {
      message.error('No se pudo eliminar el registro');
      return false;
    }

    dispatch(productActions.fetchProducts({ refetch: true }));
    message.success('Registro eliminado');
    return true;
  },
  fetchCategories:
    (args?: FetchFunction) =>
    async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let categories = getState().products.categories || [];
        let company_id = getState().app.company.company_id;

        if (!categories.length || args?.refetch) {
          dispatch(productActions.setLoading(true));
          const result = await supabase
            .from('categories')
            .select('*')
            .eq('company_id', company_id)
            .order('name', { ascending: true });
          categories =
            result?.data?.map((item) => {
              return {
                ...item,
                key: item.category_id as number,
              } as Category;
            }) ?? [];
          dispatch(productActions.setCategories(categories));
        }
        dispatch(productActions.setLoading(false));
      } catch (error) {
        message.error('No se pudo obtener la lista de categorias');
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
  categories: {
    delete: (category_id: number) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('category_id', category_id);

        dispatch(productActions.setLoading(false));
        if (error) {
          message.error(`No se pudo eliminar este elemento: ${error.message}`);
          return false;
        }

        dispatch(productActions.fetchCategories({ refetch: true }));
        message.success('Elemento eliminado');
      } catch (error) {
        message.error('No se pudo eliminar este elemento');
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    add:
      (category: Category) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        try {
          dispatch(productActions.setLoading(true));
          let company_id = getState().app.company.company_id;

          const { error, data } = await supabase
            .from('categories')
            .insert({ ...category, company_id })
            .select()
            .single();

          dispatch(productActions.setLoading(false));

          if (error) {
            message.error('No se pudo guardar la categoría.', 4);
            return false;
          }
          await dispatch(productActions.fetchCategories({ refetch: true }));
          message.success('Categoría agregada', 4);
          return data.category_id;
        } catch (error) {
          dispatch(productActions.setLoading(false));
          return false;
        }
      },
    update: (category: Category) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));
        const { error } = await supabase
          .from('categories')
          .update({
            name: category.name,
            description: category.description,
            status: category.status,
            image_url: category.image_url,
          })
          .eq('category_id', category.category_id)
          .select();

        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo actualizar la categoría.', 4);
          return false;
        }
        await dispatch(productActions.fetchCategories({ refetch: true }));
        message.success('Categoría actualizada', 4);
        return true;
      } catch (error) {
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
  },
  sizes: {
    get:
      (args: FetchFunction) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        try {
          let sizes = getState()?.products?.sizes;

          if (!!sizes?.data?.length && !args?.refetch) return true;

          dispatch(productActions.setLoading(true));
          const company_id = getState()?.app?.company?.company_id;
          let { data: result, error } = await supabase
            .from('sizes')
            .select('*')
            .eq('company_id', company_id)
            .order('created_at', { ascending: false });
          dispatch(productActions.setLoading(false));

          if (error) {
            message.error('No se pudo cargar esta información', 4);
            return false;
          }

          let data =
            result?.map(
              (item) => ({ ...item, key: item.size_id as number }) as Size,
            ) ?? [];

          dispatch(productActions.setSize({ data }));
          return true;
        } catch (error) {
          dispatch(productActions.setLoading(false));
          return false;
        }
      },
    add: (size: Size) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        dispatch(productActions.setLoading(true));
        const company_id = getState()?.app?.company?.company_id;
        const { error } = await supabase
          .from('sizes')
          .insert([
            {
              name: size.name,
              description: size.description,
              short_name: size.short_name,
              company_id,
            },
          ])
          .select();
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo guardar el registro.', 4);
          return false;
        }

        await dispatch(productActions.sizes.get({ refetch: true }));
        message.success('Registro agregado', 4);
        return true;
      } catch (error) {
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    delete: (size_id: number) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));
        const { error } = await supabase
          .from('sizes')
          .delete()
          .eq('size_id', size_id);
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error(`No se pudo eliminar este elemento: ${error.message}`);
          return false;
        }

        dispatch(productActions.sizes.get({ refetch: true }));
        message.success('Elemento eliminado');
      } catch (error) {
        message.error('No se pudo eliminar este elemento');
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    update: (size: Size) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));
        const { error } = await supabase
          .from('sizes')
          .update({
            name: size.name,
            description: size.description,
            short_name: size.short_name,
          })
          .eq('size_id', size.size_id)
          .select();
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo actualizar el registro.', 4);
          return false;
        }

        await dispatch(productActions.sizes.get({ refetch: true }));
        message.success('Registro actualizado', 4);
        return true;
      } catch (error) {
        message.error('No se pudo actualizar el registro.', 4);
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    edit: (size: Size) => async (dispatch: AppDispatch) => {
      dispatch(productActions.setSize({ selected: size, drawer: 'edit' }));
    },
  },
  units: {
    get:
      (args: FetchFunction) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        try {
          let units = getState()?.products?.units;

          if (!!units?.data?.length && !args?.refetch) return true;

          dispatch(productActions.setLoading(true));
          const company_id = getState()?.app?.company?.company_id;
          let { data: result, error } = await supabase
            .from('units')
            .select('*')
            .eq('company_id', company_id)
            .order('created_at', { ascending: false });
          dispatch(productActions.setLoading(false));

          if (error) {
            message.error('No se pudo cargar esta información', 4);
            return false;
          }

          let data =
            result?.map(
              (item) => ({ ...item, key: item.unit_id as number }) as Unit,
            ) ?? [];

          dispatch(productActions.setUnit({ data }));
          return true;
        } catch (error) {
          dispatch(productActions.setLoading(false));
          return false;
        }
      },
    add: (unit: Unit) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        dispatch(productActions.setLoading(true));
        const company_id = getState()?.app?.company?.company_id;
        const { error } = await supabase
          .from('units')
          .insert([
            {
              name: unit.name,
              description: unit.description,
              short_name: unit.short_name,
              company_id,
            },
          ])
          .select();
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo guardar el registro.', 4);
          return false;
        }

        await dispatch(productActions.units.get({ refetch: true }));
        message.success('Registro agregado', 4);
        return true;
      } catch (error) {
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    delete: (unit_id: number) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));
        const { error } = await supabase
          .from('units')
          .delete()
          .eq('unit_id', unit_id);
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error(`No se pudo eliminar este elemento: ${error.message}`);
          return false;
        }

        dispatch(productActions.units.get({ refetch: true }));
        message.success('Elemento eliminado');
      } catch (error) {
        message.error('No se pudo eliminar este elemento');
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    update: (unit: Unit) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));
        const { error } = await supabase
          .from('units')
          .update({
            name: unit.name,
            description: unit.description,
            short_name: unit.short_name,
          })
          .eq('unit_id', unit.unit_id)
          .select();
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo actualizar el registro.', 4);
          return false;
        }

        await dispatch(productActions.units.get({ refetch: true }));
        message.success('Registro actualizado', 4);
        return true;
      } catch (error) {
        message.error('No se pudo actualizar el registro.', 4);
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    edit: (unit: Unit) => async (dispatch: AppDispatch) => {
      dispatch(productActions.setUnit({ selected: unit, drawer: 'edit' }));
    },
  },
  uploads: {
    downloadXLSXTemplate: () => async (_: AppDispatch, getState: AppState) => {
      const companyId = getState().app.company.company_id;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Productos');
      const columnStyle = { font: { bold: true } };
      const [priceList, categories, sizes, units, branches] = await Promise.all(
        [
          supabase
            .from('prices_list')
            .select('price_id, name')
            .eq('company_id', companyId),
          supabase
            .from('categories')
            .select('category_id, name')
            .eq('company_id', companyId),
          supabase
            .from('sizes')
            .select('size_id, name')
            .eq('company_id', companyId),
          supabase
            .from('units')
            .select('unit_id, name')
            .eq('company_id', companyId),
          supabase
            .from('branches')
            .select('branch_id, name')
            .eq('company_id', companyId),
        ],
      );

      let columns: Partial<ExcelJS.Column>[] = [
        {
          header: 'Nombre del Producto',
          key: 'name',
          width: 25,
          style: columnStyle,
        },
        {
          header: 'Descripción',
          key: 'description',
          width: 30,
          style: columnStyle,
        },
        {
          header: 'Categoría',
          key: 'category_id',
          width: 20,
          style: columnStyle,
        },
        { header: 'Tamaño', key: 'size_id', width: 15, style: columnStyle },
        { header: 'Unidad', key: 'unit_id', width: 15, style: columnStyle },
        {
          header: 'Precio Bruto',
          key: 'raw_price',
          width: 15,
          style: columnStyle,
        },
      ];

      if (priceList.data) {
        priceList.data.forEach((item: any) => {
          columns.push({
            header: `Precio ${item.name}`,
            key: `price_list.${item.price_id}`,
            width: `Precio ${item.name}`.length || 15,
            style: columnStyle,
          });
        });
      }

      if (branches.data) {
        branches.data.forEach((item: any) => {
          columns.push({
            header: `Stock ${item.name}`,
            key: `branch.${item.branch_id}`,
            width: `Stock ${item.name}`.length || 15,
            style: columnStyle,
          });
        });
      }

      columns = columns.concat([
        { header: 'SKU', key: 'sku', width: 20, style: columnStyle },
        { header: 'Código', key: 'code', width: 15, style: columnStyle },
        {
          header: 'Mostrar en Catálogo',
          key: 'show_in_catalog',
          width: 20,
          style: columnStyle,
        },
      ]);

      worksheet.columns = columns;

      // **Agregar título en la primera fila**
      const title = 'Creación de Productos';
      worksheet.mergeCells(1, 1, 1, columns.length);
      const titleCell = worksheet.getCell(1, 1);
      titleCell.value = title;
      titleCell.protection = { locked: true };
      titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '6466f1' },
      };
      titleCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      // **Agregar descripciones en la segunda fila**
      const descriptions = [
        'Ingrese el nombre del producto',
        'Descripción detallada del producto',
        'Seleccione una categoría existente',
        'Indique el tamaño del producto',
        'Unidad de medida del producto',
        'Precio bruto sin impuestos',
        ...(priceList?.data || [])?.map(
          () => 'Precio final para venta al público',
        ),
        ...(branches?.data || [])?.map(() => 'Stock disponible en la sucursal'),
        'Código SKU del producto',
        'Código interno del producto',
        'Indique SI o NO para mostrar en catálogo',
      ];

      worksheet.addRow(descriptions);
      const descriptionRow = worksheet.getRow(2);
      descriptionRow.eachCell((cell) => {
        cell.font = { italic: true };
        cell.protection = { locked: true };
        cell.alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center',
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6E6FA' },
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      });

      // **Agregar los encabezados en la tercera fila**
      worksheet.addRow(columns.map((col) => col.header));
      const headerRow = worksheet.getRow(3);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6E6FA' },
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      });

      // **Agregar filas vacías para los datos, empezando desde la fila 4**
      const minimumRowNumber = 10; // Mínimo de filas deseado
      for (let i = 1; i <= minimumRowNumber; i++) {
        const rowValues: { [key: string]: string } = {};
        columns.forEach((column) => {
          if (column.key) {
            rowValues[column.key] = '';
          }
        });
        worksheet.addRow(rowValues);
      }

      // **Desbloquear las celdas editables (datos)**
      const dataStartRow = 4;
      const dataEndRow = minimumRowNumber + 3; // Ajustar según las filas añadidas
      for (let i = dataStartRow; i <= dataEndRow; i++) {
        const dataRow = worksheet.getRow(i);
        dataRow.eachCell((cell) => {
          cell.protection = { locked: false };
          // Aplicar estilos a las celdas de datos
          cell.font = { name: 'Calibri', size: 11, bold: false };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          };
        });
      }

      // **Aplicar validaciones a las celdas**
      const applyListValidation = (columnKey: string, options: string[]) => {
        for (let i = dataStartRow; i <= dataEndRow; i++) {
          const cell = worksheet.getRow(i).getCell(columnKey);
          cell.dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`"${options.join(',')}"`],
            showErrorMessage: true,
            errorTitle: 'Valor inválido',
            error: 'Seleccione un valor de la lista.',
          };
        }
      };

      // Validaciones para las columnas necesarias
      applyListValidation('show_in_catalog', ['SI', 'NO']);
      applyListValidation(
        'category_id',
        (categories?.data || [])?.map((cat) => cat?.name),
      );
      applyListValidation(
        'size_id',
        (sizes?.data || [])?.map((size) => size?.name),
      );
      applyListValidation(
        'unit_id',
        (units?.data || [])?.map((unit) => unit?.name),
      );

      // **Proteger la hoja de cálculo**
      await worksheet.protect('', {
        selectLockedCells: false,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        insertHyperlinks: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
        pivotTables: false,
      });

      // **Generar y descargar el archivo**
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.id = 'download-xlsx-template';
      link.download = 'template_productos.xlsx';
      link.click();
      link.remove();
    },
  },
};

export default customActions;

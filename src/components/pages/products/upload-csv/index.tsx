import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { App, Modal, Typography } from 'antd';
import { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import ExcelJS from 'exceljs';
import _ from 'lodash';
import { Product } from '@/redux/reducers/products/types';
import { supabase } from '@/config/supabase';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const CreateProductsByCsv = ({ visible = false, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [uploadedFile, setUploadedFile] = useState<RcFile | null>(null);
  const { branches, prices_list } = useAppSelector(({ branches }) => branches);
  const { company } = useAppSelector(({ app }) => app);
  const [loading, setLoading] = useState(false);
  const { categories, units, sizes } = useAppSelector(
    ({ products }) => products,
  );
  const handleClose = () => {
    if (loading) return;
    setUploadedFile(null);
    onClose();
  };

  const downloadTemplate = () => {
    dispatch(productActions.uploads.downloadXLSXTemplate());
  };

  const saveProducts = async (products: Product[]) => {
    setLoading(true);
    const { error } = await supabase.from('products').upsert(products);
    setLoading(false);

    if (error) {
      message.error('Ocurrió un error al guardar los productos');
      return;
    }

    message.success('Productos guardados correctamente');
    handleClose();
    dispatch(productActions.fetchProducts({ refetch: true }));
  };

  const processFile = async () => {
    try {
      if (!uploadedFile) {
        message.error('No se ha seleccionado un archivo');
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await uploadedFile.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.getWorksheet('Productos');
      if (!worksheet) {
        console.error('La hoja "Productos" no existe en el archivo.');
        return;
      }

      if (!prices_list || !branches) {
        console.error('No se pudo obtener los datos de priceList o branches.');
        return;
      }

      // **Obtener los encabezados de la tercera fila**
      const headerRow = worksheet.getRow(3);
      const headers: string[] = [];
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString() || '';
      });

      // **Mapear los encabezados a las claves**
      const headerKeyMap: { [header: string]: string } = {
        'Nombre del Producto': 'name',
        Descripción: 'description',
        Categoría: 'category_id',
        Tamaño: 'size_id',
        Unidad: 'unit_id',
        'Precio Bruto': 'raw_price',
        SKU: 'sku',
        Código: 'code',
        'Mostrar en Catálogo': 'show_in_catalog',
      };

      // **Mapear nombres de listas de precios a IDs**
      const priceListNameToId: { [name: string]: string } = {};
      prices_list.forEach((item: any) => {
        priceListNameToId[item.name] = item.price_id;
      });

      // **Mapear nombres de sucursales a IDs**
      const branchNameToId: { [name: string]: string } = {};
      branches.forEach((item) => {
        branchNameToId[item.name] = item.branch_id;
      });

      // **Crear el array de columnKeys**
      const columnKeys: (string | null | undefined)[] = headers.map(
        (header) => {
          // Manejar columnas dinámicas
          if (header.startsWith('Precio ') && header !== 'Precio Bruto') {
            // Extraer el nombre de la lista de precios
            const priceListName = header.substring('Precio '.length);
            const priceListId = priceListNameToId[priceListName];
            if (priceListId) {
              return `price_list.${priceListId}`;
            }
          } else if (header.startsWith('Stock ')) {
            const branchName = header.substring('Stock '.length);
            const branchId = branchNameToId[branchName];
            if (branchId) {
              return `branch.${branchId}`;
            }
          } else if (headerKeyMap[header]) {
            return headerKeyMap[header];
          } else {
            return null; // Si no coincide, retornamos null
          }
        },
      );

      // **Procesar las filas de datos (a partir de la fila 4)**
      const dataStartRow = 4;
      const dataEndRow = worksheet.actualRowCount;

      const data: any[] = [];

      for (let rowNumber = dataStartRow; rowNumber <= dataEndRow; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const rowData: { [key: string]: any } = {};

        // Verificar si la fila está vacía
        const isEmpty = (row?.values as any).every((value: any) =>
          _.isEmpty(value),
        );
        if (isEmpty) {
          continue; // Saltar filas vacías
        }

        row.eachCell((cell, colNumber) => {
          const columnKey = columnKeys[colNumber - 1];
          if (columnKey?.includes('branch.')) {
            rowData['inventory'] = {
              ...rowData['inventory'],
              [columnKey.split('.')[1]]: {
                branch_id: columnKey.split('.')[1],
                stock: cell.value,
              },
            };
          } else if (columnKey?.includes('price_list.')) {
            const defaultPrice = prices_list.find((price) => price.is_default);
            rowData['price_list'] = {
              ...rowData['price_list'],
              [columnKey.split('.')[1]]: {
                price_id: columnKey.split('.')[1],
                unit_price: cell.value,
                is_default: defaultPrice?.price_id === columnKey.split('.')[1],
              },
            };
          } else if (columnKey === 'category_id') {
            // Encontrar la categoría por nombre
            const category = categories.find(
              (category) => category.name === cell.value,
            );
            if (category) {
              rowData[columnKey] = category.category_id;
            }
          } else if (columnKey === 'size_id') {
            // Encontrar el tamaño por nombre
            const size = (sizes?.data || [])?.find(
              (size) => size.name === cell.value,
            );
            if (size) {
              rowData[columnKey] = size.size_id;
            }
          } else if (columnKey === 'unit_id') {
            // Encontrar la unidad por nombre
            const unit = (units?.data || []).find(
              (unit) => unit.name === cell.value,
            );
            if (unit) {
              rowData[columnKey] = unit.unit_id;
            }
          } else if (columnKey === 'show_in_catalog') {
            rowData[columnKey] = cell.value === 'SI';
          } else if (
            columnKey &&
            ['code', 'sku'].includes(columnKey?.toString() || '')
          ) {
            rowData[columnKey] = cell.value?.toString()?.trim()?.toUpperCase();
          } else if (columnKey) {
            rowData[columnKey] = cell.value?.toString()?.trim();
          }
        });

        data.push({ ...rowData, company_id: company?.company_id });
      }

      saveProducts(data);
    } catch (error) {
      message.error(
        'Ocurrió un error al procesar el archivo, por favor verifica que el archivo sea correcto.',
      );
    }
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      closable={false}
      onOk={processFile}
      okText={loading ? 'Procesando...' : 'Procesar'}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Typography.Title level={4}>Subir archivo</Typography.Title>
      <p className="mb-2">
        Si no tienes un archivo, puedes descargar la plantilla{' '}
        <span
          className="text-primary cursor-pointer underline"
          onClick={downloadTemplate}
        >
          aquí
        </span>
        .
      </p>
      <Dragger
        multiple={false}
        accept=".xlsx"
        className="flex flex-col gap-5 mb-1 [&>.ant-upload-list>div.ant-upload-list-item-container]:!w-full [&>.ant-upload-list>div.ant-upload-list-item-container]:!h-[20px] [&>.ant-upload-list>div.ant-upload-list-item-container]:!min-h-[38px] [&>.ant-upload-list>.ant-upload-list-item-container]:!px-5"
        beforeUpload={(info) => {
          setUploadedFile(info);
          return false;
        }}
      >
        <p className="flex justify-center py-2 ">
          <Upload className="text-primary" />
        </p>
        <p className="ant-upload-text">
          Da click o arrastra un archivo para subirlo
        </p>
        <p className="ant-upload-hint">
          Asegurate de subir el archivo proporcionado por el sistema
        </p>
      </Dragger>
    </Modal>
  );
};

export default CreateProductsByCsv;

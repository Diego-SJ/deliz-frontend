import { AppDispatch, AppState } from '@/redux/store';
import { productActions } from './';
import { supabase } from '@/config/supabase';
import { Category, Product, Size, Unit } from './types';
import { v4 as uuid } from 'uuid';
import { message } from 'antd';
import { BUCKETS } from '@/constants/buckets';
import { RcFile } from 'antd/es/upload';

export interface FetchFunction {
  refetch?: boolean;
}

const customActions = {
  fetchProducts: (args?: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      let products = getState().products.products || [];

      if (!products.length || args?.refetch) {
        dispatch(productActions.setLoading(true));
        const result = await supabase
          .from('products')
          .select(`*, categories(category_id,name), units(*), sizes(*)`)
          // .not('product_id', 'in', '(0,3)')
          .order('name', { ascending: true });
        products =
          result?.data?.map(item => {
            return {
              ...item,
              key: item.product_id as number,
              image_url: !!item?.image_url ? BUCKETS.PRODUCTS.IMAGES`${item.image_url}` : '',
            } as Product;
          }) ?? [];
        dispatch(productActions.setProducts(products));
      }
    } catch (error) {
      message.error('No se pudo obtener la lista de productos');
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  saveImage: async (image: RcFile): Promise<string | boolean> => {
    const filename = `${image.uid}_${image.name}`;
    const { data, error } = await supabase.storage.from('deliz').upload(`products/images/${filename}`, image, {
      upsert: false,
    });

    if (data?.path && !error) {
      message.success('¡Imagen guardada!', 4);
      return data.path as string;
    }

    message.error('No se pudo guardar la imagen.', 4);
    return false;
  },
  replaceImage: async (image: RcFile, image_path?: string): Promise<string | boolean> => {
    let filename = image_path?.replace(BUCKETS.PRODUCTS.IMAGES_PATH`${''}`, '');
    const { data, error } = await supabase.storage.from('deliz').update(`products/images/${filename}`, image, {
      upsert: true,
    });
    let imageUrl: string | boolean = data?.path as string;

    if (error) {
      imageUrl = await productActions.saveImage(image);
    }

    if (!!imageUrl) {
      return imageUrl as string;
    }

    message.error('No se pudo actualizar la imagen.', 4);
    return false;
  },
  saveProduct: (product: Product) => async (dispatch: AppDispatch) => {
    try {
      dispatch(productActions.setLoading(true));

      const result = await supabase.from('products').insert({
        category_id: product.category_id,
        name: product.name,
        retail_price: product.retail_price,
        wholesale_price: product.wholesale_price,
        status: product.status,
        stock: product.stock,
        description: product.description,
        image_url: product?.image_url,
        size_id: product?.size_id,
        unit_id: product?.unit_id,
        code: product?.code,
      } as Product);

      dispatch(productActions.setLoading(false));

      if (result.error) {
        message.error('No se pudo guardar el producto.', 4);
        return false;
      }
      await dispatch(productActions.fetchProducts({ refetch: true }));
      message.success('¡Producto agregado con éxito!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  updateProduct: (product: Product, image_url?: string | null) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      dispatch(productActions.setLoading(true));

      let url_sanitized = (image_url || product?.image_url || '')?.replace(BUCKETS.PRODUCTS.IMAGES`${''}`, '') || '';

      const oldData = getState().products.current_product;
      const newData = {
        category_id: product.category_id,
        name: product.name,
        retail_price: product.retail_price,
        wholesale_price: product.wholesale_price,
        status: product.status,
        stock: product.stock,
        description: product.description,
        image_url: url_sanitized,
        size_id: product?.size_id,
        unit_id: product?.unit_id,
        code: product?.code,
      } as Product;

      const result = await supabase.from('products').update(newData).eq('product_id', oldData.product_id);

      dispatch(productActions.setLoading(false));

      if (result.error) {
        message.error('No se pudo actualizar la información.', 4);
        return false;
      }

      let productData = { ...oldData, ...newData, image_url: BUCKETS.PRODUCTS.IMAGES`${url_sanitized}` };
      dispatch(productActions.setCurrentProduct(productData));
      await dispatch(productActions.fetchProducts({ refetch: true }));
      message.success('¡Producto actualizado con éxito!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  deleteProduct: (product: Product) => async (dispatch: AppDispatch) => {
    const { error } = await supabase.from('products').delete().eq('product_id', product.product_id);

    if (error) {
      message.error('No se pudo eliminar el registro');
      return false;
    }

    dispatch(productActions.fetchProducts({ refetch: true }));
    message.success('Registro eliminado');
  },
  fetchCategories: (args?: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      let categories = getState().products.categories || [];

      if (!categories.length || args?.refetch) {
        dispatch(productActions.setLoading(true));
        const result = await supabase.from('categories').select('*');
        categories =
          result?.data?.map(item => {
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
        const { error } = await supabase.from('categories').delete().eq('category_id', category_id);

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
    add: (category: Category) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));

        const { error } = await supabase
          .from('categories')
          .insert([{ name: category.name, description: category.description, status: category.status }])
          .select();

        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo guardar la categoría.', 4);
          return false;
        }
        await dispatch(productActions.fetchCategories({ refetch: true }));
        message.success('Categoría agregada', 4);
        return true;
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
          .update({ name: category.name, description: category.description, status: category.status })
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
    get: (args: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let sizes = getState()?.products?.sizes;

        if (!!sizes?.data?.length && !args?.refetch) return true;

        dispatch(productActions.setLoading(true));
        let { data: result, error } = await supabase.from('sizes').select('*').range(0, 9);
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar esta información', 4);
          return false;
        }

        let data = result?.map(item => ({ ...item, key: item.size_id as number } as Size)) ?? [];

        dispatch(productActions.setSize({ data }));
        return true;
      } catch (error) {
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    add: (size: Size) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));
        const { error } = await supabase
          .from('sizes')
          .insert([{ name: size.name, description: size.description, short_name: size.short_name }])
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
        const { error } = await supabase.from('sizes').delete().eq('size_id', size_id);
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
          .update({ name: size.name, description: size.description, short_name: size.short_name })
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
    get: (args: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let units = getState()?.products?.units;

        if (!!units?.data?.length && !args?.refetch) return true;

        dispatch(productActions.setLoading(true));
        let { data: result, error } = await supabase.from('units').select('*').range(0, 9);
        dispatch(productActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar esta información', 4);
          return false;
        }

        let data = result?.map(item => ({ ...item, key: item.unit_id as number } as Unit)) ?? [];

        dispatch(productActions.setUnit({ data }));
        return true;
      } catch (error) {
        dispatch(productActions.setLoading(false));
        return false;
      }
    },
    add: (unit: Unit) => async (dispatch: AppDispatch) => {
      try {
        dispatch(productActions.setLoading(true));
        const { error } = await supabase
          .from('units')
          .insert([{ name: unit.name, description: unit.description, short_name: unit.short_name }])
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
        const { error } = await supabase.from('units').delete().eq('unit_id', unit_id);
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
          .update({ name: unit.name, description: unit.description, short_name: unit.short_name })
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
};

export default customActions;

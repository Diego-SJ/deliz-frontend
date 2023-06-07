import { AppDispatch, AppState } from '@/redux/store';
import { productActions } from './';
import { supabase } from '@/config/supabase';
import { Product } from './types';
import { v4 as uuid } from 'uuid';
import { message } from 'antd';
import { BUCKETS } from '@/constants/buckets';

export interface FetchFunction {
  refetch?: boolean;
}

const customActions = {
  fetchProducts: (args?: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      let products = getState().products.products || [];

      if (!products.length || args?.refetch) {
        dispatch(productActions.setLoading(true));
        const result = await supabase.from('products').select('*');
        products =
          result?.data
            ?.filter(item => item?.product_id !== 0)
            ?.map(item => {
              return {
                ...item,
                key: item.product_id as number,
                image_url: BUCKETS.PRODUCTS.IMAGES`${item.image_url}`,
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
  saveImage: async (image: File): Promise<string | boolean> => {
    const filename = uuid();
    const { data, error } = await supabase.storage.from('deliz').upload(`products/images/${filename}`, image, {
      cacheControl: '3600',
      upsert: false,
    });

    if (data?.path && !error) {
      message.success('¡Imagen guardada!', 4);
      return data.path as string;
    }

    message.error('No se pudo guardar la imagen.', 4);
    return false;
  },
  replaceImage: async (image: File, image_path: string): Promise<string | boolean> => {
    let filename = image_path.replace(BUCKETS.PRODUCTS.IMAGES`${''}`, '');
    const { data, error } = await supabase.storage.from('deliz').update(`products/images/${filename}`, image, {
      cacheControl: '3600',
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
      } as Product);

      dispatch(productActions.setLoading(false));

      if (result.error) {
        message.error('No se pudo guardar el producto.', 4);
        return false;
      }
      dispatch(productActions.fetchProducts({ refetch: true }));
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
      } as Product;

      const result = await supabase.from('products').update(newData).eq('product_id', oldData.product_id);

      dispatch(productActions.setLoading(false));

      if (result.error) {
        message.error('No se pudo actualizar la información.', 4);
        return false;
      }

      let productData = { ...oldData, ...newData, image_url: BUCKETS.PRODUCTS.IMAGES`${url_sanitized}` };
      dispatch(productActions.setCurrentProduct(productData));
      message.success('¡Producto actualizado con éxito!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
};

export default customActions;

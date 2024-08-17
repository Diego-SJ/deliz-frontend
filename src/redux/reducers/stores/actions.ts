import { AppDispatch, AppState } from '@/redux/store';
import { storesActions } from '.';
import { supabase } from '@/config/supabase';
import { CompanyStore } from './types';
import { message } from 'antd';
import { UploadFile } from 'antd/lib';
import { BUCKETS } from '@/constants/buckets';

export const customStoreActions = {
  getStore: () => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState()?.app?.company?.company_id;
    if (company_id) {
      dispatch(storesActions.setLoading(true));

      const { data, error } = await supabase.from('stores').select('*').eq('company_id', company_id).single();

      if (error) {
        dispatch(storesActions.setLoading(false));
        return;
      }

      if (data) {
        dispatch(storesActions.setStore(data));
        dispatch(storesActions.setLoading(false));
      }
    }
  },
  updateStore: (store: Partial<CompanyStore>) => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState()?.app?.company?.company_id;

    if (company_id) {
      dispatch(storesActions.setLoading(true));

      const { data, error } = await supabase
        .from('stores')
        .upsert({ ...store, company_id })
        .select()
        .single();

      if (error) {
        message.error(error.message);
        dispatch(storesActions.setLoading(false));
        return;
      }

      dispatch(storesActions.setStore(data));
      dispatch(storesActions.setLoading(false));
    }
  },
  saveLogo: (file: UploadFile) => async (dispatch: AppDispatch, getState: AppState) => {
    if (!!file?.originFileObj?.size) {
      const store_id = getState().stores.store?.store_id;

      const fileName = store_id;
      const { data, error } = await supabase.storage.from('deliz').upload(`company/${fileName}`, file!.originFileObj!, {
        upsert: true,
      });

      if (error) {
        message.error('Error al subir la imagen');
        return;
      }

      await dispatch(storesActions.updateStore({ store_id, logo_url: BUCKETS.COMPANY.LOGO`${data?.fullPath}` }));
    }
  },
  deleteLogo: () => async (dispatch: AppDispatch, getState: AppState) => {
    const store_id = getState().stores.store?.store_id;
    const { error } = await supabase.storage.from('deliz').remove([`company/${store_id}`]);
    if (error) {
      message.error('Error al eliminar la imagen');
      return;
    }
    await dispatch(storesActions.updateStore({ store_id, logo_url: null }));
    message.success('Imagen eliminada correctamente');
  },
};

import { supabase } from '@/config/supabase';
import { AppDispatch, AppState } from '@/redux/store';
import { UploadFile } from 'antd/es/upload';
import { appActions } from '.';
import { message } from 'antd';
import { Business } from './types';
import { BUCKETS } from '@/constants/buckets';

const customActions = {
  business: {
    getBusiness: (id?: string) => async (dispatch: AppDispatch, getState: AppState) => {
      const business_id = id || getState().users?.user_auth?.profile?.business_id;
      const { data, error } = await supabase.from('business').select().eq('business_id', business_id).single();
      if (error) {
        message.error('Error al obtener los datos');
        return;
      }
      await dispatch(appActions.setBusiness(data));
    },
    saveLogo: (file: UploadFile) => async (dispatch: AppDispatch, getState: AppState) => {
      if (!!file?.originFileObj?.size) {
        const business_id = getState().app.business?.business_id;
        const fileName = business_id;
        const { data, error } = await supabase.storage.from('deliz').upload(`company/${fileName}`, file!.originFileObj!, {
          upsert: true,
        });

        if (error) {
          message.error('Error al subir la imagen');
          return;
        }

        await dispatch(appActions.business.upsertBusiness({ business_id, logo_url: BUCKETS.COMPANY.LOGO`${data?.fullPath}` }));
      }
    },
    deleteLogo: () => async (dispatch: AppDispatch, getState: AppState) => {
      const business_id = getState().app.business?.business_id;
      const { error } = await supabase.storage.from('deliz').remove([`company/${business_id}`]);
      if (error) {
        message.error('Error al eliminar la imagen');
        return;
      }
      await dispatch(appActions.business.upsertBusiness({ business_id, logo_url: null }));
      message.success('Imagen eliminada correctamente');
    },
    upsertBusiness: (business: Partial<Business>) => async (dispatch: AppDispatch, getState: AppState) => {
      const oldData = getState().app.business;
      const { data, error } = await supabase.from('business').upsert(business).select();
      if (error) {
        message.error('Error al guardar los datos');
        return;
      }
      await dispatch(appActions.setBusiness({ ...oldData, ...data[0] }));
      message.success('Datos guardados correctamente');
    },
  },
};

export default customActions;

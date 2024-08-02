import { supabase } from '@/config/supabase';
import { AppDispatch, AppState } from '@/redux/store';
import { UploadFile } from 'antd/es/upload';
import { appActions } from '.';
import { message } from 'antd';
import { Company } from './types';
import { BUCKETS } from '@/constants/buckets';

const customActions = {
  company: {
    getCompany: (id?: string) => async (dispatch: AppDispatch, getState: AppState) => {
      const company_id = id || getState().users?.user_auth?.profile?.company_id;
      const { data, error } = await supabase.from('companies').select().eq('company_id', company_id).single();
      if (error) {
        message.error('Error al obtener los datos');
        return;
      }
      await dispatch(appActions.setCompany(data));
    },
    saveLogo: (file: UploadFile) => async (dispatch: AppDispatch, getState: AppState) => {
      if (!!file?.originFileObj?.size) {
        const company_id = getState().app.company?.company_id;
        const fileName = company_id;
        const { data, error } = await supabase.storage.from('deliz').upload(`company/${fileName}`, file!.originFileObj!, {
          upsert: true,
        });

        if (error) {
          message.error('Error al subir la imagen');
          return;
        }

        await dispatch(appActions.company.upsertBusiness({ company_id, logo_url: BUCKETS.COMPANY.LOGO`${data?.fullPath}` }));
      }
    },
    deleteLogo: () => async (dispatch: AppDispatch, getState: AppState) => {
      const company_id = getState().app.company?.company_id;
      const { error } = await supabase.storage.from('deliz').remove([`company/${company_id}`]);
      if (error) {
        message.error('Error al eliminar la imagen');
        return;
      }
      await dispatch(appActions.company.upsertBusiness({ company_id, logo_url: null }));
      message.success('Imagen eliminada correctamente');
    },
    upsertBusiness: (company: Partial<Company>) => async (dispatch: AppDispatch, getState: AppState) => {
      const oldData = getState().app.company;
      const { data, error } = await supabase.from('companies').upsert(company).select();
      if (error) {
        message.error('Error al guardar los datos');
        return;
      }
      await dispatch(appActions.setCompany({ ...oldData, ...data[0] }));
      message.success('Datos guardados correctamente');
    },
  },
};

export default customActions;

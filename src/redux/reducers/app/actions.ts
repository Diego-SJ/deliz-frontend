import { supabase } from '@/config/supabase';
import { AppDispatch } from '@/redux/store';
import { UploadFile } from 'antd/es/upload';
import { appActions } from '.';
import { BUCKETS } from '@/constants/buckets';
import { message } from 'antd';

const customActions = {
  business: {
    saveLogo: (file: UploadFile) => async (dispatch: AppDispatch) => {
      const fileName = 'company_logo';
      const { data, error } = await supabase.storage.from('deliz').upload(`company/${fileName}`, file!.originFileObj!, {
        upsert: true,
        cacheControl: '0',
      });

      if (error) {
        message.error('Error al subir la imagen');
        return;
      }
      await dispatch(appActions.setBusiness({ logo_url: BUCKETS.COMPANY.LOGO`${data?.fullPath}` }));
      message.success('Imagen subida correctamente');
    },
    deleteLogo: () => async (dispatch: AppDispatch) => {
      const { error } = await supabase.storage.from('deliz').remove([`company/company_logo`]);
      if (error) {
        message.error('Error al eliminar la imagen');
        return;
      }
      await dispatch(appActions.setBusiness({ logo_url: null }));
      message.success('Imagen eliminada correctamente');
    },
  },
};

export default customActions;

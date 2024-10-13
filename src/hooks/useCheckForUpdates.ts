import { SuscriberData } from '@/components/organisms/new-version-modal';
import { supabase } from '@/config/supabase';
import { APP_VERSION } from '@/constants/versions';
import { App } from 'antd';
import { useState } from 'react';

export const useCheckForUpdates = () => {
  const [suscriberData, setSuscriberData] = useState<SuscriberData>(null);
  const { message } = App.useApp();

  const checkForUpdates = async () => {
    let { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('active', true)
      .single();
    if (error) {
      return;
    }
    if (data && data.version !== APP_VERSION) {
      setSuscriberData(data);
      message.loading(
        '¡Nueva versión disponible! La página se actualizará automáticamente en unos segundos',
        5,
      );
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } else {
      message.success('¡Tu aplicación está actualizada con la última versión!');
      setSuscriberData(null);
    }
  };

  return { checkForUpdates, suscriberData };
};

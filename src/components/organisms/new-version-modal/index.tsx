import { supabase } from '@/config/supabase';
import { APP_VERSION } from '@/constants/versions';
import { useAppSelector } from '@/hooks/useStore';
import { Button, Modal, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import UfoWebp from '@/assets/webp/ufo.webp';

type SuscriberData = {
  id: number;
  created_at: string;
  title: string;
  message: string;
  version: string;
  users_ids: string[];
  companies_ids: string[];
} | null;

const NewVersionModal = () => {
  const [suscriberData, setSuscriberData] = useState<SuscriberData>(null);
  const { authenticated } = useAppSelector(({ users }) => users?.user_auth);
  const mounted = useRef(false);

  useEffect(() => {
    if (authenticated && !mounted.current) {
      mounted.current = true;
      (async () => {
        let { data, error } = await supabase.from('notifications').select('*').eq('active', true).single();
        if (error) {
          return;
        }
        if (data && data.version !== APP_VERSION) {
          setSuscriberData(data);
        }
      })();
    }
  }, [authenticated, mounted]);

  return (
    <Modal open={!!suscriberData} footer={null} classNames={{ body: '!pb-8' }} closeIcon={null}>
      <div className="flex flex-col items-center">
        <img src={UfoWebp} alt="ufo" className="w-48" />
        <h2 className="text-2xl font-bold text-center mt-4">¡Nueva versión disponible!</h2>
        <p className="text-center mt-2">Actualiza la página para disfrutar de las nuevas funcionalidades</p>
        <div className="flex flex-col justify-center items-center gap-3 my-5">
          <Tag>Versión actual: {APP_VERSION}</Tag>
          <Tag>Nueva versión: {suscriberData?.version || 'x.x.x-xx'}</Tag>
        </div>
        <Button type="primary" size="large" onClick={() => window.location.reload()} className="mt-4">
          ¡Actualizar ahora!
        </Button>
      </div>
    </Modal>
  );
};

export default NewVersionModal;

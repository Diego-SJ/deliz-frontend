import { App } from 'antd';
import React, { useEffect, useState, useTransition } from 'react';
import { CloseCircleOutlined, FileImageOutlined, LoadingOutlined } from '@ant-design/icons';
import { Avatar, Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { storesActions } from '@/redux/reducers/stores';
import LogoFallback from '@/assets/logo-color.svg';
import '../settings/general/styles.css';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const LogoManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { modal, message } = App.useApp();
  const { store } = useAppSelector(({ stores }) => stores);
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [logoLoading, uploadLogoTransition] = useTransition();

  useEffect(() => {
    if (store) {
      setFileList(
        store.logo_url
          ? [
              {
                uid: '-1',
                name: store.logo_url,
                status: 'done',
                url: store.logo_url,
              },
            ]
          : [],
      );
    }
  }, [store?.logo_url]);

  const onUpload = async (file: UploadFile[]) => {
    uploadLogoTransition(() => {
      if (!file[0]?.originFileObj) return;
      dispatch(storesActions.saveLogo(file[0]));
    });
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    let newFileList = fileList?.map(item => ({ ...item, status: 'done' } as UploadFile)) ?? [];

    if (newFileList.length) {
      onUpload(newFileList);
      return;
    }

    modal.confirm({
      title: '¿Estás seguro de querer eliminar el logo?',
      okText: 'Confirmar',
      type: 'error',
      okType: 'danger',
      icon: <CloseCircleOutlined style={{ color: 'red' }} />,
      cancelText: 'Cancelar',
      onOk: async () => {
        await dispatch(storesActions.deleteLogo());
        message.success('Logo cambiado correctamente');
      },
    });
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button" className="w-60 h-60">
      {logoLoading ? <LoadingOutlined className="text-2xl" /> : <FileImageOutlined className="text-2xl" />}
      <div style={{ marginTop: 8 }}>{logoLoading ? 'Subiendo...' : 'Subir'}</div>
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-4 justify-center">
      {permissions?.online_store?.edit_online_store?.value ? (
        <Upload
          listType="picture-circle"
          fileList={fileList}
          multiple={false}
          style={{ width: 128, height: 128 }}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {permissions?.online_store?.edit_online_store?.value ? (fileList.length >= 1 ? null : uploadButton) : null}
        </Upload>
      ) : null}
      {previewImage ? (
        <Image
          wrapperStyle={{ display: 'none' }}
          className="w-60 h-60"
          preview={{
            visible: previewOpen,
            onVisibleChange: visible => setPreviewOpen(visible),
            afterOpenChange: visible => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      ) : (
        <>
          {!permissions?.online_store?.edit_online_store?.value ? (
            <Avatar className="w-48 h-48 bg-gray-100 p-3" src={previewImage || store?.logo_url || LogoFallback} />
          ) : null}
        </>
      )}
    </div>
  );
};

export default LogoManagement;

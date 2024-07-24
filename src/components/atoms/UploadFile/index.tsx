import React, { useState } from 'react';
import { CloseCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import { App, Image, Upload as UploadAnt } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import './styles.css';
import { useAppDispatch } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

type UploadPropsType = {
  onChange?: (fileList: UploadFile[]) => void;
  defaultFileList?: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  fileList: UploadFile<any>[];
};

const Upload: React.FC<UploadPropsType> = ({ setFileList, fileList }) => {
  const dispatch = useAppDispatch();
  const { modal } = App.useApp();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.thumbUrl && !file.url) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.thumbUrl || file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: changeFileList }) => {
    if (changeFileList.length) {
      let newFileList = changeFileList?.map(item => ({ ...item, status: 'done' } as UploadFile)) ?? [];
      setFileList(newFileList);
      return;
    }

    modal.confirm({
      title: 'Confirmar eliminación',
      okText: 'Confirmar',
      type: 'error',
      okType: 'danger',
      icon: <CloseCircleOutlined style={{ color: 'red' }} />,
      cancelText: 'Cancelar',
      onOk: async () => {
        let uid = fileList[0]?.uid;
        await dispatch(productActions.deleteImage(uid));
      },
    });
  };

  const uploadButton = (
    <div>
      <FileImageOutlined />
      <div style={{ marginTop: 8 }}>Selecciona una imagen</div>
    </div>
  );
  return (
    <>
      <div className="flex flex-col items-center gap-4 justify-center">
        <UploadAnt
          listType="picture-card"
          fileList={fileList}
          multiple={false}
          style={{ width: 128, height: 128 }}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </UploadAnt>
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            className="w-60 h-60 bg-black"
            preview={{
              visible: previewOpen,
              onVisibleChange: visible => setPreviewOpen(visible),
              afterOpenChange: visible => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
      </div>
    </>
  );
};

export default Upload;

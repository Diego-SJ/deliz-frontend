import React, { useState } from 'react';
import { CloseCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import { App, Image, Upload as UploadAnt } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAppSelector } from '@/hooks/useStore';
import { getBase64, beforeUpload } from '@/utils/images';

type UploadPropsType = {
  onChange?: (fileList: UploadFile[]) => void;
  defaultFileList?: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  fileList: UploadFile<any>[];
  deleteFunction?: (uid: string) => void;
};

const UploadEvidence: React.FC<UploadPropsType> = ({
  setFileList,
  fileList,
  deleteFunction,
}) => {
  const { modal } = App.useApp();
  const [previewOpen, setPreviewOpen] = useState(false);
  const { permissions } = useAppSelector(
    ({ users }) => users.user_auth.profile!,
  );
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.thumbUrl && !file.url) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.thumbUrl || file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({
    fileList: changeFileList,
    file,
  }) => {
    if (!permissions?.expenses?.upload_evidence?.value) {
      return null;
    }

    if (
      !!changeFileList[0] &&
      !beforeUpload(changeFileList[0]?.originFileObj as RcFile)
    ) {
      setFileList([]);
      return null;
    }

    if (changeFileList.length) {
      let newFileList =
        changeFileList?.map(
          (item) => ({ ...item, status: 'done' }) as UploadFile,
        ) ?? [];
      setFileList(newFileList);
      return;
    }

    if (file?.uid?.includes('rc-upload-')) {
      setFileList([]);
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
        if (deleteFunction) await deleteFunction(uid);
        setFileList([]);
      },
    });
  };

  const uploadButton = (
    <div className="p-3">
      <FileImageOutlined className="text-3xl text-gray-400 mb-3" />
      <div>Toma una foto o selecciona una imagen</div>
    </div>
  );
  return (
    <>
      <div className="flex flex-col items-center gap-4 justify-center">
        <UploadAnt
          listType="picture-card"
          fileList={fileList}
          multiple={false}
          className="w-full "
          style={{ height: 10 }}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </UploadAnt>
        {previewImage ? (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => {
                if (!permissions?.products?.update_image?.value) return;
                if (!visible) setPreviewImage('');
              },
            }}
            src={previewImage}
          />
        ) : null}
      </div>
    </>
  );
};

export default UploadEvidence;

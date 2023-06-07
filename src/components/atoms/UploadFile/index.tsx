import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload as UploadAnt } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

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
};

const Upload: React.FC<UploadPropsType> = props => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!!props?.defaultFileList?.length) {
      setFileList(props?.defaultFileList);
    }
  }, [props?.defaultFileList]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    let newFileList = fileList?.map(item => ({ ...item, status: 'done' } as UploadFile)) ?? [];
    setFileList(newFileList);
    if (props?.onChange) {
      props.onChange(newFileList);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined rev={{}} />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <UploadAnt listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
        {fileList.length >= 1 ? null : uploadButton}
      </UploadAnt>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default Upload;

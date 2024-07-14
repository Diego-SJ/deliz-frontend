import React, { useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/hooks/useStore';

type Props = {
  title?: string;
  content?: string;
  deleteFunction?: any;
  editFunction?: any;
  onEdit?: () => void;
};

const DeleteButton: React.FC<Props> = ({ title, content, deleteFunction, editFunction, onEdit }) => {
  const dispatch = useAppDispatch();
  const [modalStatus, setModalStatus] = useState<'edit' | 'delete' | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = (status: 'edit' | 'delete' | null) => {
    setModalStatus(status);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await dispatch(deleteFunction as any);
    setModalStatus(null);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setModalStatus(null);
  };

  const handleEdit = () => {
    if (onEdit) return onEdit();
    if (editFunction) dispatch(editFunction as any);
  };

  return (
    <>
      <div className="flex gap-3 justify-center">
        <Tooltip title="Eliminar">
          <Button onClick={() => showModal('delete')}>
            <DeleteOutlined />
          </Button>
        </Tooltip>
        {(editFunction || onEdit) && (
          <Tooltip title="Editar">
            <Button onClick={handleEdit}>
              <EditOutlined />
            </Button>
          </Tooltip>
        )}
      </div>

      <Modal
        title={title || 'Eliminar elemento'}
        open={!!modalStatus}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okType="danger"
        okText={confirmLoading ? 'Guardando...' : 'Confirmar'}
        cancelText="Cancelar"
        width={350}
      >
        <p>{content || '¿Está seguro de eliminar este elemento?'}</p>
      </Modal>
    </>
  );
};

export default DeleteButton;

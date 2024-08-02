import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppDispatch } from '@/hooks/useStore';

type Props = {
  title?: string;
  content?: string;
  deleteFunction?: any;
  editFunction?: any;
  onEdit?: () => void;
};

const ActionTableButtons: React.FC<Props> = ({ title, content, deleteFunction, editFunction, onEdit }) => {
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
      <div className="flex gap-0 w-full justify-center">
        {(editFunction || onEdit) && (
          <Button type="link" onClick={handleEdit}>
            Editar
          </Button>
        )}
        <Button danger type="link" onClick={() => showModal('delete')}>
          Eliminar
        </Button>
      </div>
      <Modal
        title={title || 'Eliminar elemento'}
        open={!!modalStatus}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={confirmLoading ? 'Guardando...' : 'Confirmar'}
        cancelText="Cancelar"
        width={350}
      >
        <p>{content || '¿Está seguro de eliminar este elemento?'}</p>
      </Modal>
    </>
  );
};

export default ActionTableButtons;

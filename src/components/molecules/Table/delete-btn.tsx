import React, { useState } from 'react';
import { Button, Col, Modal, Row, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/hooks/useStore';

type Props = {
  title?: string;
  content?: string;
  deleteFunction?: any;
  editFunction?: any;
};

const DeleteButton: React.FC<Props> = ({ title, content, deleteFunction, editFunction }) => {
  const dispatch = useAppDispatch();
  const [modalStatus, setModalStatus] = useState<'edit' | 'delete' | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = (status: 'edit' | 'delete' | null) => {
    setModalStatus(status);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await dispatch(deleteFunction as any);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setModalStatus(null);
  };

  const handleEdit = () => {
    dispatch(editFunction as any);
  };

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col>
          <Tooltip title="Eliminar">
            <Button onClick={() => showModal('delete')}>
              <DeleteOutlined rev={{}} />
            </Button>
          </Tooltip>
        </Col>
        {editFunction && (
          <Col>
            <Tooltip title="Editar">
              <Button onClick={handleEdit}>
                <EditOutlined rev={{}} />
              </Button>
            </Tooltip>
          </Col>
        )}
      </Row>
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

export default DeleteButton;

import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { DeleteOutlined } from '@ant-design/icons';
import useMediaQuery from '@/hooks/useMediaQueries';

type Props = {
  title?: string;
  content?: string;
  deleteFunction?: any;
  editFunction?: any;
  onEdit?: () => void;
};

const DeleteSaleButton: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { current_sale } = useAppSelector(({ sales }) => sales);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { isTablet } = useMediaQuery();

  const handleOk = async () => {
    if (!current_sale?.metadata?.sale_id) {
      message.error('No se pudo eliminar la venta.', 4);
      return;
    }

    setConfirmLoading(true);
    const result = await dispatch(salesActions.deleteSaleById(current_sale?.metadata?.sale_id));
    if (result) {
      navigation(APP_ROUTES.PRIVATE.SALES.path);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button danger type="primary" size={isTablet ? 'large' : 'middle'} block onClick={onClick} icon={<DeleteOutlined />}>
        {isTablet ? 'Eliminar' : 'Eliminar venta'}
      </Button>
      <Modal
        title={'Eliminar venta'}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okType="danger"
        okText={confirmLoading ? 'Guardando...' : 'Confirmar'}
        cancelText="Cancelar"
        width={350}
      >
        <p>¿Está seguro de eliminar esta venta?</p>
      </Modal>
    </>
  );
};

export default DeleteSaleButton;

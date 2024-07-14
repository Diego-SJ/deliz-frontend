import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Cashier, Sale } from '@/redux/reducers/sales/types';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Select, Typography } from 'antd';
import { FC, useState } from 'react';
import { Amounts } from './index';

type UpdateSaleButton = {
  amounts?: Amounts;
};

const { Title, Paragraph } = Typography;

const findCashierById = (cashiers?: Cashier[], id?: number) => {
  return cashiers?.find(i => i?.cashier_id === id)?.name;
};

const UpdateCashier: FC<UpdateSaleButton> = () => {
  const dispatch = useAppDispatch();
  const { cashiers, current_sale } = useAppSelector(({ sales }) => sales);

  const [cashierId, setCashierId] = useState<number>(cashiers?.activeCashier?.cashier_id || -1); // 4 paid, 5 pending, 6 cancelled
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOk = async () => {
    setLoading(true);

    const newSale: Sale = {
      cashier_id: cashierId,
      sale_id: current_sale?.metadata?.sale_id,
    };

    const success = await dispatch(salesActions.updateSale(newSale));

    if (success) {
      closeModal();
    }
    setLoading(false);
  };

  const openModal = () => {
    setOpen(true);
    // setSaleStatus(current_sale.metadata?.status_id as number);
    // setTimeout(() => {
    //   priceRef.current?.focus();
    //   priceRef.current?.select();
    // }, 300);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="default" icon={<EditOutlined />} block onClick={openModal}>
        Editar Caja
      </Button>

      <Modal
        open={open}
        onCancel={closeModal}
        maskClosable={false}
        destroyOnClose
        width={380}
        footer={[
          <Row key="actions" gutter={10} style={{ marginTop: 30 }}>
            <Col span={12}>
              <Button key="back" block onClick={closeModal} loading={loading}>
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                type="primary"
                onClick={handleOk}
                disabled={current_sale?.metadata?.cashier_id === cashierId}
                loading={loading}
              >
                Actualizar
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <Title level={4} style={{ margin: 0 }}>
          Caja actual:
        </Title>
        <Title level={5} style={{ margin: 0 }}>
          {current_sale?.metadata?.cashier_id ? `${findCashierById(cashiers?.data, current_sale?.metadata?.cashier_id)}` : ''}
        </Title>

        <Paragraph style={{ margin: '10px 0 5px', fontWeight: 600 }}>Nueva caja:</Paragraph>
        <Select
          style={{ width: '100%' }}
          placeholder="Selecciona una caja"
          virtual={false}
          options={cashiers?.data?.map(i => ({ label: i?.name, value: i?.cashier_id }))}
          onChange={setCashierId}
        />
      </Modal>
    </>
  );
};

export default UpdateCashier;

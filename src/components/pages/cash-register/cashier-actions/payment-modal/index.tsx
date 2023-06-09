import { STATUS_DATA } from '@/constants/status';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Sale } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { Button, Col, Form, InputNumber, Modal, Row, Select, Typography, message } from 'antd';
import { useState } from 'react';

type PaymentModalProps = {
  open?: boolean;
  total: number;
  onClose?: () => void;
  onSuccess?: () => void;
};

const PaymentModal = ({ open, onClose, total = 0 }: PaymentModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [cashback, setCashback] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const getSaleStatus = () => {
    let _cashback = total - cashback;
    if (_cashback > 0) return STATUS_DATA.PENDING.id;
    return STATUS_DATA.COMPLETED.id;
  };

  const handleOk = async () => {
    setLoading(true);
    if (!!!cash_register?.customer_id) {
      setLoading(false);
      return message.info('Selecciona un cliente para poder finalizar la venta');
    }
    const newSale: Sale = { payment_method: form.getFieldValue('payment_method'), status_id: getSaleStatus() };
    const sale = await dispatch(salesActions.createSale(newSale));
    if (sale?.sale_id) {
      let success = await dispatch(salesActions.saveSaleItems(sale));

      if (success) {
        form.resetFields();
        handleClose();
        dispatch(salesActions.cashRegister.reset());
      }
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      destroyOnClose
      width={380}
      footer={[
        <Row key="actions" gutter={10}>
          <Col span={12}>
            <Button key="back" size="large" block onClick={handleClose} loading={loading}>
              Cancelar
            </Button>
          </Col>
          <Col span={12}>
            <Button block type="primary" onClick={handleOk} size="large" disabled={!cashback} loading={loading}>
              Guardar
            </Button>
          </Col>
        </Row>,
      ]}
    >
      <Typography.Title
        level={2}
        type="success"
        style={{ margin: '20px 0 10px', textAlign: 'center' }}
      >{`Total: ${functions.money(total)}`}</Typography.Title>
      <Form form={form} layout="vertical" initialValues={{ payment_method: 'CASH' }}>
        <Form.Item name="payment_method" label="Método de pago">
          <Select size="large">
            <Select.Option value="CASH">Efectivo</Select.Option>
            <Select.Option value="CARD">Tarjeta</Select.Option>
            <Select.Option value="TRANSFER">Transferencia</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="received_amount" label="Cantidad recibida">
          <InputNumber
            min={0}
            placeholder="0"
            size="large"
            style={{ width: '100%' }}
            onChange={value => setCashback(value || 0)}
          />
        </Form.Item>
        <Typography.Title
          level={4}
          type={total - cashback > 0 ? 'danger' : 'success'}
          style={{ margin: '0px 0 30px', textAlign: 'center' }}
        >{`${total - cashback > 0 ? 'Por pagar' : 'Cambio'}: ${functions.money(Math.abs(total - cashback))}`}</Typography.Title>
      </Form>
    </Modal>
  );
};

export default PaymentModal;

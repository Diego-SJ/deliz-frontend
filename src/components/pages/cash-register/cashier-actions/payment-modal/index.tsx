import NumberKeyboard from '@/components/atoms/NumberKeyboard';
import { PAYMENT_METHODS } from '@/constants/payment_methods';
import { STATUS_DATA } from '@/constants/status';
import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { PaymentMethod, Sale } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { Button, Col, DatePicker, InputNumber, Modal, Row, Select, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

type PaymentModalProps = {
  open?: boolean;
  total: number;
  onClose?: () => void;
  onSuccess?: () => void;
};

const { Title, Paragraph } = Typography;

const PaymentModal = ({ open, onClose, total = 0 }: PaymentModalProps) => {
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [receivedMoney, setReceivedMoney] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { isTablet } = useMediaQuery();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 300);
    }

    return () => {
      inputRef.current = null;
    };
  }, [open]);

  const handleClose = () => {
    if (onClose) onClose();
    setReceivedMoney(0);
    setPaymentMethod('CASH');
    inputRef.current = null;
  };

  const getSaleStatus = () => {
    if (cash_register.mode === 'order') return STATUS_DATA.ORDER.id;
    let _cashback = total - receivedMoney;
    if (_cashback > 0) return STATUS_DATA.PENDING.id;
    return STATUS_DATA.COMPLETED.id;
  };

  const handleOk = async () => {
    setLoading(true);
    if (!!!cash_register?.customer_id) {
      setLoading(false);
      return message.info('Selecciona un cliente para poder finalizar la venta');
    }

    let newSale: Sale = {
      payment_method: paymentMethod,
      status_id: getSaleStatus(),
      amount_paid: receivedMoney || 0,
      cashback: total - receivedMoney >= 0 ? 0 : Math.abs(total - receivedMoney),
      total: total,
    };

    if (deliveryDate) newSale.order_due_date = deliveryDate;

    const sale = await dispatch(salesActions.createSale(newSale));

    if (sale?.sale_id) {
      let success = await dispatch(salesActions.saveSaleItems(sale));

      if (success) {
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
            <Button block type="primary" onClick={handleOk} size="large" disabled={receivedMoney < 0} loading={loading}>
              {getSaleStatus() === STATUS_DATA.PENDING.id ? 'Pagar luego' : 'Finalizar'}
            </Button>
          </Col>
        </Row>,
      ]}
    >
      <Title level={2} style={{ margin: '20px 0 10px', textAlign: 'center' }}>{`Total: ${functions.money(total)}`}</Title>

      <Paragraph style={{ margin: '0 0 5px', fontWeight: 600 }}>Método de pago</Paragraph>
      <Select
        style={{ width: '100%', marginBottom: 10 }}
        size="large"
        virtual={false}
        value={paymentMethod}
        options={PAYMENT_METHODS}
        onChange={value => setPaymentMethod(value)}
      />

      {cash_register?.mode !== 'order' ? (
        <>
          <Paragraph style={{ margin: '0 0 5px', fontWeight: 600 }}>Cantidad recibida</Paragraph>
          <InputNumber
            ref={inputRef}
            min={0}
            placeholder="0"
            size="large"
            addonBefore="$"
            value={receivedMoney}
            style={{ width: '100%', marginBottom: 10 }}
            readOnly={isTablet}
            onFocus={target => {
              target.currentTarget.select();
            }}
            onChange={value => setReceivedMoney(value || 0)}
          />

          <Title level={4} type={total - receivedMoney > 0 ? 'danger' : 'success'} style={{ margin: '0', textAlign: 'center' }}>
            {`${total - receivedMoney > 0 ? 'Por pagar' : 'Cambio'}: ${functions.money(Math.abs(total - receivedMoney))}`}
          </Title>
          {isTablet && <NumberKeyboard value={receivedMoney} withDot onChange={value => setReceivedMoney(value || 0)} />}
        </>
      ) : (
        <>
          <Paragraph style={{ margin: '0 0 5px', fontWeight: 600 }}>Fecha de entrega</Paragraph>
          <DatePicker
            style={{ width: '100%', marginBottom: 10 }}
            size="large"
            showTime
            format="YYYY-MM-DD HH:mm"
            value={deliveryDate}
            onChange={date => setDeliveryDate(date)}
          />
        </>
      )}
    </Modal>
  );
};

export default PaymentModal;

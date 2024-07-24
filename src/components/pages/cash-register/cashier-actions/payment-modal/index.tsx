import { PAYMENT_METHODS_KEYS } from '@/constants/payment_methods';
import { STATUS_DATA } from '@/constants/status';
import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Sale } from '@/redux/reducers/sales/types';
import { APP_ROUTES } from '@/routes/routes';
import functions from '@/utils/functions';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Drawer,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
  message,
  notification,
} from 'antd';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentMethods from './payment-methods';

type PaySaleFormProps = {
  open?: boolean;
  total: number;
  onClose?: () => void;
  onSuccess?: () => void;
};

const { Title, Paragraph } = Typography;

const PaySaleForm = ({ open, onClose, total = 0 }: PaySaleFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [receivedMoney, setReceivedMoney] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string | string[]>(PAYMENT_METHODS_KEYS.CASH);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { isTablet } = useMediaQuery();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [api, contextHolder] = notification.useNotification();

  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      touchEndY.current = null; // Reset touch end
      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      touchEndY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartY.current !== null && touchEndY.current !== null) {
        const deltaY = touchStartY.current - touchEndY.current;
        // Detect if swipe down (swipe down will have deltaY < 0)
        if (deltaY < -50) {
          if (onClose) onClose();
          console.log('Swipe down detected');
          // Ejecuta la acción deseada para el swipe down
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onClose]);

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

  const openSaleDetails = (sale: Sale) => {
    api.destroy();
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.SALE_DETAIL.hash`${Number(sale?.sale_id)}`);
  };

  const showSaleCreatedMessage = (sale: Sale) => {
    const key = `open${Date.now()}`;
    const btn = (
      <div className="flex gap-4">
        <Button type="default" size="large" onClick={() => api.destroy()}>
          Cerrar
        </Button>
        <Button type="primary" size="large" onClick={() => openSaleDetails(sale)}>
          Ver detalle
        </Button>
      </div>
    );
    api.open({
      message: 'Venta registrada',
      description: 'Da click en "Ver detalle" para ver la venta registrada o en "Cerrar" para continuar con otra venta.',
      btn,
      key,
      type: 'success',
      onClose: close,
      duration: 4,
    });
  };

  const handleClose = () => {
    if (onClose) onClose();
    setReceivedMoney(0);
    setPaymentMethod(PAYMENT_METHODS_KEYS.CASH);
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
      payment_method: paymentMethod as string,
      status_id: getSaleStatus(),
      amount_paid: receivedMoney || 0,
      cashback: total - receivedMoney >= 0 ? 0 : Math.abs(total - receivedMoney),
      total: total,
    };

    if (deliveryDate) newSale.order_due_date = deliveryDate;

    const sale = await dispatch(salesActions.createSale(newSale));

    if (!!sale?.sale_id) {
      let success = await dispatch(salesActions.saveSaleItems(sale as Sale));

      if (success) {
        handleClose();
        dispatch(salesActions.cashRegister.reset());
        showSaleCreatedMessage(sale as Sale);
      }
    }
    setLoading(false);
  };

  const PaymentForm = useCallback(() => {
    return (
      <>
        {cash_register?.mode !== 'order' ? (
          <></>
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
      </>
    );
  }, [receivedMoney, total, cash_register]);

  return (
    <div>
      {contextHolder}
      {!isTablet ? (
        <Modal
          open={open}
          onCancel={handleClose}
          title="Finalizar venta"
          style={{ top: 50 }}
          width={500}
          footer={
            [
              // <Row key="actions" gutter={10}>
              //   <Col span={12}>
              //     <Button key="back" size="large" block onClick={handleClose} loading={loading}>
              //       Cancelar
              //     </Button>
              //   </Col>
              //   <Col span={12}>
              //     <Button block type="primary" onClick={handleOk} size="large" disabled={receivedMoney < 0} loading={loading}>
              //       {getSaleStatus() === STATUS_DATA.PENDING.id ? 'Pagar luego' : 'Finalizar'}
              //     </Button>
              //   </Col>
              // </Row>,
            ]
          }
        >
          <PaymentMethods total={total} />
        </Modal>
      ) : (
        <Drawer title="Finalizar venta" height="90dvh" open={open} onClose={handleClose} placement="bottom">
          <PaymentMethods total={total} />
        </Drawer>
      )}
    </div>
  );
};

export default memo(PaySaleForm);

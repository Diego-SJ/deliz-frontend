import useMediaQuery from '@/hooks/useMediaQueries';
import { Drawer, Modal } from 'antd';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import PaymentMethods from './payment-methods';
import { PAYMENT_METHODS_KEYS } from '@/constants/payment_methods';
import { Sale } from '@/redux/reducers/sales/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';

type PaySaleFormProps = {
  open?: boolean;
  total: number;
  onClose?: () => void;
  onSuccess?: () => void;
};

const initialFinishSaleData = {
  receivedMoney: 0,
  paymentMethod: PAYMENT_METHODS_KEYS.CASH,
  deliveryDate: '',
  saleCreated: null,
};

export type FinishSaleData = {
  receivedMoney: number;
  paymentMethod: string;
  deliveryDate: string;
  saleCreated: Sale | null;
};

const PaySaleForm = ({ open, onClose, total = 0 }: PaySaleFormProps) => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const [finishSaleData, setFinishSaleData] = useState<FinishSaleData>(initialFinishSaleData);
  const { mode } = useAppSelector(({ sales }) => sales.cash_register);
  const isOrder = mode === 'order';

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    setFinishSaleData(initialFinishSaleData);

    if (finishSaleData?.saleCreated?.sale_id) {
      dispatch(salesActions.cashRegister.reset());
    }
  }, [dispatch, finishSaleData, onClose]);

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
          handleClose();
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
  }, [handleClose]);

  return (
    <div>
      {!isTablet ? (
        <Modal open={open} onCancel={handleClose} style={{ top: 50 }} width={500} footer={null}>
          <PaymentMethods total={total} onSuccess={handleClose} onChange={setFinishSaleData} value={finishSaleData} />
        </Modal>
      ) : (
        <Drawer
          title={`Finalizar ${isOrder ? 'venta' : 'pedido'}`}
          height="90dvh"
          open={open}
          onClose={handleClose}
          placement="bottom"
        >
          <PaymentMethods total={total} onSuccess={handleClose} onChange={setFinishSaleData} value={finishSaleData} />
        </Drawer>
      )}
    </div>
  );
};

export default memo(PaySaleForm);

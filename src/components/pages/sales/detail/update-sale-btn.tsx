import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Sale } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { CreditCardOutlined, DollarOutlined, SwapOutlined } from '@ant-design/icons';
import { App, Button, Collapse, InputNumber, Modal, Tag, Typography } from 'antd';
import { FC, useRef, useState } from 'react';
import { Amounts } from './index';
import { PAYMENT_METHODS_KEYS } from '@/constants/payment_methods';
import { STATUS_DATA } from '@/constants/status';

type UpdateSaleButton = {
  amounts: Amounts;
};

const UpdateSaleButton: FC<UpdateSaleButton> = ({ amounts }) => {
  const dispatch = useAppDispatch();
  const { current_sale } = useAppSelector(({ sales }) => sales);
  const { active_cash_cut } = useAppSelector(({ cashiers }) => cashiers);
  const [receivedMoney, setReceivedMoney] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { isTablet } = useMediaQuery();
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS_KEYS.CASH);
  const { total = 0, amount_paid, pending } = amounts;
  const cashback = pending - receivedMoney;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [_, suggestion1, suggestion2] = functions.getRoundedValues(pending);
  const { message } = App.useApp();

  const handleCancel = () => {
    setReceivedMoney(0);
    setPaymentMethod(PAYMENT_METHODS_KEYS.CASH);
    setOpen(false);
  };

  const handleOk = async () => {
    if (receivedMoney <= 0) {
      message.error(`El monto recibido debe ser mayor o igual a ${functions.money(pending)}`);
      return;
    }
    setLoading(true);

    const newSale: Sale = {
      status_id: STATUS_DATA.PAID.id,
      amount_paid: receivedMoney + amount_paid >= total ? total : receivedMoney + amount_paid,
      sale_id: current_sale?.metadata?.sale_id,
      cashback: cashback >= 0 ? 0 : Math.abs(cashback),
      payment_method: paymentMethod,
      cash_cut_id: active_cash_cut?.cash_cut_id || current_sale?.metadata?.cash_cut_id,
    } as Sale;

    const success = await dispatch(salesActions.upsertSale(newSale));

    if (success) handleCancel();
    setLoading(false);
  };

  const openModal = () => {
    setOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 300);
  };

  return (
    <>
      <Button size={isTablet ? 'large' : 'middle'} type="primary" icon={<DollarOutlined />} block onClick={openModal}>
        Registrar Cobro
      </Button>

      <Modal open={open} onCancel={handleCancel} destroyOnClose width={400} footer={null}>
        <div className="bg-gray-50 text-center rounded-lg px-5 py-6 mb-4">
          <Typography.Paragraph className="!m-0 text-lg font-normal text-gray-400">Monto pendiente</Typography.Paragraph>
          <Typography.Title level={2} className="!m-0 !font-extrabold !text-5xl">
            {functions.money(pending)}
          </Typography.Title>
          {receivedMoney - pending > 0 && (
            <Tag bordered={false} color="blue" className="mt-3 px-3 py-1 text-base">
              Cambio {functions.money(receivedMoney - pending)}
            </Tag>
          )}
        </div>
        <Collapse
          defaultActiveKey={[PAYMENT_METHODS_KEYS.CASH]}
          accordion
          destroyInactivePanel={false}
          onChange={value => {
            let _paymentMethod = typeof value === 'string' ? value : value[0];
            setReceivedMoney(_paymentMethod !== PAYMENT_METHODS_KEYS.CASH ? pending : 0);
            setPaymentMethod(_paymentMethod);
          }}
          items={[
            {
              key: PAYMENT_METHODS_KEYS.CASH,
              label: (
                <div className="flex items-center gap-3">
                  <DollarOutlined />
                  Efectivo
                </div>
              ),
              showArrow: false,
              children: (
                <>
                  <InputNumber
                    ref={inputRef}
                    min={0}
                    placeholder="0"
                    size="large"
                    addonBefore="$"
                    value={receivedMoney}
                    style={{ width: '100%', marginBottom: 10 }}
                    onFocus={target => {
                      target.currentTarget.select();
                    }}
                    type="number"
                    inputMode="decimal"
                    onChange={value => {
                      setReceivedMoney(value || 0);
                    }}
                    onPressEnter={handleOk}
                  />
                  <div className="flex justify-between gap-4">
                    {receivedMoney > 0 ? (
                      <Button
                        className="w-full"
                        type="primary"
                        size="large"
                        disabled={receivedMoney < total}
                        loading={loading}
                        onClick={handleOk}
                      >
                        {receivedMoney < total ? 'Monto menor al total' : `Recibir ${functions.money(receivedMoney)}`}
                      </Button>
                    ) : (
                      <>
                        <Button className="w-full" type="primary" size="large" onClick={() => setReceivedMoney(total)}>
                          {functions.money(total)}
                        </Button>
                        <Button className="w-full" type="primary" size="large" onClick={() => setReceivedMoney(suggestion1)}>
                          {functions.money(suggestion1)}
                        </Button>
                        <Button className="w-full" type="primary" size="large" onClick={() => setReceivedMoney(suggestion2)}>
                          {functions.money(suggestion2)}
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ),
            },
            {
              key: PAYMENT_METHODS_KEYS.CC,
              label: (
                <div className="flex items-center gap-3">
                  <CreditCardOutlined />
                  Tarjeta de crédito
                </div>
              ),
              showArrow: false,
              children: (
                <>
                  <Typography.Paragraph className="!m-0 !mb-3 text-md font-normal" type="secondary">
                    Registrar compra con tarjeta de crédito
                  </Typography.Paragraph>
                  <Button type="primary" block size="large" loading={loading} onClick={handleOk}>
                    Cobrar {functions.money(pending)}
                  </Button>
                </>
              ),
            },
            {
              key: PAYMENT_METHODS_KEYS.DC,
              label: (
                <div className="flex items-center gap-3">
                  <CreditCardOutlined />
                  Tarjeta de debito
                </div>
              ),
              showArrow: false,
              children: (
                <>
                  <Typography.Paragraph className="!m-0 !mb-3 text-md font-normal" type="secondary">
                    Registrar compra con tarjeta de debito
                  </Typography.Paragraph>
                  <Button type="primary" block size="large" loading={loading} onClick={handleOk}>
                    Cobrar {functions.money(pending)}
                  </Button>
                </>
              ),
            },
            {
              key: PAYMENT_METHODS_KEYS.TRANSFER,
              label: (
                <div className="flex items-center gap-3">
                  <SwapOutlined />
                  Transferencia
                </div>
              ),
              showArrow: false,
              children: (
                <>
                  <Typography.Paragraph className="!m-0 !mb-3 text-md font-normal" type="secondary">
                    Registrar compra con transferencia
                  </Typography.Paragraph>
                  <Button type="primary" block size="large" loading={loading} onClick={handleOk}>
                    Cobrar {functions.money(pending)}
                  </Button>
                </>
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default UpdateSaleButton;

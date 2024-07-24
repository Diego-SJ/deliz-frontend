import { PAYMENT_METHODS_KEYS } from '@/constants/payment_methods';
import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { CreditCardOutlined, DollarOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Collapse, InputNumber, Tag, Typography } from 'antd';
import React, { memo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  total: number;
};

const PaymentMethods = ({ total }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [receivedMoney, setReceivedMoney] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string | string[]>(PAYMENT_METHODS_KEYS.CASH);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { isTablet } = useMediaQuery();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [suggestion1, suggestion2] = functions.findNearestDenominations(total);

  return (
    <div>
      <div className="bg-gray-50 text-center rounded-lg px-5 py-6 mb-4">
        <Typography.Paragraph className="!m-0 text-lg font-normal text-gray-400">Total a cobrar</Typography.Paragraph>
        <Typography.Title level={2} className="!m-0 !font-extrabold !text-5xl">
          {functions.money(total)}
        </Typography.Title>
        {receivedMoney - total > 0 && (
          <Tag bordered={false} color="blue" className="mt-3 px-3 py-1 text-base">
            Cambio {functions.money(receivedMoney - total)}
          </Tag>
        )}
      </div>

      <div className="flex justify-between items-center mb-3">
        <Typography.Title level={5}>Método de pago</Typography.Title>
        <Button size="small" type="link" className="pb-1">
          Guardar como pendiente
        </Button>
      </div>

      <Collapse
        defaultActiveKey={[PAYMENT_METHODS_KEYS.CASH]}
        accordion
        destroyInactivePanel={false}
        onChange={value => {
          setPaymentMethod(value);
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
                />
                <div className="flex justify-between gap-4">
                  {receivedMoney > 0 ? (
                    <Button className="w-full" type="primary" size="large" onClick={() => setReceivedMoney(total)}>
                      Recibir {functions.money(receivedMoney)}
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
                <Button type="primary" block size="large">
                  Cobrar {functions.money(total)}
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
                <Button type="primary" block size="large">
                  Cobrar {functions.money(total)}
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
                <Button type="primary" block size="large">
                  Cobrar {functions.money(total)}
                </Button>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default memo(PaymentMethods);

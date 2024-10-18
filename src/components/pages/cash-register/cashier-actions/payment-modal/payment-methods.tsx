import { PAYMENT_METHOD_SHORT_NAME, PAYMENT_METHODS_KEYS } from '@/constants/payment_methods';
import { STATUS_DATA } from '@/constants/status';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Sale } from '@/redux/reducers/sales/types';
import { APP_ROUTES } from '@/routes/routes';
import functions from '@/utils/functions';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ExportOutlined,
  LoadingOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { App, Avatar, Button, Collapse, DatePicker, InputNumber, Tag, Typography } from 'antd';
import { Dispatch, memo, SetStateAction, useRef, useState } from 'react';
import { FinishSaleData } from '.';
import useMediaQuery from '@/hooks/useMediaQueries';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { connectPrinter, disconnectPrinter, printData } from '@/redux/reducers/printer';
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import { cashierHelpers } from '@/utils/cashiers';
import { Branch } from '@/redux/reducers/branches/type';
import useDeviceInfo from '@/feature-flags/useDeviceInfo';

type Props = {
  total: number;
  onSuccess?: () => void;
  value: FinishSaleData;
  onChange?: Dispatch<SetStateAction<FinishSaleData>>;
};

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

const PaymentMethods = ({ total, onSuccess = () => null, onChange = () => null, value }: Props) => {
  const { message } = App.useApp();
  const { isTablet } = useMediaQuery();
  const dispatch = useAppDispatch();
  const { mode, items, customer_id } = useAppSelector(({ sales }) => sales.cash_register);
  const { isConnected, device, error } = useAppSelector(({ printer }) => printer);
  const { currentBranch, currentCashRegister } = useAppSelector(({ branches }) => branches);
  const { customers } = useAppSelector(({ customers }) => customers);
  const { company } = useAppSelector(({ app }) => app);
  const { isDesktop, browserName } = useDeviceInfo();

  const [orderDueDate, setOrderDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [_, suggestion1, suggestion2] = functions.getRoundedValues(total);
  const { receivedMoney, paymentMethod, saleCreated } = value;
  const isOrder = mode === 'order';

  const saveSale = async (statusId: number) => {
    setLoading(true);

    let newSale: Partial<Sale> = {
      payment_method: paymentMethod as string,
      status_id: statusId,
      amount_paid: statusId === STATUS_DATA.PAID.id ? receivedMoney || 0 : 0,
      cashback:
        statusId === STATUS_DATA.PAID.id ? (total - receivedMoney >= 0 ? 0 : Math.abs(total - receivedMoney)) : 0,
      total: total,
    };

    if (isOrder) newSale.order_due_date = orderDueDate;

    const sale = await dispatch(salesActions.createSale(newSale));

    if (!!sale?.sale_id) {
      let success = await dispatch(salesActions.saveSaleItems(sale as Sale));
      if (success) {
        onChange((prev) => ({ ...prev, saleCreated: sale as Sale }));
        handlePrint(sale);
      }
    }
    setLoading(false);
  };

  const reconnectPrinter = () => {
    message.loading('La impresora no está conectada, conecta la impresora e intenta de nuevo.');
    dispatch(disconnectPrinter());
    dispatch(connectPrinter());
  };

  const handlePrint = async (sale: Sale) => {
    if (!isConnected || !device || error || (!isDesktop && browserName !== 'Chrome')) {
      return;
    }

    const customer = customers.find((item) => item?.customer_id === customer_id);
    let subtotal = 0;
    const tableRows = (items || [])?.map((item) => {
      subtotal += (item.quantity || 0) * (item.price || 0);
      return [
        item?.product?.name || '- - -',
        (item.quantity || 0).toString(),
        functions.money(item.price || 0),
        functions.money((item.quantity || 0) * (item.price || 0)),
      ];
    });

    try {
      let encoder = new ReceiptPrinterEncoder({ language: device?.language, width: 32 });
      encoder
        .initialize()
        .codepage('auto')
        .newline()
        .align('center')
        .text('Recibo de venta')
        .newline()
        .align('left')
        .size(2, 2)
        .text(company?.name || 'Possify')
        .newline()
        .newline()
        .size(1, 1)
        .align('left')
        .text('Fecha de venta:')
        .newline()
        .align('left')
        .text(functions.formatToLocalTimezone(sale?.created_at?.toString() || ''))
        .newline()
        .newline()
        .align('left')
        .line('Cliente:')
        .line(`Nombre: ${customer?.name || 'Público General'}`)
        .line(`Teléfono: ${customer?.phone || 'N/A'}`)
        .line(`Dirección: ${customer?.address || 'N/A'}`)
        .newline()
        .font('B')
        .table(
          [
            { width: 12, align: 'left' },
            { width: 10, align: 'center' },
            { width: 10, align: 'center' },
            { width: 10, align: 'right' },
          ],
          [
            [
              (encoder) => encoder.bold(true).text('Nombre').bold(false),
              (encoder) => encoder.bold(true).text('Cant.').bold(false),
              (encoder) => encoder.bold(true).text('Precio').bold(false),
              (encoder) => encoder.bold(true).text('Total').bold(false),
            ],
            [
              (encoder) => encoder.rule(),
              (encoder) => encoder.rule(),
              (encoder) => encoder.rule(),
              (encoder) => encoder.rule(),
            ],
            ...tableRows,
          ],
        )
        .font('A')
        .newline()
        .align('left')
        .text(`Artículos: ${items?.reduce((acc, item) => acc + (item?.quantity || 0), 0)}`)
        .newline()
        .newline()
        .align('right')
        .text(`Subtotal: ${functions.money(subtotal || 0)}`);

      if (!!sale?.shipping) {
        encoder
          .newline()
          .align('right')
          .text(`Envio: ${functions.money(sale?.shipping || 0)}`);
      }
      if (!!sale?.discount) {
        encoder
          .newline()
          .align('right')
          .text(
            `Descuento: ${sale?.discount_type === 'AMOUNT' ? '$' : ''}${sale?.discount}${
              sale?.discount_type === 'PERCENTAGE' ? '%' : ''
            }`,
          );
      }

      encoder
        .newline()
        .align('right')
        .text(`TOTAL: ${functions.money(sale?.total || 0)}`)
        .newline()
        .newline()

        .newline()
        .align('center')
        .text(`Recibido: ${functions.money(receivedMoney || 0)}`)
        .newline()
        .align('center')
        .text(`Cambio: ${functions.money(sale?.cashback || 0)}`)
        .newline()
        .align('center')
        .text(`Forma de pago: ${PAYMENT_METHOD_SHORT_NAME[sale?.payment_method || ''] || '- - -'}`)
        .newline()
        .align('center')
        .text(`Estatus de la venta: ${sale?.status_id === STATUS_DATA.PENDING.id ? 'Pendiente' : 'Pagado'}`)
        .newline()
        .align('center')
        .text(`${company?.name || '- - -'}`)
        .newline()
        .align('center')
        .text(`Sucursal ${currentBranch?.name || '- - -'}`)
        .newline()
        .align('center')
        .text(`Caja ${currentCashRegister?.name || '- - -'}`)
        .newline()
        .align('center')
        .text(cashierHelpers.getAddress(currentBranch as Branch))
        .newline()
        .align('center')
        .text(`Contacto: ${currentBranch?.phone || company?.phone || 'Tel.: N/A'}`)
        .newline()
        .newline()
        .align('center')
        .text('¡GRACIAS POR SU COMPRA!')
        .cut()
        .newline()
        .newline()
        .newline();

      dispatch(printData(encoder.encode()));
    } catch (error) {
      reconnectPrinter();
    }
  };

  return (
    <div>
      {browserName}
      {!saleCreated?.sale_id && !isTablet && (
        <Typography.Title level={5} className="mb-3">
          Finalizar {isOrder ? 'pedido' : 'venta'}
        </Typography.Title>
      )}
      {!saleCreated?.sale_id ? (
        <>
          <div className="bg-gray-50 text-center rounded-lg px-5 py-6 mb-4">
            <Typography.Paragraph className="!m-0 text-lg font-normal text-gray-400">Total</Typography.Paragraph>
            <Typography.Title level={2} className="!m-0 !font-extrabold !text-5xl">
              {functions.money(total)}
            </Typography.Title>
            {receivedMoney - total > 0 && (
              <Tag bordered={false} color="blue" className="mt-3 px-3 py-1 text-base">
                Cambio {functions.money(receivedMoney - total)}
              </Tag>
            )}
          </div>

          {!isOrder && (
            <div className={`flex justify-between items-center mb-3`}>
              <Typography.Title level={5}>Método de pago</Typography.Title>
              <Button
                icon={loading ? <LoadingOutlined /> : null}
                size="small"
                type="link"
                className="pb-1"
                onClick={() => saveSale(STATUS_DATA.PENDING.id)}
              >
                Guardar como pendiente
              </Button>
            </div>
          )}

          {!isOrder && (
            <Collapse
              defaultActiveKey={[PAYMENT_METHODS_KEYS.CASH]}
              accordion
              destroyInactivePanel={false}
              onChange={(value) => {
                if (value[0] !== PAYMENT_METHODS_KEYS.CASH) {
                  onChange((prev) => ({ ...prev, receivedMoney: total }));
                }
                onChange((prev) => ({ ...prev, paymentMethod: value[0] }));
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
                        onFocus={(target) => {
                          target.currentTarget.select();
                        }}
                        type="number"
                        inputMode="decimal"
                        onChange={(value) => {
                          onChange((prev) => ({ ...prev, receivedMoney: value || 0 }));
                        }}
                      />
                      <div className="flex justify-between gap-4">
                        {receivedMoney > 0 ? (
                          <Button
                            className="w-full"
                            type="primary"
                            size="large"
                            disabled={receivedMoney < total}
                            loading={loading}
                            onClick={() => {
                              saveSale(STATUS_DATA.PAID.id);
                            }}
                          >
                            {receivedMoney < total
                              ? 'Monto menor al total'
                              : `Recibir ${functions.money(receivedMoney)}`}
                          </Button>
                        ) : (
                          <>
                            <Button
                              className="w-full"
                              type="primary"
                              size="large"
                              onClick={() => onChange((prev) => ({ ...prev, receivedMoney: total }))}
                            >
                              {functions.money(total)}
                            </Button>
                            <Button
                              className="w-full"
                              type="primary"
                              size="large"
                              onClick={() => onChange((prev) => ({ ...prev, receivedMoney: suggestion1 }))}
                            >
                              {functions.money(suggestion1)}
                            </Button>
                            <Button
                              className="w-full"
                              type="primary"
                              size="large"
                              onClick={() => onChange((prev) => ({ ...prev, receivedMoney: suggestion2 }))}
                            >
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
                      <Button
                        type="primary"
                        block
                        size="large"
                        loading={loading}
                        onClick={() => {
                          saveSale(STATUS_DATA.PAID.id);
                        }}
                      >
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
                      <Button
                        type="primary"
                        block
                        size="large"
                        loading={loading}
                        onClick={() => {
                          saveSale(STATUS_DATA.PAID.id);
                        }}
                      >
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
                      <Button
                        type="primary"
                        block
                        size="large"
                        loading={loading}
                        onClick={() => {
                          saveSale(STATUS_DATA.PAID.id);
                        }}
                      >
                        Cobrar {functions.money(total)}
                      </Button>
                    </>
                  ),
                },
              ]}
            />
          )}

          {isOrder && (
            <>
              <Typography.Paragraph className=" !mb-1 font-medium">Fecha de entrega</Typography.Paragraph>
              <DatePicker
                size="large"
                className="w-full"
                disabledDate={disabledDate}
                format={'D [de] MMMM, YYYY'}
                onChange={(date) => {
                  setOrderDueDate(!!date ? dayjs(date).format('YYYY-MM-DD') : '');
                }}
              />
              <Button
                className="w-full mt-4"
                type="primary"
                size="large"
                loading={loading}
                disabled={!!!orderDueDate}
                onClick={() => {
                  saveSale(STATUS_DATA.ORDER.id);
                }}
              >
                Guardar pedido
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center w-full items-center text-center rounded-lg px-5 pt-6 pb-0 mb-4">
            <div className="flex flex-col items-center mb-4">
              <Avatar
                icon={
                  <CheckCircleOutlined
                    className={`${saleCreated?.status_id === STATUS_DATA.PENDING.id ? 'text-yellow-600' : 'text-green-600'} }`}
                  />
                }
                className={`${saleCreated?.status_id === STATUS_DATA.PENDING.id ? 'bg-yellow-600/10' : 'bg-green-600/10'} } mb-2`}
                shape="circle"
                size={60}
              />
              <Typography.Title level={5} className="!m-0 text-lg font-normal">
                {isOrder
                  ? 'Pedido registrado'
                  : saleCreated?.status_id === STATUS_DATA.PENDING.id
                    ? 'Venta guardada'
                    : '¡Venta completada!'}
              </Typography.Title>
            </div>

            <Typography.Paragraph className="!m-0 text-lg font-normal text-gray-400">Total</Typography.Paragraph>
            <Typography.Title level={2} className="!m-0 !font-extrabold !text-5xl">
              {functions.money(total)}
            </Typography.Title>
            {receivedMoney - total > 0 && (
              <Tag bordered={false} color="blue" className="mt-3 px-3 py-1 text-base w-fit">
                Cambio {functions.money(receivedMoney - total)}
              </Tag>
            )}

            <div className="w-full flex gap-4 mt-10">
              <Button
                className="w-full"
                size="large"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  onSuccess();
                }}
              >
                Cerrar
              </Button>
              <a
                className="w-full"
                href={APP_ROUTES.PRIVATE.SALE_DETAIL.hash`${Number(saleCreated?.sale_id)}`}
                target="_blank"
              >
                <Button
                  className="w-full"
                  size="large"
                  icon={<ExportOutlined />}
                  onClick={() => {
                    onSuccess();
                  }}
                >
                  Ver detalle
                </Button>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(PaymentMethods);

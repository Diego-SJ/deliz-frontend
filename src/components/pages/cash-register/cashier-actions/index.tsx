import { DeleteFilled, PercentageOutlined, SendOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Col, Input, InputNumber, Modal, Radio, Row, Tooltip, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { ActionButton, ContainerItems } from './styles';
import { ModalBody, SalePrices } from '../styles';
import Space from '@/components/atoms/Space';
import { useTheme } from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { DiscountType } from '@/redux/reducers/sales/types';
import { EXTRA_ITEM_BASE } from '@/constants/mocks';
import functions from '@/utils/functions';
import PaymentModal from './payment-modal';
import NumberKeyboard from '@/components/atoms/NumberKeyboard';
import useMediaQuery from '@/hooks/useMediaQueries';

type ModalAction = '' | 'APPLY_SHIPPING' | 'APPLY_DISCOUNT' | 'ADD_NEW_ITEM';

const MODAL_TITLE = {
  '': '',
  APPLY_SHIPPING: 'Aplicar envío',
  APPLY_DISCOUNT: 'Aplicar descuento',
  ADD_NEW_ITEM: 'Agregar extra',
};

const MODAL_ICON = {
  '': '',
  APPLY_SHIPPING: <SendOutlined rev={{}} />,
  APPLY_DISCOUNT: <PercentageOutlined rev={{}} />,
  ADD_NEW_ITEM: <PlusCircleFilled rev={{}} />,
};

type CashierActionsProps = {
  onClose?: () => void;
};

const CashierActions = ({ onClose }: CashierActionsProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [open, setOpen] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  // const [checked, setChecked] = useState(true);
  const [productName, setProductName] = useState('');
  const [modalAction, setModalAction] = useState<ModalAction>('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [currentInput, setCurrentInput] = useState<'quantity' | 'price'>('quantity');
  const [itemExtra, setItemExtra] = useState({ price: 0, quantity: 0 });
  const [total, setTotal] = useState(0);
  const { shipping = 0, discountMoney = 0, discount = 0, mode = null } = cash_register;
  const [modal, contextHolder] = Modal.useModal();
  const [subTotal, setSubTotal] = useState(0);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    let totalItemsInList = 0;
    let items = cash_register?.items?.reduce((total, item) => {
      let productPrice = item.product?.wholesale_price * item?.quantity;
      totalItemsInList += item.quantity;
      return productPrice + total;
    }, 0);
    setTotalItems(totalItemsInList);

    setSubTotal(items || 0);
  }, [cash_register]);

  useEffect(() => {
    setTotal(subTotal + shipping - discountMoney);
  }, [subTotal, shipping, discountMoney]);

  useEffect(() => {
    setShippingPrice(cash_register?.shipping || 0);
    setDiscountAmount(cash_register?.discount || 0);
    setDiscountType(cash_register?.discountType || 'AMOUNT');
  }, [cash_register]);

  const cleanFields = () => {
    setShippingPrice(0);
    setDiscountAmount(0);
    setItemExtra({ price: 0, quantity: 0 });
    setProductName('');
    // setChecked(false);
  };

  const handleOnClose = () => {
    cleanFields();
    setOpen(false);
  };

  const handleOk = async () => {
    if (modalAction === 'APPLY_SHIPPING') {
      dispatch(salesActions.cashRegister.applyShipping(shippingPrice));
    } else if (modalAction === 'APPLY_DISCOUNT') {
      dispatch(salesActions.cashRegister.applyDiscount(discountAmount, discountType));
    } else if (modalAction === 'ADD_NEW_ITEM') {
      dispatch(
        salesActions.cashRegister.add({
          product: {
            ...EXTRA_ITEM_BASE,
            name: productName,
            retail_price: itemExtra.price,
            wholesale_price: itemExtra.price,
          },
          quantity: itemExtra.quantity,
          wholesale_price: true,
        }),
      );
    }
    handleOnClose();
  };

  const openModal = (action: ModalAction) => {
    setModalAction(action);
    setOpen(true);
  };

  const onPaySale = () => {
    if (!!!cash_register?.customer_id) return message.info('Selecciona un cliente para poder finalizar la venta');
    if (!cash_register?.items?.length) return message.info('Agrega items a la lista.');
    setOpenPaymentModal(true);
  };

  const cancelOrder = () => {
    modal.confirm({
      title: 'Cancelar orden',
      content: <Typography.Paragraph>Se perderan los cambios actuales ¿desea continuar?</Typography.Paragraph>,
      okText: 'Aceptar',
      cancelText: 'Cancelar',
      onOk: () => dispatch(salesActions.cashRegister.reset()),
    });
  };

  const onInputsChange = (value: number) => {
    if (currentInput === 'quantity') setItemExtra(prev => ({ ...prev, quantity: value || 0 }));
    else setItemExtra(prev => ({ ...prev, price: value || 0 }));
  };

  const disabledButton = () => {
    if (modalAction === 'APPLY_SHIPPING') return shippingPrice < 0;
    if (modalAction === 'APPLY_DISCOUNT') {
      if (discountType === 'AMOUNT') return discountAmount < 0;
      else if (discountType === 'PERCENTAGE') return discountAmount < 0 || discountAmount > 100;
    }
    return !productName;
  };

  return (
    <div className="cashier-actions md:border-t md:border-dashed md:border-gray-400">
      <ContainerItems>
        <p className="text-base text-gray-500 w-full text-start pt-[10px]">
          Productos <span className="min-w-[100px]">{totalItems || 0}</span>
        </p>
        <SalePrices>
          <p className="text-base text-gray-500 w-full text-end ">
            Subtotal <span className="min-w-[100px] inline-flex justify-end">{functions.money(subTotal)}</span>
          </p>
          <p className="text-base text-gray-500 w-full text-end ">
            Descuento
            <span className="min-w-[100px] inline-flex justify-end">{`-${functions.money(discountMoney)} ${
              discountType === 'PERCENTAGE' ? `(${discount}%)` : ''
            }`}</span>
          </p>
          <p className="text-base text-gray-500 w-full text-end ">
            Envio <span className="min-w-[100px] inline-flex justify-end">{functions.money(shipping)}</span>
          </p>
          <p className="text-lg text-gray-800 w-full text-end font-semibold">
            TOTAL <span className="min-w-[100px] inline-flex justify-end">{functions.money(total)}</span>
          </p>
        </SalePrices>
      </ContainerItems>
      <Row gutter={{ lg: 20, md: 20, sm: 10, xs: 10 }} style={{ marginBottom: 10 }}>
        <Col span={6}>
          <Tooltip title="Aplicar envío">
            <ActionButton onClick={() => openModal('APPLY_SHIPPING')}>
              <Button icon={<SendOutlined rev={{}} />} size="small" type="primary" shape="circle" />
              Envio
            </ActionButton>
          </Tooltip>
        </Col>
        <Col span={6}>
          <Tooltip title="Aplicar descuento">
            <ActionButton onClick={() => openModal('APPLY_DISCOUNT')}>
              <Button icon={<PercentageOutlined rev={{}} />} size="small" type="primary" shape="circle" />
              Descuento
            </ActionButton>
          </Tooltip>
        </Col>
        <Col span={6}>
          <Tooltip title="Cancelar orden">
            <ActionButton onClick={cancelOrder}>
              <Button icon={<DeleteFilled rev={{}} />} size="small" type="primary" shape="circle" />
              Cancelar
            </ActionButton>
          </Tooltip>
        </Col>
        {/* <Col span={6}>
          <Tooltip title="Imprimir ticket">
            <ActionButton>
              <Button icon={<PrinterFilled rev={{}} />} size="small" type="primary" shape="circle" />
            </ActionButton>
          </Tooltip>
        </Col>
        <Col span={6}>
          <Tooltip title="Guardar borrador">
            <ActionButton>
              <Button icon={<SaveFilled rev={{}} />} size="small" type="primary" shape="circle" />
            </ActionButton>
          </Tooltip>
        </Col> */}
        <Col span={6}>
          <Tooltip title="Agregar extra">
            <ActionButton onClick={() => openModal('ADD_NEW_ITEM')}>
              <Button icon={<PlusCircleFilled rev={{}} />} size="small" type="primary" shape="circle" />
              Extra
            </ActionButton>
          </Tooltip>
        </Col>
      </Row>
      <div className="flex gap-4">
        {isTablet && (
          <Button type="default" block size="large" onClick={onClose}>
            Cerrar
          </Button>
        )}
        <Button type="primary" block size="large" onClick={onPaySale}>
          {mode === 'order' ? 'REGISTRAR PEDIDO' : 'PAGAR'}
        </Button>
      </div>
      {contextHolder}

      <Modal
        open={open}
        onOk={handleOk}
        width={370}
        onCancel={handleOnClose}
        footer={[
          <Row key="actions" gutter={10}>
            <Col span={12}>
              <Button key="back" size="large" block onClick={handleOnClose}>
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button block type="primary" onClick={handleOk} size="large" disabled={disabledButton()}>
                Guardar
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <ModalBody>
          <Avatar icon={MODAL_ICON[modalAction]} size={60} style={{ background: theme.colors.primary }} />
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            {MODAL_TITLE[modalAction]}
          </Typography.Title>
          <Space height="10px" />
          {modalAction === 'APPLY_DISCOUNT' && (
            <>
              <Radio.Group
                style={{ width: '100%' }}
                size="large"
                value={discountType}
                onChange={e => setDiscountType(e.target.value)}
              >
                <Radio.Button value="AMOUNT" style={{ width: '50%', textAlign: 'center' }}>
                  Cantidad $
                </Radio.Button>
                <Radio.Button value="PERCENTAGE" style={{ width: '50%', textAlign: 'center' }}>
                  Porcentaje %
                </Radio.Button>
              </Radio.Group>
              <Space height="10px" />
              <InputNumber
                min={0}
                max={discountType === 'PERCENTAGE' ? 100 : undefined}
                placeholder="0"
                size="large"
                readOnly={isTablet}
                type="number"
                inputMode="decimal"
                style={{ width: '100%', textAlign: 'center' }}
                value={discountAmount}
                onFocus={target => {
                  target.currentTarget?.select();
                }}
                onChange={value => setDiscountAmount(value || 0)}
                onPressEnter={handleOk}
              />
              {isTablet && <NumberKeyboard value={discountAmount} withDot onChange={setDiscountAmount} />}
            </>
          )}
          {modalAction === 'APPLY_SHIPPING' && (
            <>
              <InputNumber
                min={0}
                placeholder="0.0"
                size="large"
                type="number"
                inputMode="decimal"
                style={{ width: '100%', textAlign: 'center' }}
                value={shippingPrice}
                readOnly={isTablet}
                onFocus={target => {
                  target.currentTarget?.select();
                }}
                onPressEnter={handleOk}
                onChange={value => setShippingPrice(value || 0)}
              />
              {isTablet && <NumberKeyboard value={shippingPrice} withDot onChange={setShippingPrice} />}
            </>
          )}

          {modalAction === 'ADD_NEW_ITEM' && (
            <>
              {/* <Radio.Group style={{ width: '100%' }} size="large" value={checked} onChange={e => setChecked(e.target.value)}>
                <Radio.Button value={false} style={{ width: '50%', textAlign: 'center' }}>
                  Menudeo
                </Radio.Button>
                <Radio.Button value={true} style={{ width: '50%', textAlign: 'center' }}>
                  Mayoreo
                </Radio.Button>
              </Radio.Group> */}
              <Space height="10px" />
              <Typography.Title level={5} style={{ width: '100%' }}>
                Nombre del artíulo
              </Typography.Title>
              <Input
                placeholder="Nombre del artículo"
                size="large"
                value={productName}
                onChange={({ target }) => setProductName(target.value)}
              />
              <Space height="10px" />
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <Typography.Title level={5} style={{ width: '100%' }}>
                    Cantidad
                  </Typography.Title>
                  <InputNumber
                    min={0}
                    placeholder="0"
                    size="large"
                    type="number"
                    className={currentInput === 'quantity' ? 'ant-input-number-focused' : ''}
                    style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
                    value={itemExtra.quantity}
                    onFocus={target => {
                      setCurrentInput('quantity');
                      target.currentTarget.select();
                    }}
                    readOnly={isTablet}
                    onChange={value => onInputsChange(value || 0)}
                  />
                </Col>
                <Col span={12}>
                  <Typography.Title level={5} style={{ width: '100%' }}>
                    Precio
                  </Typography.Title>
                  <InputNumber
                    min={0}
                    placeholder="0.0"
                    size="large"
                    className={currentInput === 'price' ? 'ant-input-number-focused' : ''}
                    style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
                    onFocus={target => {
                      setCurrentInput('price');
                      target.currentTarget?.select();
                    }}
                    value={itemExtra.price}
                    readOnly={isTablet}
                    onChange={value => onInputsChange(value || 0)}
                  />
                </Col>
              </Row>
              {isTablet && (
                <NumberKeyboard
                  withDot={currentInput === 'price'}
                  value={currentInput === 'quantity' ? itemExtra.quantity : itemExtra.price}
                  onChange={value => onInputsChange(value)}
                />
              )}
            </>
          )}
        </ModalBody>
      </Modal>
      <PaymentModal total={total} open={openPaymentModal} onClose={() => setOpenPaymentModal(false)} />
    </div>
  );
};

export default CashierActions;

import {
  TruckOutlined,
  ClearOutlined,
  TagsOutlined,
  SignatureOutlined,
  DollarCircleOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Input, InputNumber, Modal, Row, Segmented, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ContainerItems } from './styles';
import { ModalBody } from '../styles';
import Space from '@/components/atoms/Space';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { DiscountType } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import PaymentModal from './payment-modal';
import SubtotalBox from './subtotal-box';
import { ModuleAccess } from '@/routes/module-access';

type ModalAction = '' | 'APPLY_SHIPPING' | 'APPLY_DISCOUNT' | 'ADD_NEW_ITEM';

const MODAL_TITLE = {
  '': '',
  APPLY_SHIPPING: 'Agregar envío',
  APPLY_DISCOUNT: 'Aplicar descuento',
  ADD_NEW_ITEM: 'Entrada manual',
};

const MODAL_ICON = {
  '': '',
  APPLY_SHIPPING: <TruckOutlined className="text-slate-600" />,
  APPLY_DISCOUNT: <TagsOutlined className="text-slate-600" />,
  ADD_NEW_ITEM: <SignatureOutlined className="text-slate-600" />,
};

type CashierActionsProps = {
  onClose?: () => void;
};

const CashierActions = ({}: CashierActionsProps) => {
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [open, setOpen] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [productName, setProductName] = useState('');
  const [modalAction, setModalAction] = useState<ModalAction>('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [currentInput, setCurrentInput] = useState<'quantity' | 'price'>('quantity');
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const [itemExtra, setItemExtra] = useState({ price: 0, quantity: 0 });
  const [total, setTotal] = useState(0);
  const { shipping = 0, discountMoney = 0, discount = 0, mode = null } = cash_register;
  const [modal, contextHolder] = Modal.useModal();
  const [subTotal, setSubTotal] = useState(0);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const discountInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let totalItemsInList = 0;
    let items = cash_register?.items?.reduce((total, item) => {
      let productPrice = item.price * item?.quantity;
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
    if (open) {
      setShippingPrice(cash_register?.shipping || 0);
      setDiscountAmount(cash_register?.discount || 0);
      setDiscountType(cash_register?.discountType || 'AMOUNT');
    }
  }, [cash_register, open]);

  const cleanFields = () => {
    setShippingPrice(0);
    setDiscountAmount(0);
    setItemExtra({ price: 0, quantity: 0 });
    setProductName('');
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
          product: { name: productName, raw_price: itemExtra.price },
          price: itemExtra.price,
          quantity: itemExtra.quantity,
          price_type: 'PERSONALIZED',
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
    if (!cash_register?.items?.length) return message.info('Agrega items a la lista.');
    setOpenPaymentModal(true);
  };

  const cancelOrder = () => {
    modal.confirm({
      title: 'Cancelar orden',
      content: <Typography.Paragraph>Se perderan los cambios actuales ¿desea continuar?</Typography.Paragraph>,
      okText: 'Aceptar',
      maskClosable: true,
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
    return !productName || !itemExtra.price || !itemExtra.quantity;
  };

  return (
    <>
      <div className="flex flex-col bg-white justify-between cashier-actions md:border-t md:border-dashed md:border-gray-300 p-3 h-[230px]">
        <ContainerItems>
          <p className="text-sm w-full text-start font-light">
            Productos <span className="min-w-[100px] font-medium">{totalItems || 0}</span>
          </p>
          <div className="flex flex-col">
            <p className="text-sm w-full text-end font-light">
              Subtotal <span className="min-w-[100px] font-medium inline-flex justify-end">{functions.money(subTotal)}</span>
            </p>
            <p className="text-sm w-full text-end font-light">
              Descuento
              <span className="min-w-[100px] inline-flex justify-end font-medium">{`-${functions.money(discountMoney)} ${
                discountType === 'PERCENTAGE' ? `(${discount}%)` : ''
              }`}</span>
            </p>
            <p className="text-sm w-full text-end font-light">
              Envio <span className="min-w-[100px] inline-flex justify-end font-medium">{functions.money(shipping)}</span>
            </p>
          </div>
        </ContainerItems>
        <Row gutter={{ lg: 20, md: 20, sm: 10, xs: 10 }}>
          <ModuleAccess moduleName="apply_shipping">
            {permissions?.pos?.apply_shipping?.value && (
              <Col span={6}>
                <div
                  className="py-2 flex flex-col items-center border border-gray-300 hover:border-gray-400 h-full rounded-lg justify-center cursor-pointer"
                  onClick={() => openModal('APPLY_SHIPPING')}
                >
                  <Avatar
                    icon={<TruckOutlined className="text-gray-400 !text-lg" />}
                    shape="square"
                    className="mb-1 bg-gray-300/10"
                  />
                  <span className="text-xs lowercase select-none text-center leading-3 !font-light">envío</span>
                </div>
              </Col>
            )}
          </ModuleAccess>
          {permissions?.pos?.apply_discount?.value && (
            <Col span={6}>
              <div
                className="py-2 flex flex-col items-center border border-gray-300 hover:border-gray-400 h-full rounded-lg justify-center cursor-pointer"
                onClick={() => openModal('APPLY_DISCOUNT')}
              >
                <Avatar
                  icon={<TagsOutlined className="text-gray-400 !text-lg" />}
                  shape="square"
                  className="mb-1 bg-gray-300/10"
                />
                <span className="text-xs lowercase select-none text-center leading-3 !font-light">descuento</span>
              </div>
            </Col>
          )}

          <Col span={6}>
            <div
              className="py-2 flex flex-col items-center border border-gray-300 hover:border-gray-400 h-full rounded-lg justify-center cursor-pointer"
              onClick={cancelOrder}
            >
              <Avatar
                icon={<ClearOutlined className="text-gray-400 !text-lg" />}
                shape="square"
                className="mb-1 bg-gray-300/10"
              />
              <span className="text-xs lowercase select-none text-center leading-3 !font-light">borrar</span>
            </div>
          </Col>

          {permissions?.pos?.add_manual_item?.value && (
            <Col span={6}>
              <div
                className="py-2 flex flex-col items-center border border-gray-300 hover:border-gray-400 h-full rounded-lg justify-center cursor-pointer"
                onClick={() => openModal('ADD_NEW_ITEM')}
              >
                <Avatar
                  icon={<SignatureOutlined className="text-gray-400 !text-lg" />}
                  shape="square"
                  className="mb-1 bg-gray-300/10"
                />
                <span className="text-xs lowercase select-none text-center leading-3 !font-light">manual</span>
              </div>
            </Col>
          )}
        </Row>
        <div className="flex">
          <Button type="primary" block size="large" className="font-bold " onClick={onPaySale}>
            {mode === 'order' ? 'Registrar Pedido de' : 'Cobrar'} {functions.money(total)}
          </Button>
        </div>
      </div>

      {contextHolder}

      <Modal
        open={open}
        onOk={handleOk}
        width={400}
        onCancel={handleOnClose}
        destroyOnClose
        forceRender
        footer={[
          <Row key="actions" gutter={20} className="!mt-7">
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
          <div className="flex gap-3 w-full justify-start items-center my-3">
            <Avatar shape="square" className="bg-slate-600/10" icon={MODAL_ICON[modalAction]} />
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              {MODAL_TITLE[modalAction]}
            </Typography.Title>
          </div>
          <Space height="10px" />
          {modalAction === 'APPLY_DISCOUNT' && (
            <>
              <Segmented
                className="w-full"
                size="large"
                value={discountType}
                options={[
                  { label: 'Cantidad', value: 'AMOUNT', icon: <DollarCircleOutlined /> },
                  { label: 'Porcentaje', value: 'PERCENTAGE', icon: <PercentageOutlined /> },
                ]}
                block
                onChange={value => {
                  setDiscountType(value as DiscountType);
                  discountInputRef.current?.focus();
                }}
              />
              <Space height="10px" />
              <InputNumber
                ref={discountInputRef}
                min={0}
                max={discountType === 'PERCENTAGE' ? 100 : undefined}
                addonBefore={discountType === 'PERCENTAGE' ? <PercentageOutlined /> : <DollarCircleOutlined />}
                placeholder="0"
                size="large"
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
            </>
          )}
          {modalAction === 'APPLY_SHIPPING' && (
            <div className="flex flex-col w-full">
              <SubtotalBox
                prevAmount={total - (cash_register?.shipping || 0)}
                amount={total + shippingPrice - (cash_register?.shipping || 0)}
                hasChanged={shippingPrice > 0 && !!cash_register?.shipping}
              />

              <InputNumber
                min={0}
                placeholder="0.0"
                size="large"
                type="number"
                inputMode="decimal"
                addonBefore={<DollarCircleOutlined />}
                style={{ width: '100%', textAlign: 'center' }}
                value={shippingPrice}
                onFocus={target => {
                  target.currentTarget?.select();
                }}
                onPressEnter={handleOk}
                onChange={value => setShippingPrice(value || 0)}
              />
            </div>
          )}

          {modalAction === 'ADD_NEW_ITEM' && (
            <>
              <Typography.Paragraph className="w-full !m-0 !mb-1">Nombre del artíulo</Typography.Paragraph>
              <Input
                placeholder="Nombre del artículo"
                size="large"
                value={productName}
                onChange={({ target }) => setProductName(target.value)}
              />
              <Space height="10px" />
              <Row gutter={20}>
                <Col span={12}>
                  <Typography.Paragraph className="w-full !m-0 !mb-1">Cantidad</Typography.Paragraph>
                  <InputNumber
                    min={0}
                    placeholder="0"
                    size="large"
                    type="number"
                    inputMode="numeric"
                    className={currentInput === 'quantity' ? 'ant-input-number-focused' : ''}
                    style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
                    value={itemExtra.quantity}
                    onFocus={target => {
                      setCurrentInput('quantity');
                      target.currentTarget.select();
                    }}
                    onPressEnter={() => {
                      if (itemExtra.quantity > 0 && itemExtra.price > 0) handleOk();
                    }}
                    onChange={value => onInputsChange(value || 0)}
                  />
                </Col>
                <Col span={12}>
                  <Typography.Paragraph className="w-full !m-0 !mb-1">Precio</Typography.Paragraph>
                  <InputNumber
                    min={0}
                    placeholder="0.0"
                    size="large"
                    type="number"
                    inputMode="decimal"
                    className={currentInput === 'price' ? 'ant-input-number-focused' : ''}
                    style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
                    onFocus={target => {
                      setCurrentInput('price');
                      target.currentTarget?.select();
                    }}
                    onPressEnter={() => {
                      if (itemExtra.quantity > 0 && itemExtra.price > 0) handleOk();
                    }}
                    value={itemExtra.price}
                    onChange={value => onInputsChange(value || 0)}
                  />
                </Col>
              </Row>
            </>
          )}
        </ModalBody>
      </Modal>
      <PaymentModal total={total} open={openPaymentModal} onClose={() => setOpenPaymentModal(false)} />
    </>
  );
};

export default CashierActions;

import { DeleteFilled, PercentageOutlined, PrinterFilled, SaveFilled, SendOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Col, Input, InputNumber, Modal, Radio, Row, Tooltip, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { ActionButton } from './styles';
import { ModalBody, SalePrices } from '../styles';
import Space from '@/components/atoms/Space';
import { useTheme } from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { DiscountType } from '@/redux/reducers/sales/types';
import { EXTRA_ITEM_BASE } from '@/constants/mocks';
import functions from '@/utils/functions';
import PaymentModal from './payment-modal';

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

const CashierActions = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [open, setOpen] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [checked, setChecked] = useState(true);
  const [productName, setProductName] = useState('');
  const [modalAction, setModalAction] = useState<ModalAction>('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [itemExtra, setItemExtra] = useState({ price: 0, quantity: 0 });
  const [total, setTotal] = useState(0);
  const { shipping = 0, discountMoney = 0, discount = 0 } = cash_register;
  const [modal, contextHolder] = Modal.useModal();
  const [subTotal, setSubTotal] = useState(0);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  useEffect(() => {
    let items = cash_register?.items?.reduce((total, item) => {
      let productPrice = item.wholesale_price ? item.product.wholesale_price : item.product.retail_price;
      productPrice = productPrice * item.quantity;
      return productPrice + total;
    }, 0);

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
    setChecked(false);
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
          wholesale_price: checked,
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

  return (
    <div className="cashier-actions">
      <SalePrices>
        <Typography.Text type="secondary">
          Subtotal: <span>{functions.money(subTotal)}</span>
        </Typography.Text>
        <Typography.Text type="secondary">
          Descuento: <span>{`-${functions.money(discountMoney)} ${discountType === 'PERCENTAGE' ? `(${discount}%)` : ''}`}</span>
        </Typography.Text>
        <Typography.Text type="secondary">
          Envio: <span>{functions.money(shipping)}</span>
        </Typography.Text>
        <Typography.Title level={3} type="success">
          TOTAL: <span>{functions.money(total)}</span>
        </Typography.Title>
      </SalePrices>
      <Row gutter={{ lg: 20, md: 20, sm: 10, xs: 5 }} style={{ marginBottom: 20 }}>
        <Col span={4}>
          <Tooltip title="Aplicar envío">
            <ActionButton onClick={() => openModal('APPLY_SHIPPING')}>
              <Button icon={<SendOutlined rev={{}} />} size="large" type="primary" shape="circle" />
            </ActionButton>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip title="Aplicar descuento">
            <ActionButton onClick={() => openModal('APPLY_DISCOUNT')}>
              <Button icon={<PercentageOutlined rev={{}} />} size="large" type="primary" shape="circle" />
            </ActionButton>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip title="Cancelar orden">
            <ActionButton onClick={cancelOrder}>
              <Button icon={<DeleteFilled rev={{}} />} size="large" type="primary" shape="circle" />
            </ActionButton>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip title="Imprimir ticket">
            <ActionButton>
              <Button icon={<PrinterFilled rev={{}} />} size="large" type="primary" shape="circle" />
            </ActionButton>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip title="Guardar borrador">
            <ActionButton>
              <Button icon={<SaveFilled rev={{}} />} size="large" type="primary" shape="circle" />
            </ActionButton>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip title="Agregar extra">
            <ActionButton onClick={() => openModal('ADD_NEW_ITEM')}>
              <Button icon={<PlusCircleFilled rev={{}} />} size="large" type="primary" shape="circle" />
            </ActionButton>
          </Tooltip>
        </Col>
      </Row>
      <Button type="primary" block size="large" onClick={onPaySale}>
        PAGAR
      </Button>
      {contextHolder}

      <Modal
        open={open}
        onOk={handleOk}
        maskClosable={false}
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
              <Button
                block
                type="primary"
                onClick={handleOk}
                size="large"
                disabled={
                  (modalAction === 'APPLY_SHIPPING' && shippingPrice < 0) ||
                  (modalAction === 'APPLY_DISCOUNT' && (discountAmount < 0 || discountAmount > 100))
                }
              >
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
                max={discountType === 'PERCENTAGE' ? 100 : 10000000000}
                placeholder="0"
                size="large"
                style={{ width: '100%', textAlign: 'center' }}
                value={discountAmount}
                onChange={value => setDiscountAmount(value || 0)}
              />
            </>
          )}
          {modalAction === 'APPLY_SHIPPING' && (
            <InputNumber
              min={0}
              placeholder="0.0"
              size="large"
              style={{ width: '100%', textAlign: 'center' }}
              value={shippingPrice}
              onChange={value => setShippingPrice(value || 0)}
            />
          )}
          {modalAction === 'ADD_NEW_ITEM' && (
            <>
              <Radio.Group style={{ width: '100%' }} size="large" value={checked} onChange={e => setChecked(e.target.value)}>
                <Radio.Button value={true} style={{ width: '50%', textAlign: 'center' }}>
                  Mayoreo
                </Radio.Button>
                <Radio.Button value={false} style={{ width: '50%', textAlign: 'center' }}>
                  Menudeo
                </Radio.Button>
              </Radio.Group>
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
              <Typography.Title level={5} style={{ width: '100%' }}>
                Cantidad
              </Typography.Title>
              <InputNumber
                min={0}
                placeholder="0"
                size="large"
                style={{ width: '100%', textAlign: 'center' }}
                value={itemExtra.quantity}
                onChange={value => setItemExtra(prev => ({ ...prev, quantity: value || 0 }))}
              />
              <Space height="10px" />
              <Typography.Title level={5} style={{ width: '100%' }}>
                Precio
              </Typography.Title>
              <InputNumber
                min={0}
                placeholder="0.0"
                size="large"
                style={{ width: '100%', textAlign: 'center' }}
                value={itemExtra.price}
                onChange={value => setItemExtra(prev => ({ ...prev, price: value || 0 }))}
              />
            </>
          )}
        </ModalBody>
      </Modal>
      <PaymentModal total={total} open={openPaymentModal} onClose={() => setOpenPaymentModal(false)} />
    </div>
  );
};

export default CashierActions;

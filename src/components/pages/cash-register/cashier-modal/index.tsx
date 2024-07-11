import { Avatar, Button, Col, InputNumber, Modal, Radio, Row, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ModalBody } from '../styles';
import Space from '@/components/atoms/Space';
import FallbackImage from '@/assets/img/webp/ice-cream.webp';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Product } from '@/redux/reducers/products/types';

import { CashRegisterItem } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import NumberKeyboard from '@/components/atoms/NumberKeyboard';
import useMediaQuery from '@/hooks/useMediaQueries';
import { DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import { cashierHelpers } from '@/utils/cashiers';

type CashierModalProps = {
  open?: boolean;
  currentProduct?: Product;
  casherItem?: CashRegisterItem;
  action?: 'ADD' | 'EDIT' | 'ADD_UNKOWN';
  onCancel?: () => void;
};

const { Title, Paragraph, Text } = Typography;

const CashierModal = ({ open, currentProduct, action = 'ADD', onCancel, casherItem }: CashierModalProps) => {
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [quantity, setQuantity] = useState<number | string>(casherItem?.quantity || '0');
  const [wholesaleActive, setWholesaleActive] = useState<boolean | 1>(true);
  const [subtotal, setSubtotal] = useState(0);
  const [quantityUsed, setQuantityUsed] = useState<number>(0);
  const [specialPrice, setSpecialPrice] = useState(0);
  const [currentInput, setCurrentInput] = useState<'quantity' | 'price'>('quantity');
  const quantityInput = useRef<HTMLInputElement>(null);
  const { isTablet } = useMediaQuery();
  const { items = [], zone = 1 } = cash_register;
  const stock = currentProduct?.stock || 0;
  const isExtra = casherItem?.product?.product_id === 0;

  useEffect(() => {
    if (open) {
      if (action === 'EDIT' && casherItem) {
        setQuantity(casherItem.quantity);
        setWholesaleActive(casherItem.wholesale_price);

        let price = casherItem.wholesale_price ? casherItem.product.wholesale_price : casherItem.product.retail_price;
        setSpecialPrice(price);
      } else {
        setWholesaleActive(true);
        let wholesalePrice = cashierHelpers.getWhosalePrice(currentProduct, zone);
        setSpecialPrice(wholesalePrice);
      }
      setTimeout(() => {
        quantityInput.current?.focus();
        quantityInput.current?.select();
      }, 100);
    }
  }, [open, action, casherItem]);

  useEffect(() => {
    if (!!currentProduct?.created_at) {
      let wholesalePrice = cashierHelpers.getWhosalePrice(currentProduct, zone);
      let currentPrice = !!wholesaleActive ? wholesalePrice : currentProduct?.retail_price || 0;
      let _subtotal = specialPrice === currentPrice ? currentPrice : specialPrice;

      setSubtotal(_subtotal);
    }
  }, [wholesaleActive, currentProduct, specialPrice, zone]);

  useEffect(() => {
    let productIsAlreadyInList = items?.filter(p => p?.product?.product_id === currentProduct?.product_id);
    let totalQuantity = productIsAlreadyInList?.reduce((total, i) => total + i?.quantity, 0);
    if (action === 'EDIT') {
      totalQuantity = totalQuantity - (Number(casherItem?.quantity) - Number(quantity));
    }

    setQuantityUsed(totalQuantity);
  }, [currentProduct, items, quantity]);

  useEffect(() => {
    if (stock - quantityUsed < 0 && !isExtra) {
      message.error('No hay stock suficiente');
    }
  }, [stock, quantityUsed, isExtra]);

  const disableSaveBtn = () => {
    const overStock = action === 'EDIT' ? stock - quantityUsed < 0 : stock - quantityUsed < Number(quantity);
    const emptyValue = Number(quantity) <= 0;
    const disable = (overStock || emptyValue) && casherItem?.product?.product_id !== 0;
    return disable;
  };

  const cleanFields = () => {
    setQuantity(0);
    setSpecialPrice(0);
    setSubtotal(0);
    setWholesaleActive(true);
  };

  const handleOnClose = () => {
    cleanFields();
    if (onCancel) onCancel();
  };

  const getProductWithSpecialPrice = (product: Product): Product => {
    let _product = { ...product };
    if (specialPrice > 0) {
      _product = {
        ..._product,
        wholesale_price: specialPrice,
        retail_price: specialPrice,
      };
    } else {
      _product = {
        ..._product,
        wholesale_price: subtotal,
      };
    }

    return _product;
  };

  const handleOk = async () => {
    if (action === 'ADD') {
      dispatch(
        salesActions.cashRegister.add({
          customer_id: 1,
          product: getProductWithSpecialPrice(currentProduct as Product),
          quantity: quantity as number,
          wholesale_price: !!wholesaleActive,
        }),
      );
    } else {
      dispatch(
        salesActions.cashRegister.update({
          ...(casherItem as CashRegisterItem),
          product: getProductWithSpecialPrice(casherItem?.product as Product),
          quantity: quantity as number,
          wholesale_price: !!wholesaleActive,
        }),
      );
    }
    cleanFields();
    if (onCancel) onCancel();
  };

  const onCheckChange = (isWholeSale: boolean) => {
    console.log({ currentProduct });
    setWholesaleActive(isWholeSale);
    if (!isWholeSale) {
      setSpecialPrice(currentProduct?.retail_price || 0);
    } else {
      let wholesalePrice = cashierHelpers.getWhosalePrice(currentProduct, zone);
      setSpecialPrice(wholesalePrice);
    }
    quantityInput.current?.focus();
  };

  const onQuantityChange = (value: number) => {
    setQuantity(value);
  };

  const onInputsChange = (value: number) => {
    if (currentInput === 'quantity') onQuantityChange(value);
    else setSpecialPrice(value);
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      width={350}
      destroyOnClose
      onCancel={handleOnClose}
      footer={[
        <Row key="actions" gutter={10}>
          <Col span={12}>
            <Button size="large" key="back" block onClick={handleOnClose}>
              Cancelar
            </Button>
          </Col>
          <Col span={12}>
            <Button size="large" block type="primary" onClick={handleOk} disabled={disableSaveBtn()}>
              Guardar
            </Button>
          </Col>
        </Row>,
      ]}
    >
      <ModalBody>
        <div className="w-full flex gap-4 items-center">
          <Avatar
            src={currentProduct?.image_url || FallbackImage}
            size={60}
            style={{ background: '#faefff', padding: 5 }}
            shape="circle"
          />
          <div className="">
            <Title level={5} style={{ marginBottom: 0 }}>
              {currentProduct?.name}
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              {currentProduct?.categories?.name || 'Item extra'} -{' '}
              {isExtra ? '∞ stock' : <>({stock - quantityUsed < 0 ? 0 : stock - quantityUsed}) stock</>}
            </Paragraph>
            <Title level={4} style={{ margin: 0 }}>
              {quantity} x {functions.moneySimple(subtotal)} ={' '}
              <Text type="success" style={{ fontSize: 'inherit' }}>
                {functions.moneySimple(subtotal * Number(quantity))}
              </Text>
            </Title>
          </div>
        </div>
        {action === 'ADD' && (
          <>
            <Space height="10px" />
            <Radio.Group
              style={{ width: '100%' }}
              size="large"
              value={wholesaleActive}
              onChange={e => onCheckChange(e.target.value)}
            >
              <Radio.Button value={false} style={{ width: '50%', textAlign: 'center', fontSize: '1rem' }}>
                Menudeo
              </Radio.Button>
              <Radio.Button value={true} style={{ width: '50%', textAlign: 'center', fontSize: '1rem' }}>
                Mayoreo
              </Radio.Button>
            </Radio.Group>
          </>
        )}
        <Space height="10px" />
        <div className="flex gap-4">
          <div className="">
            <Paragraph style={{ margin: '0 0 5px', fontWeight: 600, width: '100%' }}>Cantidad</Paragraph>
            <InputNumber
              ref={quantityInput}
              min={0}
              placeholder="Cantidad"
              size="large"
              inputMode="decimal"
              type="number"
              className={currentInput === 'quantity' ? 'ant-input-number-focused' : ''}
              style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
              value={quantity}
              onPressEnter={handleOk}
              readOnly={isTablet}
              autoFocus
              addonBefore={<ShoppingCartOutlined />}
              onFocus={({ target }) => {
                target.select();
                setCurrentInput('quantity');
              }}
              onChange={value => onQuantityChange(value as number)}
            />
          </div>
          <div>
            <Paragraph style={{ margin: '0 0 5px', fontWeight: 600, width: '100%' }}>Precio</Paragraph>
            <InputNumber
              min={0}
              placeholder="Precio"
              size="large"
              className={currentInput === 'price' ? 'ant-input-number-focused' : ''}
              style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
              value={subtotal}
              onPressEnter={handleOk}
              readOnly={isTablet}
              inputMode="decimal"
              type="number"
              onFocus={({ target }) => {
                target.select();
                setCurrentInput('price');
                setSpecialPrice(subtotal);
              }}
              addonBefore={<DollarOutlined />}
              onChange={value => setSpecialPrice(value as number)}
            />
          </div>
        </div>

        <Space height="10px" />
        {isTablet && (
          <NumberKeyboard
            withDot={currentInput === 'price'}
            value={currentInput === 'quantity' ? Number(quantity) : subtotal}
            onChange={value => onInputsChange(value)}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export default CashierModal;

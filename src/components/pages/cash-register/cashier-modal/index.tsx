import { Avatar, Button, Col, InputNumber, Modal, Radio, Row, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ModalBody } from '../styles';
import Space from '@/components/atoms/Space';
import FallbackImage from '@/assets/img/png/logo_deliz.webp';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Product } from '@/redux/reducers/products/types';
import { CATEGORIES } from '@/constants/mocks';
import { CashRegisterItem } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import NumberKeyboard from '@/components/atoms/NumberKeyboard';
import useMediaQuery from '@/hooks/useMediaQueries';
import { DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';

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
  const [quantity, setQuantity] = useState<number | string>(casherItem?.quantity || '');
  const [checked, setChecked] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [quantityUsed, setQuantityUsed] = useState<number>(0);
  const [specialPrice, setSpecialPrice] = useState(0);
  const [currentInput, setCurrentInput] = useState<'quantity' | 'price'>('quantity');
  const quantityInput = useRef<HTMLInputElement>(null);
  const { isTablet } = useMediaQuery();
  const { items = [] } = cash_register;
  const stock = currentProduct?.stock || 0;
  const isExtra = casherItem?.product?.product_id === 0;

  useEffect(() => {
    if (open) {
      if (action === 'EDIT' && casherItem) {
        setQuantity(casherItem.quantity);
        setChecked(casherItem.wholesale_price);
      } else {
        setChecked(true);
      }
      setTimeout(() => {
        quantityInput.current?.focus();
        quantityInput.current?.select();
      }, 100);
    }
  }, [open, action, casherItem]);

  useEffect(() => {
    if (!!currentProduct) {
      let currentPrice = checked ? currentProduct?.wholesale_price || 0 : currentProduct?.retail_price || 0;
      let _subtotal = specialPrice > 0 ? specialPrice : currentPrice;
      setSubtotal(_subtotal);
    }
  }, [checked, currentProduct, specialPrice]);

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
    setChecked(true);
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
          wholesale_price: checked,
        }),
      );
    } else {
      dispatch(
        salesActions.cashRegister.update({
          ...(casherItem as CashRegisterItem),
          product: getProductWithSpecialPrice(casherItem?.product as Product),
          quantity: quantity as number,
          wholesale_price: checked,
        }),
      );
    }
    cleanFields();
    if (onCancel) onCancel();
  };

  const onCheckChange = (value: boolean) => {
    setChecked(value);
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
        <Row style={{ width: '100%' }}>
          <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={currentProduct?.image_url || FallbackImage}
              size={80}
              style={{ background: '#faefff', padding: 5 }}
              shape="circle"
            />
          </Col>
          <Col span={16}>
            <Title level={4} style={{ marginBottom: 0 }}>
              {currentProduct?.name}
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              {CATEGORIES.find(item => item.id === currentProduct?.category_id)?.name}
              {!isExtra && (
                <>
                  <br />
                  <b>({stock - quantityUsed < 0 ? 0 : stock - quantityUsed})</b> disponibles
                </>
              )}
            </Paragraph>
            <Title level={5} style={{ margin: 0 }}>
              {functions.money(subtotal)} * {quantity} ={' '}
              <Text type="success" style={{ fontSize: 'inherit' }}>
                {functions.money(subtotal * Number(quantity))}
              </Text>
            </Title>
          </Col>
        </Row>
        <Space height="10px" />

        <Radio.Group style={{ width: '100%' }} size="large" value={checked} onChange={e => onCheckChange(e.target.value)}>
          <Radio.Button value={false} style={{ width: '50%', textAlign: 'center' }}>
            Menudeo
          </Radio.Button>
          <Radio.Button value={true} style={{ width: '50%', textAlign: 'center' }}>
            Mayoreo
          </Radio.Button>
        </Radio.Group>
        <Space height="10px" />
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
          addonAfter={specialPrice > 0 ? 'especial' : ''}
          onFocus={({ target }) => {
            target.select();
            setCurrentInput('price');
          }}
          addonBefore={<DollarOutlined rev={{}} />}
          onChange={value => setSpecialPrice(value as number)}
        />
        <Space height="10px" />
        <Paragraph style={{ margin: '0 0 5px', fontWeight: 600, width: '100%' }}>Cantidad</Paragraph>
        <InputNumber
          ref={quantityInput}
          min={0}
          placeholder="Cantidad"
          size="large"
          className={currentInput === 'quantity' ? 'ant-input-number-focused' : ''}
          style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
          value={quantity}
          onPressEnter={handleOk}
          readOnly={isTablet}
          addonBefore={<ShoppingCartOutlined rev={{}} />}
          onFocus={({ target }) => {
            target.select();
            setCurrentInput('quantity');
          }}
          onChange={value => onQuantityChange(value as number)}
        />
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

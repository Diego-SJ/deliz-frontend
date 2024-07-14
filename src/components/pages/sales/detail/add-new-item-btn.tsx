import { Avatar, Button, Col, Input, InputNumber, Modal, Radio, Row, Select, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Space from '@/components/atoms/Space';
import FallbackImage from '@/assets/img/webp/ice-cream.webp';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Product } from '@/redux/reducers/products/types';
import { CATEGORIES } from '@/constants/mocks';
import { CashRegisterItem, SaleItem } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import NumberKeyboard from '@/components/atoms/NumberKeyboard';
import useMediaQuery from '@/hooks/useMediaQueries';
import { DollarOutlined, PlusCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ModalBody } from '../../cash-register/styles';
import { ProductInfo } from './styles';

type CashierModalProps = {
  currentProduct?: Product;
  casherItem?: CashRegisterItem;
  action?: 'ADD' | 'EDIT' | 'ADD_UNKOWN';
  onCancel?: () => void;
};

const { Title, Paragraph, Text } = Typography;

const filterOption = (input: string, option?: { label: string; value: string }) =>
  functions.includes(option?.label, input?.toLowerCase());

const CashierModal = ({ action = 'ADD', casherItem }: CashierModalProps) => {
  const dispatch = useAppDispatch();
  const { cash_register, current_sale } = useAppSelector(({ sales }) => sales);
  const { products } = useAppSelector(({ products }) => products);
  const [quantity, setQuantity] = useState<number | string>(casherItem?.quantity || '');
  const [checked, setChecked] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [quantityUsed, setQuantityUsed] = useState<number>(0);
  const [specialPrice, setSpecialPrice] = useState(0);
  const [currentProduct, setCurrentProduct] = useState<Product>({} as Product);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
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
    setProductName('');
    setCurrentProduct({} as Product);
  };

  const handleOnClose = () => {
    cleanFields();
    setOpen(false);
  };

  const handleOk = async () => {
    if (stock - quantityUsed < 0 && !isExtra) {
      message.error('No hay stock suficiente');
      return;
    }
    setLoading(true);
    let newProduct: SaleItem = {
      sale_id: current_sale?.metadata?.sale_id,
      product_id: currentProduct?.product_id,
      quantity: quantity as number,
      wholesale: checked,
      price: subtotal,
    };
    if (currentProduct?.product_id === 0) {
      newProduct = { ...newProduct, metadata: { name: productName } };
    }
    await dispatch(salesActions.addItemToSale(newProduct));
    setLoading(false);
    handleOnClose();
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

  const openModal = () => {
    setOpen(true);
  };

  const onProductChange = (value: string) => {
    let product = products?.find(p => p.product_id === Number(value));
    setCurrentProduct(product as Product);
  };

  return (
    <>
      <Button icon={<PlusCircleOutlined />} block onClick={openModal}>
        Agregar item
      </Button>
      <Modal
        open={open}
        onOk={handleOk}
        width={350}
        destroyOnClose
        onCancel={handleOnClose}
        footer={[
          <Row key="actions" gutter={10}>
            <Col span={12}>
              <Button key="back" block onClick={handleOnClose} loading={loading}>
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button block type="primary" onClick={handleOk} disabled={disableSaveBtn()} loading={loading}>
                Guardar
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <ModalBody style={{ paddingTop: 20 }}>
          <ProductInfo>
            <Avatar
              src={currentProduct?.image_url || FallbackImage}
              size={50}
              style={{ background: '#faefff', padding: 5 }}
              shape="circle"
            />
            <div>
              {currentProduct?.product_id !== 0 ? (
                <Paragraph style={{ marginBottom: 0 }}>
                  {CATEGORIES.find(item => item.id === currentProduct?.category_id)?.name || '- - -'}
                  {!isExtra && (
                    <>
                      <br />
                      <b>({stock - quantityUsed < 0 ? 0 : stock - quantityUsed})</b> disponibles
                    </>
                  )}
                </Paragraph>
              ) : null}
              <Title level={5} style={{ margin: 0 }}>
                {functions.money(subtotal)} * {quantity || 0} ={' '}
                <Text type="success" style={{ fontSize: 'inherit' }}>
                  {functions.money(subtotal * Number(quantity))}
                </Text>
              </Title>
            </div>
          </ProductInfo>
          <Paragraph style={{ margin: '0 0 5px', fontWeight: 600, width: '100%' }}>Producto</Paragraph>
          <Select
            style={{ width: '100%' }}
            showSearch
            virtual={false}
            placeholder="Selecciona un producto"
            optionFilterProp="children"
            value={`${currentProduct?.product_id ?? ''}`}
            filterOption={filterOption}
            options={products?.map(i => ({ value: `${i?.product_id}`, label: `${i?.name} - ${i?.categories?.name}` }))}
            onChange={onProductChange}
          />
          {currentProduct?.product_id === 0 && (
            <>
              <Space height="10px" />
              <Paragraph style={{ margin: '0 0 5px', fontWeight: 600, width: '100%' }}>Nombre del producto</Paragraph>
              <Input
                placeholder="Nombre del artículo"
                value={productName}
                onFocus={({ target }) => target.select()}
                onChange={({ target }) => setProductName(target.value)}
              />
            </>
          )}
          <Space height="10px" />

          <Radio.Group style={{ width: '100%' }} value={checked} onChange={e => onCheckChange(e.target.value)}>
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
            className={currentInput === 'price' ? 'ant-input-number-focused' : ''}
            style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
            value={subtotal}
            readOnly={isTablet}
            addonAfter={specialPrice > 0 ? 'especial' : ''}
            onFocus={({ target }) => {
              target.select();
              setCurrentInput('price');
            }}
            addonBefore={<DollarOutlined />}
            onChange={value => setSpecialPrice(value as number)}
          />
          <Space height="10px" />
          <Paragraph style={{ margin: '0 0 5px', fontWeight: 600, width: '100%' }}>Cantidad</Paragraph>
          <InputNumber
            ref={quantityInput}
            min={0}
            placeholder="Cantidad"
            className={currentInput === 'quantity' ? 'ant-input-number-focused' : ''}
            style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
            value={quantity}
            onPressEnter={handleOk}
            readOnly={isTablet}
            addonBefore={<ShoppingCartOutlined />}
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
    </>
  );
};

export default CashierModal;

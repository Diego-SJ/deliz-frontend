import { Avatar, Button, Col, InputNumber, Modal, Row, Switch, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ModalBody } from '../styles';
import Space from '@/components/atoms/Space';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Product } from '@/redux/reducers/products/types';
import { CashRegisterItem } from '@/redux/reducers/sales/types';
import useMediaQuery from '@/hooks/useMediaQueries';
import { DollarOutlined, EditOutlined, FileImageOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { APP_ROUTES } from '@/routes/routes';
import functions from '@/utils/functions';
import { productHelpers } from '@/utils/products';

type CashierModalProps = {
  open?: boolean;
  currentProduct?: Product;
  casherItem?: CashRegisterItem;
  onCancel?: () => void;
};

const { Title, Paragraph } = Typography;

const CashierModal = ({ open, onCancel, casherItem }: CashierModalProps) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number | string>(casherItem?.quantity || '0');
  const [productPrice, setProductPrice] = useState(0);
  const [currentInput, setCurrentInput] = useState<'quantity' | 'price'>('quantity');
  const quantityInput = useRef<HTMLInputElement>(null);
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const { price_id } = useAppSelector(({ sales }) => sales.cash_register);
  const stock = casherItem?.product?.stock || 0;
  const currentProduct = casherItem?.product;

  useEffect(() => {
    if (open && casherItem) {
      setQuantity(casherItem?.quantity || 0);
      setProductPrice(casherItem?.price || 0);
      setUseCustomPrice(casherItem?.price_type === 'PERSONALIZED');

      setTimeout(() => {
        quantityInput.current?.focus();
        quantityInput.current?.select();
      }, 100);
    }
  }, [open, casherItem]);

  const disableSaveBtn = () => {
    const emptyValue = Number(quantity) <= 0;
    const disable = emptyValue && casherItem?.product?.product_id !== 0;
    return disable;
  };

  const cleanFields = () => {
    setQuantity(0);
    setProductPrice(0);
  };

  const handleOnClose = () => {
    cleanFields();
    if (onCancel) onCancel();
  };

  const handleOk = async () => {
    let productUpdated: CashRegisterItem = {
      ...(casherItem as CashRegisterItem),
      quantity: Number(quantity),
      price: useCustomPrice ? productPrice : productHelpers.getProductPrice(casherItem?.product as Product, price_id),
      price_type: useCustomPrice ? 'PERSONALIZED' : 'DEFAULT',
    };
    dispatch(salesActions.cashRegister.update(productUpdated));
    handleOnClose();
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      width={400}
      destroyOnClose
      onCancel={handleOnClose}
      footer={[
        <Row key="actions" gutter={20}>
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
        <div className="w-full flex gap-4 items-center pt-2">
          <Avatar
            src={currentProduct?.image_url}
            size={60}
            shape="square"
            icon={<FileImageOutlined className="text-slate-400 text-2xl" />}
            className="bg-slate-100 p-1 !min-w-16 !max-h-16 max-w-16 min-h-16"
          />
          <div className="flex flex-col justify-between w-full">
            <Title level={5} className="!m-0 !leading-5">
              {currentProduct?.name}
            </Title>

            <div className="flex justify-between items-center mb-0">
              <Paragraph className="!m-0 text-slate-400">{currentProduct?.categories?.name || 'Sin categoría'}</Paragraph>

              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  window.open(
                    APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'edit'}/${currentProduct?.product_id}`,
                    '_blank',
                  );
                }}
              />
            </div>
            <Tag color={`${stock > 0 ? `` : 'volcano'}`} className="w-fit">
              {stock > 0 ? `${stock} unidades` : 'Sin stock'}
            </Tag>
          </div>
        </div>
        <Space height="10px" />
        <div className="flex flex-col w-full gap-4">
          <div className="">
            <Paragraph className="!m-0 !mb-2 font-medium">Cantidad</Paragraph>
            <InputNumber
              ref={quantityInput}
              min={0}
              placeholder="Cantidad"
              size="large"
              inputMode="numeric"
              type="number"
              className={currentInput === 'quantity' ? 'ant-input-number-focused' : ''}
              style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
              value={quantity}
              onPressEnter={handleOk}
              autoFocus
              addonBefore={<ShoppingCartOutlined />}
              onFocus={({ target }) => {
                target.select();
                setCurrentInput('quantity');
              }}
              onChange={value => setQuantity(value as number)}
            />
          </div>
          <div>
            <div className="flex gap-4 items-center !mb-3">
              <Paragraph className="!m-0 font-medium">Precio personalizado</Paragraph>
              <Switch onChange={setUseCustomPrice} checked={useCustomPrice} className="w-fit" />
            </div>
            {useCustomPrice && (
              <InputNumber
                min={0}
                placeholder="Precio personalizado"
                size="large"
                className={currentInput === 'price' ? 'ant-input-number-focused' : ''}
                style={{ width: '100%', textAlign: 'center', borderRadius: '6px' }}
                value={productPrice}
                onPressEnter={handleOk}
                inputMode="decimal"
                type="number"
                onFocus={({ target }) => {
                  target.select();
                  setCurrentInput('price');
                  setProductPrice(productPrice);
                }}
                addonBefore={<DollarOutlined />}
                onChange={value => setProductPrice(value as number)}
              />
            )}
          </div>
        </div>

        <Space height="10px" />
      </ModalBody>
    </Modal>
  );
};

export default CashierModal;

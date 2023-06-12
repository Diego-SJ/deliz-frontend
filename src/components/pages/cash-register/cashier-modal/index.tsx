import { Avatar, Button, Card, Col, InputNumber, Modal, Radio, Row, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ModalBody } from '../styles';
import Space from '@/components/atoms/Space';
import FallbackImage from '@/assets/img/png/Logo Color.png';
import { useAppDispatch } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Product } from '@/redux/reducers/products/types';
import { CATEGORIES } from '@/constants/mocks';
import { CashRegisterItem } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { CardBtn } from '../../../atoms/NumberKeyboard/styles';
import NumberKeyboard from '@/components/atoms/NumberKeyboard';
import useMediaQuery from '@/hooks/useMediaQueries';

type CashierModalProps = {
  open?: boolean;
  currentProduct?: Product;
  casherItem?: CashRegisterItem;
  action?: 'ADD' | 'EDIT' | 'ADD_UNKOWN';
  onCancel?: () => void;
};

const CashierModal = ({ open, currentProduct, action = 'ADD', onCancel, casherItem }: CashierModalProps) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number | string>('');
  const [checked, setChecked] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const quantityInput = useRef<HTMLInputElement>(null);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        quantityInput.current?.focus();
        quantityInput.current?.select();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    if (action === 'EDIT' && casherItem) {
      setQuantity(casherItem.quantity);
      setChecked(casherItem.wholesale_price);
    }
  }, [action, currentProduct]);

  useEffect(() => {
    let currentPrice = checked ? currentProduct?.wholesale_price || 0 : currentProduct?.retail_price || 0;
    setSubtotal(currentPrice);
  }, [checked, currentProduct]);

  const cleanFields = () => {
    setQuantity(0);
    setChecked(true);
  };

  const handleOnClose = () => {
    cleanFields();
    if (onCancel) onCancel();
  };

  const handleOk = async () => {
    if (action === 'ADD') {
      dispatch(
        salesActions.cashRegister.add({
          customer_id: 1,
          product: currentProduct as Product,
          quantity: quantity as number,
          wholesale_price: checked,
        }),
      );
    } else {
      dispatch(
        salesActions.cashRegister.update({
          ...(casherItem as CashRegisterItem),
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

  return (
    <Modal
      open={open}
      onOk={handleOk}
      maskClosable={false}
      width={350}
      destroyOnClose
      onCancel={handleOnClose}
      footer={[
        <Row key="actions" gutter={10}>
          <Col span={12}>
            <Button key="back" block onClick={handleOnClose}>
              Cancelar
            </Button>
          </Col>
          <Col span={12}>
            <Button block type="primary" onClick={handleOk} disabled={Number(quantity) <= 0}>
              Guardar
            </Button>
          </Col>
        </Row>,
      ]}
    >
      <ModalBody>
        <Avatar
          src={currentProduct?.image_url || FallbackImage}
          size={100}
          style={{ background: 'white', padding: !!currentProduct?.image_url ? 0 : 5 }}
          shape="circle"
        />
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          {currentProduct?.name}
        </Typography.Title>
        <Typography.Paragraph style={{ marginBottom: 5 }}>
          {CATEGORIES.find(item => item.id === currentProduct?.category_id)?.name}
        </Typography.Paragraph>
        <Typography.Title level={4} type="success" style={{ margin: 0 }}>
          {functions.money(subtotal)} * {quantity} = {functions.money(subtotal * Number(quantity))}
        </Typography.Title>
        <Space height="10px" />
        <Radio.Group style={{ width: '100%' }} size="large" value={checked} onChange={e => onCheckChange(e.target.value)}>
          <Radio.Button value={true} style={{ width: '50%', textAlign: 'center' }}>
            Mayoreo
          </Radio.Button>
          <Radio.Button value={false} style={{ width: '50%', textAlign: 'center' }}>
            Menudeo
          </Radio.Button>
        </Radio.Group>
        <Space height="10px" />
        <InputNumber
          ref={quantityInput}
          min={0}
          max={currentProduct?.stock ?? 0}
          placeholder="Cantidad"
          size="large"
          style={{ width: '100%', textAlign: 'center' }}
          value={quantity}
          onPressEnter={handleOk}
          readOnly={isTablet}
          onChange={value => onQuantityChange(value as number)}
        />
        <Space height="10px" />
        {isTablet && <NumberKeyboard onChange={onQuantityChange} />}
      </ModalBody>
    </Modal>
  );
};

export default CashierModal;

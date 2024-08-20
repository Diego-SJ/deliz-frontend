import { Button, Col, InputNumber, Modal, Row, Switch, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ModalBody } from '../styles';
import Space from '@/components/atoms/Space';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Product } from '@/redux/reducers/products/types';
import { CashRegisterItem } from '@/redux/reducers/sales/types';
import { DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { productHelpers } from '@/utils/products';
import ProductAvatar from '@/components/atoms/ProductAvatar';

type CashierModalProps = {
  open?: boolean;
  currentProduct?: Product;
  casherItem?: Partial<CashRegisterItem>;
  onCancel?: () => void;
};

const CashierModal = ({ open, onCancel, casherItem }: CashierModalProps) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number | string>(casherItem?.quantity || '0');
  const [productPrice, setProductPrice] = useState(0);
  const [currentInput, setCurrentInput] = useState<'quantity' | 'price'>('quantity');
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const quantityInput = useRef<HTMLInputElement>(null);
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const { price_id } = useAppSelector(({ sales }) => sales.cash_register);
  const { currentBranch } = useAppSelector(({ branches }) => branches);
  const { stock } = (casherItem?.product?.inventory || {})[currentBranch?.branch_id || ''] || 0;
  const currentProduct = casherItem?.product;

  useEffect(() => {
    if (open && casherItem) {
      setQuantity(casherItem?.quantity || 0);
      setProductPrice(casherItem?.price || 0);
      setUseCustomPrice(casherItem?.price_type === 'PERSONALIZED');

      setTimeout(() => {
        quantityInput.current?.focus();
        quantityInput.current?.select();
      }, 200);
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
      price: useCustomPrice ? productPrice : productHelpers.getProductPrice(casherItem?.product as Product, price_id || null),
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
        <ProductAvatar product={currentProduct} enableEdit={true} />

        <Space height="10px" />
        <div className="flex flex-col w-full gap-4">
          <div className="">
            <Typography.Paragraph className="!m-0 !mb-2 font-medium">Cantidad</Typography.Paragraph>
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
            {Number(quantity) > stock && (
              <Typography.Paragraph type="warning" className="!m-0 !mt-2">
                La cantidad supera el stock
              </Typography.Paragraph>
            )}
          </div>
          {permissions?.pos?.add_custom_price && (
            <div>
              <div className="flex gap-4 items-center !mb-3">
                <Typography.Paragraph className="!m-0 font-medium">Precio personalizado</Typography.Paragraph>
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
          )}
        </div>

        <Space height="10px" />
      </ModalBody>
    </Modal>
  );
};

export default CashierModal;

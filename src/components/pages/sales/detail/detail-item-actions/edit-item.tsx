import ProductAvatar from '@/components/atoms/ProductAvatar';
import Space from '@/components/atoms/Space';
import { useAppDispatch } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { SaleItem } from '@/redux/reducers/sales/types';
import { DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Col, InputNumber, Modal, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
  open?: boolean;
  onClose?: () => void;
  currentItem?: SaleItem;
};

const EditSaleItemModal = ({ open, onClose, currentItem }: Props) => {
  const dispatch = useAppDispatch();
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newPrice, setNewPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState<'price' | 'quantity'>('price');

  useEffect(() => {
    if (currentItem && open) {
      setNewQuantity(currentItem.quantity || 0);
      setNewPrice(currentItem.price || 0);
    }
  }, [currentItem, open]);

  const closeModal = () => {
    if (onClose) onClose();
    setNewPrice(0);
    setNewQuantity(0);
  };

  const onAmountsChange = (value: number | null) => {
    if (currentInput === 'price') setNewPrice(value || 0);
    else if (currentInput === 'quantity') setNewQuantity(value || 0);
  };

  const updateItem = async () => {
    setLoading(true);
    const result = await dispatch(salesActions.updateSaleItem({ ...currentItem, quantity: newQuantity, price: newPrice }));
    if (result) closeModal();
    setLoading(false);
  };

  if (!currentItem) return null;

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      destroyOnClose
      width={380}
      footer={[
        <Row key="actions" gutter={20}>
          <Col span={12}>
            <Button size="large" key="back" block onClick={closeModal} loading={loading}>
              Cancelar
            </Button>
          </Col>
          <Col span={12}>
            <Button size="large" block type="primary" onClick={updateItem} loading={loading}>
              Actualizar
            </Button>
          </Col>
        </Row>,
      ]}
    >
      <div>
        <ProductAvatar
          isManualEntry={currentItem?.metadata?.price_type === 'PERSONALIZED'}
          product={{ ...currentItem?.products, name: currentItem?.products?.name || currentItem?.metadata?.product_name }}
        />

        <div className="flex flex-col w-full">
          <Typography.Paragraph className="!text-sm !font-medium !mb-1 !mt-3">Precio</Typography.Paragraph>
          <InputNumber
            min={0}
            placeholder="Precio"
            type="number"
            inputMode="decimal"
            className="w-full mb-4"
            size="large"
            addonBefore={<DollarOutlined />}
            value={newPrice}
            onFocus={target => {
              setCurrentInput('price');
              target.currentTarget.select();
            }}
            onChange={onAmountsChange}
          />

          <Typography.Paragraph className="!text-sm !font-medium !mb-1 !mt-3">Cantidad</Typography.Paragraph>
          <InputNumber
            min={0}
            placeholder="Cantidad"
            className="w-full"
            size="large"
            addonBefore={<ShoppingCartOutlined />}
            value={newQuantity}
            onPressEnter={updateItem}
            type="number"
            inputMode="numeric"
            onFocus={target => {
              setCurrentInput('quantity');
              target.currentTarget.select();
            }}
            onChange={onAmountsChange}
          />
        </div>

        <Space height="10px" />
      </div>
    </Modal>
  );
};

export default EditSaleItemModal;

import { Avatar, Button, Col, Input, InputNumber, Modal, Row, Segmented, Select, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Space from '@/components/atoms/Space';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Product } from '@/redux/reducers/products/types';
import { CashRegisterItem, SaleItem } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import useMediaQuery from '@/hooks/useMediaQueries';
import {
  CloseOutlined,
  DollarOutlined,
  FileImageOutlined,
  PlusCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SignatureOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import ProductAvatar from '@/components/atoms/ProductAvatar';
import { productHelpers } from '@/utils/products';

type CashierModalProps = {
  currentProduct?: Product;
  casherItem?: CashRegisterItem;
  action?: 'ADD' | 'EDIT' | 'ADD_UNKOWN';
  onCancel?: () => void;
};

const filterOption = (input: string, option?: { label: string; value: string }) =>
  functions.includes(option?.label, input?.toLowerCase());

const CashierModal = ({ action = 'ADD', casherItem }: CashierModalProps) => {
  const dispatch = useAppDispatch();
  const { current_sale } = useAppSelector(({ sales }) => sales);
  const { products } = useAppSelector(({ products }) => products);
  const { prices_list, currentBranch } = useAppSelector(({ branches }) => branches);
  const [productQuantity, setPriceQuantity] = useState<number | null>(casherItem?.quantity || null);
  const [productPrice, setProductPrice] = useState(0);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const quantityInput = useRef<HTMLInputElement>(null);
  const { isTablet, isPhablet } = useMediaQuery();
  const [productType, setProductType] = useState<'CATALOG' | 'CUSTOM'>('CATALOG');
  const stock = productHelpers.getProductStock(currentProduct, currentBranch?.branch_id || null);

  useEffect(() => {
    if (open) {
      if (action === 'EDIT' && casherItem) {
        setProductName(casherItem.product?.name || '');
        setCurrentProduct((casherItem.product as Product) || null);
        setProductPrice(casherItem.price);
        setPriceQuantity(casherItem.quantity);
      }

      setTimeout(() => {
        quantityInput.current?.focus();
        quantityInput.current?.select();
      }, 100);
    }
  }, [open, action, casherItem]);

  const disableSaveBtn = () => {
    const missingQuantity = Number(productQuantity) <= 0;
    const missingPrice = Number(productPrice) <= 0;
    return missingQuantity || missingPrice || !currentProduct;
  };

  const cleanFields = () => {
    setPriceQuantity(0);
    setProductPrice(0);
    setProductName('');
    setCurrentProduct(null);
  };

  const handleOnClose = () => {
    cleanFields();
    setOpen(false);
  };

  const handleOk = async () => {
    setLoading(true);

    let newProduct: SaleItem = {
      sale_id: current_sale?.metadata?.sale_id,
      product_id: currentProduct?.product_id,
      quantity: productQuantity as number,
      price: productPrice,
      metadata: {
        price_type: currentProduct?.product_id ? 'DEFAULT' : 'PERSONALIZED',
        product_name: productName || currentProduct?.name,
      },
    };

    await dispatch(salesActions.addItemToSale(newProduct));
    setLoading(false);
    handleOnClose();
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
      <Button size={isTablet ? 'large' : 'middle'} icon={<PlusCircleOutlined />} block onClick={openModal}>
        {isPhablet ? 'Agregar' : 'Agregar'}
      </Button>
      <Modal
        open={open}
        onOk={handleOk}
        width={400}
        destroyOnClose
        onCancel={handleOnClose}
        footer={[
          <Row key="actions" gutter={10}>
            <Col span={12}>
              <Button size="large" key="back" block onClick={handleOnClose} loading={loading}>
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button block size="large" type="primary" onClick={handleOk} disabled={disableSaveBtn()} loading={loading}>
                Guardar
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <div>
          <Typography.Title level={5}>{action === 'EDIT' ? 'Editar' : 'Agregar'} producto</Typography.Title>
          <Segmented
            className="w-full mb-3"
            size="large"
            value={productType}
            options={[
              { label: 'Existente', value: 'CATALOG', icon: <ShoppingOutlined /> },
              { label: 'Personalizado', value: 'CUSTOM', icon: <SignatureOutlined /> },
            ]}
            block
            onChange={value => {
              setProductType(value as 'CATALOG' | 'CUSTOM');
              if (value === 'CUSTOM') {
                setCurrentProduct(null);
              }
              setProductPrice(0);
              setPriceQuantity(0);
            }}
          />

          {productType === 'CATALOG' ? (
            <>
              {currentProduct ? (
                <ProductAvatar
                  product={currentProduct}
                  stock={stock}
                  icon={<CloseOutlined />}
                  onButtonClick={() => setCurrentProduct(null)}
                />
              ) : (
                <>
                  <Typography.Paragraph className="!text-sm !font-medium !mb-1 !mt-3">Producto</Typography.Paragraph>
                  <Select
                    className="w-full"
                    showSearch
                    size="large"
                    virtual={false}
                    placeholder="Selecciona un producto"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={products?.map(i => ({ value: `${i?.product_id}`, label: `${i?.name}`, ...i }))}
                    optionRender={option => {
                      return (
                        <div className="flex items-center px-0 py-0 gap-4">
                          <Avatar
                            shape="square"
                            src={option?.data?.image_url}
                            icon={<FileImageOutlined className="text-slate-600" />}
                            className="bg-slate-600/10 w-10 h-10 min-w-10"
                          />
                          <div className="flex flex-col">
                            <span className="font-normal text-base mb-0 lowercase">{option?.data?.name}</span>{' '}
                            <span className="text-slate-400 font-light">{option?.data?.categories?.name || 'Sin categoría'}</span>{' '}
                          </div>
                        </div>
                      );
                    }}
                    onChange={onProductChange}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Typography.Paragraph className="!text-sm !font-medium !mb-1 !mt-3">Producto</Typography.Paragraph>
              <Input
                size="large"
                placeholder="Nombre del artículo"
                value={productName}
                onFocus={({ target }) => target.select()}
                onChange={({ target }) => {
                  setProductName(target.value);
                  setCurrentProduct({ product_id: null as any, name: target.value } as Product);
                }}
              />
            </>
          )}

          <Typography.Paragraph className="!text-sm !font-medium !mb-1 !mt-3">Precio</Typography.Paragraph>
          {productType === 'CATALOG' && currentProduct ? (
            <>
              <Select
                className="w-full"
                showSearch
                size="large"
                virtual={false}
                placeholder="Selecciona un precio"
                optionFilterProp="children"
                filterOption={filterOption}
                options={prices_list?.map(i => ({
                  value: `${i?.price_id}`,
                  label: `${i?.name} - ${functions.money(productHelpers.getProductPrice(currentProduct, i?.price_id as string))}`,
                  ...i,
                }))}
                optionRender={option => {
                  return (
                    <div className="flex w-full justify-between items-center py-2">
                      <span className="font-normal text-base mb-0 lowercase ">{option?.label}</span>{' '}
                    </div>
                  );
                }}
                onChange={value => {
                  setProductPrice(productHelpers.getProductPrice(currentProduct, value as string));
                  quantityInput.current?.focus();
                }}
              />
            </>
          ) : (
            <div>
              <InputNumber
                min={0}
                size="large"
                placeholder="Precio"
                className="w-full"
                value={productPrice}
                type="number"
                inputMode="decimal"
                onFocus={({ target }) => {
                  target.select();
                }}
                addonBefore={<DollarOutlined />}
                onChange={value => {
                  setProductPrice(value as number);
                }}
              />
            </div>
          )}

          <Typography.Paragraph className="!text-sm !font-medium !mb-1 !mt-3">Cantidad</Typography.Paragraph>
          <InputNumber
            size="large"
            ref={quantityInput}
            min={0}
            placeholder="Cantidad"
            className="w-full"
            value={productQuantity}
            type="number"
            inputMode="numeric"
            onPressEnter={handleOk}
            addonBefore={<ShoppingCartOutlined />}
            onFocus={({ target }) => {
              target.select();
            }}
            onChange={value => setPriceQuantity(value)}
          />
          {Number(productQuantity) > stock && (
            <Typography.Paragraph type="warning" className="!mx-0 !mt-2 !mb-0">
              <WarningOutlined /> La cantidad ingresada supera el stock
            </Typography.Paragraph>
          )}
          <Space height="10px" />
        </div>
      </Modal>
    </>
  );
};

export default CashierModal;

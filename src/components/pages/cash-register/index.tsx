import React, { useEffect, useRef, useState } from 'react';
import { Col, Drawer, FloatButton, Input, InputRef, Layout, Radio, Row, Tag, Tooltip, Typography } from 'antd';
import { CATEGORIES } from '@/constants/categories';
import { CardBtn, CardProduct, CustomTabs, ProductsCheckout, ProductsContainer } from './styles';
import FallbackImage from '@/assets/img/png/logo_deliz.webp';
import { Product } from '@/redux/reducers/products/types';
import Space from '@/components/atoms/Space';
import CashRegisterItemsList from './items-list';
import CashierActions from './cashier-actions';
import CashierHeader from '@/components/organisms/CashierHeader';
import CashierModal from './cashier-modal';
import CashierCustomer from './cashier-customer';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { productActions } from '@/redux/reducers/products';
import { customerActions } from '@/redux/reducers/customers';
import useMediaQuery from '@/hooks/useMediaQueries';
import { UnorderedListOutlined } from '@ant-design/icons';
import { salesActions } from '@/redux/reducers/sales';
import { productHelpers } from '@/utils/products';
import { useParams } from 'react-router-dom';

const { Content } = Layout;

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  height: '100%',
  backgroundColor: '#e9e9e95c',
};

const CashRegister = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const { products } = useAppSelector(({ products }) => products);
  const { customers } = useAppSelector(({ customers }) => customers);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [searchText, setSearchText] = useState<string>('');
  const [categories] = useState(CATEGORIES);
  const [currentCategory, setCurrentCategory] = useState('1');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<5 | 19 | null>(null);
  const searchInput = useRef<InputRef>(null);
  const { isPhablet } = useMediaQuery();
  const firstRender = useRef<boolean>(false);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(productActions.fetchProducts({ refetch: true }));
      dispatch(customerActions.fetchCustomers({ refetch: true }));
    }
  }, [products, customers, dispatch]);

  useEffect(() => {
    let _products = productHelpers.searchProducts(searchText, products, currentCategory);
    setCurrentProducts(_products);
  }, [products, searchText]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const mode = query.get('mode');
    if (mode === 'order') {
      dispatch(salesActions.updateCashRegister({ mode: 'order' }));
    } else {
      dispatch(salesActions.updateCashRegister({ mode: 'sale' }));
    }

    return () => {
      dispatch(salesActions.updateCashRegister({ mode: undefined }));
    };
  }, [params]);

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = (item: Product) => {
    setCurrentProduct(item);
    setOpen(true);
  };

  const onChange = (key: string) => {
    setCurrentCategory(key);
  };

  const onCustomerChange = (customerId: any) => {
    setCurrentClient(customerId);
    if (customerId) {
      dispatch(salesActions.cashRegister.setCustomerId(customerId));
    }
  };

  return (
    <Layout style={{ height: '100vh', minWidth: '100dvw', maxWidth: '100dvw' }}>
      <CashierHeader />
      <Layout>
        <Content style={contentStyle}>
          <Row gutter={[0, 10]} style={{ minHeight: '100%' }}>
            <Col lg={14} sm={24}>
              <ProductsContainer>
                <Radio.Group
                  value={currentClient}
                  size="large"
                  style={{ width: '100%', marginBottom: 10 }}
                  onChange={event => onCustomerChange(event.target.value)}
                >
                  <Radio.Button value={5} style={{ width: '33.33%' }}>
                    MENUDEO
                  </Radio.Button>
                  <Radio.Button value={19} style={{ width: '33.33%' }}>
                    MAYOREO
                  </Radio.Button>
                  <Radio.Button value={null} style={{ width: '33.33%' }}>
                    OTRO
                  </Radio.Button>
                </Radio.Group>
                {!currentClient && <CashierCustomer />}
                <Input.Search
                  ref={searchInput}
                  allowClear
                  size="large"
                  style={{ marginTop: 10, marginBottom: 0 }}
                  placeholder="Buscar producto"
                  onFocus={() => searchInput.current?.select()}
                  onChange={({ target }) => setSearchText(target.value)}
                />

                <Space />
                {!!!searchText && (
                  <Row gutter={[10, 10]}>
                    {products
                      ?.filter(i => i?.status === 2)
                      .map(product => {
                        return (
                          <ItemProduct
                            key={product.product_id}
                            imageSrc={product.image_url}
                            title={product.name}
                            category={(product as any)?.categories?.name}
                            size={(product as any)?.sizes?.name}
                            onClick={() => openModal(product)}
                          />
                        );
                      })}
                  </Row>
                )}
                <CustomTabs
                  style={{ marginTop: 10 }}
                  onChange={onChange}
                  type="card"
                  size="small"
                  items={categories.map((category, i) => {
                    return {
                      label: category.name,
                      key: `${category.id}`,
                      children: (
                        <Row gutter={[10, 10]} key={i}>
                          {currentProducts.map(product => {
                            return (
                              <ItemProduct
                                key={product.product_id}
                                imageSrc={product.image_url}
                                title={product.name}
                                category={(product as any)?.categories?.name}
                                size={(product as any)?.sizes?.name}
                                onClick={() => openModal(product)}
                              />
                            );
                          })}
                        </Row>
                      ),
                    };
                  })}
                />
              </ProductsContainer>
            </Col>

            {!isPhablet && (
              <Col lg={10} sm={0}>
                <ProductsCheckout>
                  <CashierCustomer />
                  <CashRegisterItemsList />
                  <CashierActions />
                </ProductsCheckout>
              </Col>
            )}
          </Row>
        </Content>
      </Layout>
      {isPhablet && (
        <FloatButton
          style={{ transform: 'scale(1.4)' }}
          icon={<UnorderedListOutlined rev={{}} />}
          type="default"
          onClick={() => setDrawerOpen(true)}
        />
      )}
      <CashierModal open={open} currentProduct={currentProduct} onCancel={closeModal} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} width="100vw" styles={{ body: { padding: 0 } }}>
        <ProductsCheckout>
          <CashierCustomer />
          <CashRegisterItemsList />
          <CashierActions />
        </ProductsCheckout>
      </Drawer>
    </Layout>
  );
};

type ItemProductsProps = {
  title?: string;
  imageSrc?: string;
  category?: string;
  size?: string;
  onClick?: () => void;
};

const ItemProduct = (props: ItemProductsProps) => {
  let category = props?.category || 'Sin categoría';
  let size = props?.size || '- - -';
  return (
    <Col lg={6} md={6} xs={8}>
      <Tooltip title={props?.title ?? 'Producto sin nombre'}>
        <CardProduct onClick={props?.onClick}>
          <img className="card-product-image" src={props?.imageSrc || FallbackImage} alt={props.title} />
          <Typography.Text className="card-product-name" style={{ fontWeight: 600, margin: '8px 0' }}>
            {props?.title ?? 'Producto sin nombre'}
          </Typography.Text>
          <div className="card-product-tags">
            <Tag color={functions.getTagColor(size)}>{size}</Tag>
            <Tag color={functions.getTagColor(category)}>{category}</Tag>
          </div>
        </CardProduct>
      </Tooltip>
    </Col>
  );
};

export default CashRegister;

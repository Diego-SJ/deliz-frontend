import React, { useEffect, useRef, useState } from 'react';
import { Col, Drawer, FloatButton, Input, InputRef, Layout, Radio, Row, Tag, Tooltip, Typography } from 'antd';
import { theme } from '@/styles/theme/config';
import { CATEGORIES } from '@/constants/categories';
import { CardBtn, CardProduct, CustomTabs, ProductsCheckout, ProductsContainer } from './styles';
import FallbackImage from '@/assets/img/png/Logo Color.png';
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

const { Content } = Layout;

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  height: '100%',
  backgroundColor: '#e9e9e95c',
};

const CashRegister = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { products } = useAppSelector(({ products }) => products);
  const { customers } = useAppSelector(({ customers }) => customers);
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [searchText, setSearchText] = useState<string>('');
  const [categories] = useState(CATEGORIES);
  const [currentCategory, setCurrentCategory] = useState('1');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<5 | 19 | null>(null);
  const searchInput = useRef<InputRef>(null);
  const { isPhablet } = useMediaQuery();

  useEffect(() => {
    if (!products.length) dispatch(productActions.fetchProducts({ refetch: true }));
    if (!customers.length) dispatch(customerActions.fetchCustomers(true));
  }, [products, customers, dispatch]);

  useEffect(() => {
    let _products = products?.filter(item => {
      let matchName = functions.includes(item?.name, searchText);
      let matchCategory = item?.category_id === Number(currentCategory);
      return matchName && matchCategory;
    });

    setCurrentProducts(_products);
  }, [products, searchText, currentCategory]);

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
    <Layout style={{ height: '100vh' }}>
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

                <Space />
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
                <Input.Search
                  ref={searchInput}
                  allowClear
                  size="large"
                  style={{ marginTop: 30, marginBottom: 10 }}
                  placeholder="Buscar producto"
                  onChange={({ target }) => setSearchText(target.value)}
                />
                <CustomTabs
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
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} width="100vw" bodyStyle={{ padding: 0 }}>
        <ProductsCheckout>
          <CashierCustomer />
          <CashRegisterItemsList />
          <CashierActions />
        </ProductsCheckout>
      </Drawer>
    </Layout>
  );
};

type ItemButtonProps = {
  title?: string;
  imageSrc?: string;
  onClick?: () => void;
};

const ItemButton = (props: ItemButtonProps) => {
  return (
    <Col lg={4} md={4} sm={6} xs={8}>
      <Tooltip title={props?.title ?? 'Producto sin nombre'}>
        <CardBtn
          onClick={props?.onClick}
          hoverable
          className={!!!props?.imageSrc ? 'no-image' : ''}
          styles={{ body: { backgroundImage: `url('${props?.imageSrc || FallbackImage}')` } }}
        >
          <Typography.Text>{props?.title ?? 'Producto sin nombre'}</Typography.Text>
        </CardBtn>
      </Tooltip>
    </Col>
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
          <Typography.Text style={{ fontWeight: 600, margin: '8px 0' }}>{props?.title ?? 'Producto sin nombre'}</Typography.Text>
          <div className="card-product-tags">
            <Tag color={functions.getTagColor(category)}>{category}</Tag>
            <Tag color={functions.getTagColor(size)}>{size}</Tag>
          </div>
        </CardProduct>
      </Tooltip>
    </Col>
  );
};

export default CashRegister;

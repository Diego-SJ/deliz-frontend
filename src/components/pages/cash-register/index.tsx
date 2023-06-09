import React, { useEffect, useRef, useState } from 'react';
import { Col, Input, InputRef, Layout, Row, Tooltip, Typography } from 'antd';
import { theme } from '@/styles/theme/config';
import { CATEGORIES } from '@/constants/categories';
import { CardBtn, CustomTabs, ProductsCheckout, ProductsContainer } from './styles';
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

const { Content } = Layout;

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  height: '100%',
  backgroundColor: theme.colors.primary,
};

const CashRegister = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { products } = useAppSelector(({ products }) => products);
  const { customers } = useAppSelector(({ customers }) => customers);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [searchText, setSearchText] = useState<string>('');
  const [categories] = useState(CATEGORIES);
  const [currentCategory, setCurrentCategory] = useState('1');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const searchInput = useRef<InputRef>(null);

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
    setTimeout(() => {
      searchInput.current?.focus();
      searchInput.current?.select();
    }, 600);
  };

  const openModal = (item: Product) => {
    setCurrentProduct(item);
    setOpen(true);
  };

  const onChange = (key: string) => {
    setCurrentCategory(key);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <CashierHeader />
      <Layout>
        <Content style={contentStyle}>
          <Row gutter={[0, 10]} style={{ minHeight: '100%' }}>
            <Col lg={14} sm={24}>
              <ProductsContainer>
                <Input.Search
                  ref={searchInput}
                  allowClear
                  size="large"
                  placeholder="Buscar producto"
                  onChange={({ target }) => setSearchText(target.value)}
                />
                <Space />
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
                          {currentProducts.map(product => (
                            <ItemButton
                              key={product.product_id}
                              imageSrc={product.image_url}
                              title={product.name}
                              onClick={() => openModal(product)}
                            />
                          ))}
                        </Row>
                      ),
                    };
                  })}
                />
              </ProductsContainer>
            </Col>
            <Col lg={10} sm={0}>
              <ProductsCheckout>
                <CashierCustomer />
                <CashRegisterItemsList />
                <CashierActions />
              </ProductsCheckout>
            </Col>
          </Row>
        </Content>
      </Layout>
      <CashierModal open={open} currentProduct={currentProduct} onCancel={closeModal} />
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
          className={!props?.imageSrc ? 'no-image' : ''}
          bodyStyle={{ backgroundImage: `url('${props?.imageSrc || FallbackImage}')` }}
        >
          <Typography.Text>{props?.title ?? 'Producto sin nombre'}</Typography.Text>
        </CardBtn>
      </Tooltip>
    </Col>
  );
};

export default CashRegister;

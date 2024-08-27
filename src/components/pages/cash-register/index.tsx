import { useEffect, useRef } from 'react';
import { Col, Layout, Row } from 'antd';
import { ProductsCheckout } from './styles';
import CashRegisterItemsList from './cart-items-list';
import CashierActions from './cashier-actions';
import CashierHeader from '@/components/organisms/CashierHeader';
import CashierCustomer from './change-customer';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import ChangePrice from './change-price';
import SearchProducts from './search-products';
import OpenCashCut from './open-cash-cut';
import { cashiersActions } from '@/redux/reducers/cashiers';

const { Content } = Layout;

const CashRegister = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(({ products }) => products);
  const { customers } = useAppSelector(({ customers }) => customers);
  const firstRender = useRef<boolean>(false);
  const siteModeObteined = useRef<boolean>(false);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(cashiersActions.fetchDataForCashRegister());
    }
  }, [products, customers, dispatch]);

  useEffect(() => {
    if (!siteModeObteined.current && window) {
      siteModeObteined.current = true;
      const query = new URLSearchParams(window.location.search);
      const mode = query.get('mode');
      if (mode === 'order') {
        dispatch(salesActions.updateCashRegister({ mode: 'order' }));
      } else {
        dispatch(salesActions.updateCashRegister({ mode: 'sale' }));
      }
    }

    return () => {
      dispatch(salesActions.updateCashRegister({ mode: null }));
    };
  }, [siteModeObteined, dispatch]);

  return (
    <Layout style={{ minHeight: '100dvh', maxHeight: '100dvh', minWidth: '100dvw', maxWidth: '100dvw' }}>
      <CashierHeader />
      <Layout className="bg-[#f5f5f5]">
        <Content>
          <Row gutter={[0, 10]} style={{ minHeight: '100%' }}>
            <Col lg={14} xl={14} sm={24} md={12} xs={24}>
              <div className="flex gap-4 px-3 my-3">
                <CashierCustomer />
                <ChangePrice />
              </div>
              <SearchProducts />
            </Col>

            <Col lg={10} xl={10} sm={0} md={12} xs={0}>
              <ProductsCheckout
                style={{ padding: 0 }}
                styles={{ body: { padding: 0 } }}
                className="w-full !border-0 !border-l !border-slate-300 !min-h-[calc(100dvh-60px)] !max-h-[calc(100dvh-60px)]"
              >
                <CashRegisterItemsList />
                <CashierActions />
              </ProductsCheckout>
            </Col>
          </Row>
        </Content>
      </Layout>
      <OpenCashCut />
    </Layout>
  );
};

export default CashRegister;

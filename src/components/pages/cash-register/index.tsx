import { useEffect, useRef } from 'react';
import { Col, Layout, Row } from 'antd';
import { ProductsCheckout } from './styles';
import CashRegisterItemsList from './cart-items-list';
import CashierActions from './cashier-actions';
import CashierHeader from '@/components/organisms/CashierHeader';
import CashierCustomer from './cashier-customer';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { customerActions } from '@/redux/reducers/customers';
import { salesActions } from '@/redux/reducers/sales';
import { useParams } from 'react-router-dom';
import ChangePrice from './change-price';
import SearchProducts from './search-products';
import { branchesActions } from '@/redux/reducers/branches';
import OpenCashCut from './open-cash-cut';
import { cashiersActions } from '@/redux/reducers/cashiers';

const { Content } = Layout;

const CashRegister = () => {
  const dispatch = useAppDispatch();

  const params = useParams();
  const { products } = useAppSelector(({ products }) => products);
  const { customers } = useAppSelector(({ customers }) => customers);
  const firstRender = useRef<boolean>(false);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(productActions.fetchProducts({ refetch: true }));
      dispatch(branchesActions.getPrices());
      dispatch(branchesActions.getCurrentCashRegister());
      dispatch(cashiersActions.cash_cuts.fetchCashCutData());
    }
  }, [products, customers, dispatch]);

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

  return (
    <Layout style={{ minHeight: '100dvh', maxHeight: '100dvh', minWidth: '100dvw', maxWidth: '100dvw' }}>
      <CashierHeader />
      <Layout className="bg-slate-100">
        <Content>
          <Row gutter={[0, 10]} style={{ minHeight: '100%' }}>
            <Col lg={12} xl={14} sm={24} md={12} xs={24}>
              <div className="flex gap-4 px-3 my-3">
                <CashierCustomer />
                <ChangePrice />
              </div>
              <SearchProducts />
            </Col>

            <Col lg={12} xl={10} sm={0} md={12} xs={0}>
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

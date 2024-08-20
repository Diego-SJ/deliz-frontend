import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch } from '@/hooks/useStore';
import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ActiveCashier from './active-cashier';
import { cashiersActions } from '@/redux/reducers/cashiers';

const CurrentCashier = () => {
  const dispatch = useAppDispatch();
  const firstRender = useRef(false);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(cashiersActions.cash_cuts.fetchCashCutData());
    }
  }, [firstRender]);

  return (
    <div className="max-w-[900px] mx-auto">
      <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
        <Col lg={{ span: 12 }}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>Cajas</Link>,
                key: 'transactions',
              },
              { title: 'Caja actual' },
            ]}
          />
        </Col>
      </Row>
      <ActiveCashier />
    </div>
  );
};

export default CurrentCashier;

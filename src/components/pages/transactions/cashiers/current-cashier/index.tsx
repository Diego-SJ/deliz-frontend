import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import OpenCashier from './open-cashier';
import { cashiersActions } from '@/redux/reducers/cashiers';

const CurrentCashier = () => {
  const dispatch = useAppDispatch();
  const { cashiers } = useAppSelector(({ sales }) => sales);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      dispatch(cashiersActions.cash_operations.calculateCashierData());
    }
  }, [cashiers?.data, dispatch]);

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
        <Col lg={{ span: 12 }}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>Transacciones</Link>,
                key: 'transactions',
              },
              { title: 'Caja actual' },
            ]}
          />
        </Col>
      </Row>
      <OpenCashier />
    </>
  );
};

export default CurrentCashier;

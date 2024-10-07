import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ActiveCashier from './active-cashier';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { CashCut } from '@/redux/reducers/cashiers/types';
import BottomMenu from '@/components/organisms/bottom-menu';
import useMediaQuery from '@/hooks/useMediaQueries';

const CurrentCashier = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { active_cash_cut } = useAppSelector(({ cashiers }) => cashiers);
  const [actualCashCut, setActualCashCut] = useState<Partial<CashCut> | null>(
    active_cash_cut || null,
  );
  const firstRender = useRef(true);
  const firstCashCutFetch = useRef(false);

  useEffect(() => {
    console.log(
      active_cash_cut?.cash_cut_id,
      '---',
      actualCashCut?.cash_cut_id,
    );
    // If the active cash cut is different from the actual cash cut, then it is not the first render
    if (
      !!active_cash_cut?.cash_cut_id &&
      active_cash_cut?.cash_cut_id !== actualCashCut?.cash_cut_id
    ) {
      firstRender.current = false;
    }
  }, [active_cash_cut, firstRender, actualCashCut]);

  useEffect(() => {
    // If it is not the first render, then set the actual cash cut and fetch the cash cut data
    if (!firstRender.current) {
      firstRender.current = true;
      setActualCashCut(active_cash_cut);
      dispatch(cashiersActions.cash_cuts.fetchCashCutData());
    }
  }, [firstRender, active_cash_cut]);

  useEffect(() => {
    if (!firstCashCutFetch.current) {
      firstCashCutFetch.current = true;
      dispatch(
        cashiersActions.cash_cuts.fetchCashCutOpened({
          fetchCashCutOperations: true,
        }),
      ).then(() => {
        setActualCashCut(active_cash_cut);
      });
    }
  }, [dispatch, firstCashCutFetch]);

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

      {isTablet && (
        <>
          <div className="h-[100px]" />
          <BottomMenu />
        </>
      )}
    </div>
  );
};

export default CurrentCashier;

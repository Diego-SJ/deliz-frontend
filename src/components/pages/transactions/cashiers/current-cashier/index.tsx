import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { Breadcrumb, Col, Row, message, Avatar } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { salesActions } from '@/redux/reducers/sales';
import { Cashier } from '@/redux/reducers/sales/types';
import Table from '@/components/molecules/Table';
import OpenCashier from '../open-cashier';
import { cashiersActions } from '@/redux/reducers/cashiers';

const columns: ColumnsType<Cashier> = [
  {
    title: '',
    dataIndex: 'cashier_id',
    width: 55,
    render: value => <Avatar size="large">{value}</Avatar>,
  },
  {
    title: 'Nombre',
    width: 200,
    dataIndex: 'name',
  },
  {
    title: 'Monto inicial',
    width: 120,
    align: 'center',
    dataIndex: 'initial_amount',
    render: (value = 0) => {
      return functions.money(value);
    },
  },
  {
    title: 'Monto final',
    dataIndex: 'final_amount',
    align: 'center',
    width: 120,
    render: (value = 0) => functions.money(value),
  },
  {
    title: 'Cuenta a rendir',
    dataIndex: 'final_amount',
    align: 'center',
    width: 150,
    render: (_, record) => functions.money((record.final_amount || 0) + (record?.initial_amount || 0)),
  },
  {
    title: 'Fecha de apertura',
    dataIndex: 'created_at',
    align: 'center',
    render: (value = '') => functions.tableDate(value),
  },
  {
    title: 'Fecha de cierre',
    dataIndex: 'close_date',
    align: 'center',
    render: (value = '') => functions.tableDate(value),
  },
];

const CurrentCashier = () => {
  const dispatch = useAppDispatch();
  const { cashiers } = useAppSelector(({ sales }) => sales);
  const [dataTable, setDataTable] = useState<Cashier[]>([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });
  const firstRender = useRef(true);

  useEffect(() => {
    setDataTable(cashiers?.data || []);
  }, [cashiers?.data]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      dispatch(cashiersActions.cash_operations.get({ refetch: true }));
      dispatch(cashiersActions.cash_operations.getSalesByCashier({ refetch: true }));
      dispatch(cashiersActions.cash_operations.calculateCashierData());
    }
  }, [cashiers?.data, dispatch]);

  const applyFilters = ({ status, endDate, startDate }: { status?: number; endDate?: string; startDate?: string }) => {
    if (!status && !startDate && !endDate) {
      setDataTable(cashiers?.data || []);
    } else {
      let salesList = (cashiers?.data || [])?.filter(item => {
        let matchDate1 = !!startDate ? functions.dateAfter(item?.created_at as string, startDate) : true;
        let matchDate2 = !!endDate ? functions.dateBefore(item?.created_at as string, endDate) : true;
        return matchDate1 && matchDate2;
      });
      setDataTable(salesList);
    }
  };

  useEffect(() => {
    applyFilters(filters);
  }, [filters]);

  const onRowClick = (record: Cashier) => {
    dispatch(salesActions.cashiers.edit(record));
  };

  const onRefresh = async () => {
    const result = await dispatch(salesActions.cashiers.get({ refetch: true }));
    if (result) message.info('Información actualizada');
  };

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

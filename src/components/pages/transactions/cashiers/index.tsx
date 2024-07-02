import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { Breadcrumb, Col, Row, message, Avatar, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { salesActions } from '@/redux/reducers/sales';
import { Cashier } from '@/redux/reducers/sales/types';
import Table from '@/components/molecules/Table';
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
    title: 'Monto recibido',
    dataIndex: 'received_amount',
    align: 'center',
    width: 120,
    render: (value = 0) => functions.money(value),
  },
  {
    title: 'Monto esperado',
    dataIndex: 'final_amount',
    align: 'center',
    width: 150,
    render: (_, record) => functions.money(record.final_amount || 0),
  },
  {
    title: 'Estatus',
    dataIndex: 'final_amount',
    align: 'center',
    width: 150,
    render: (final_amount, record) => {
      let color = '';
      let text = '';
      if (final_amount === record.received_amount) {
        color = 'green';
        text = 'Cerrada sin diferencias';
      } else if (final_amount > (record?.received_amount || 0)) {
        color = 'red';
        text = `Faltante de ${functions.money(final_amount - (record?.received_amount || 0))}`;
      } else if (final_amount < (record?.received_amount || 0)) {
        color = 'blue';
        text = `Sobrante de ${functions.money((record?.received_amount || 0) - final_amount)}`;
      }
      return <Tag color={color}>{text}</Tag>;
    },
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

const CloseSales = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { cashiers } = useAppSelector(({ sales }) => sales);
  const [dataTable, setDataTable] = useState<Cashier[]>([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });

  useEffect(() => {
    setDataTable(cashiers?.data || []);
  }, [cashiers?.data]);

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
    dispatch(cashiersActions.cashier_detail.set(record));
    navigation(APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIER_DETAIL.hash`${record!.cashier_id as number}`);
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
              { title: 'Cajas' },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <Col span={24}>
          <Table
            onRow={record => {
              return {
                onClick: () => onRowClick(record), // click row
              };
            }}
            size="small"
            columns={columns}
            dataSource={dataTable}
            rowKey={item => `${item.key}`}
            scroll={{ x: 700 }}
            onRefresh={onRefresh}
            totalItems={cashiers?.data?.length}
          />
        </Col>
      </Row>
    </>
  );
};

export default CloseSales;

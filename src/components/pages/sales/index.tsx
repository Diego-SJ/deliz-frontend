import { APP_ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Row, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS } from '@/constants/status';
import { salesActions } from '@/redux/reducers/sales';
import { SaleDetails } from '@/redux/reducers/sales/types';

const PAYMENT_METHOD: { [key: string]: string } = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
};

const columns: ColumnsType<SaleDetails> = [
  { title: 'No. Venta', dataIndex: 'sale_id' },
  {
    title: 'Cliente',
    dataIndex: 'customers',
    render: value => value.name,
  },
  { title: 'Método de pago', dataIndex: 'payment_method', render: (value = 'CASH') => PAYMENT_METHOD[value] },
  {
    title: 'Status',
    dataIndex: 'status',
    render: status => {
      const _status = STATUS.find(item => item.id === status?.status_id);
      return <Tag color={_status?.color ?? 'orange'}>{status?.name ?? 'Desconocido'}</Tag>;
    },
  },
  {
    title: 'Fecha creación',
    dataIndex: 'created_at',
    render: (value: Date | string) => functions.date1(value),
  },
];

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: SaleDetails[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

const Sales = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sales } = useAppSelector(({ sales }) => sales);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(salesActions.fetchSales());
      return;
    }
  }, [dispatch]);

  const onAddNew = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path);
  };

  const onRowClick = (record: SaleDetails) => {
    dispatch(salesActions.setCurrentSale({ metadata: record }));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.SALE_DETAIL.hash`${record.sale_id}`);
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col span={8}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>Dashboard</Link>,
                key: 'dashboard',
              },
              { title: 'Ventas' },
            ]}
          />
        </Col>
        <Col span={4}>
          <Button block type="primary" size="large" icon={<PlusOutlined rev={{}} />} onClick={onAddNew}>
            Nueva
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            onRow={record => {
              return {
                onClick: () => onRowClick(record), // click row
              };
            }}
            columns={columns}
            dataSource={sales}
          />
        </Col>
      </Row>
    </>
  );
};

export default Sales;

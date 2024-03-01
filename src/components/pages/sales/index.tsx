import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Row, Select, Tag, Tooltip, message, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_OBJ } from '@/constants/status';
import { salesActions } from '@/redux/reducers/sales';
import { SaleDetails } from '@/redux/reducers/sales/types';

export const PAYMENT_METHOD: { [key: string]: string } = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
};

const columns: ColumnsType<SaleDetails> = [
  { title: '#', dataIndex: 'sale_id', width: 50, align: 'center' },
  {
    title: 'Cliente',
    dataIndex: 'customers',
    align: 'left',
    render: value => value.name,
  },
  {
    title: 'Monto',
    width: 120,
    align: 'center',
    dataIndex: 'total',
    render: (value = 0, record) => {
      let _total = (record?.amount_paid || 0) - (record?.cashback || 0);
      return functions.money(value || _total);
    },
  },
  {
    title: 'Método de pago',
    width: 130,
    align: 'center',
    dataIndex: 'payment_method',
    render: (value = 'CASH') => PAYMENT_METHOD[value],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 130,
    align: 'center',
    render: status => {
      const _status = STATUS_OBJ[status?.status_id || 1];
      return <Tag color={_status?.color ?? 'orange'}>{status?.name ?? 'Desconocido'}</Tag>;
    },
  },
  {
    title: 'Fecha venta',
    dataIndex: 'created_at',
    align: 'center',
    width: 210,
    render: (value: Date | string) => functions.dateTime(value),
  },
  // {
  //   title: 'Fecha actualización',
  //   dataIndex: 'updated_at',
  //   align: 'center',
  //   width: 210,
  //   render: (value: Date | string) => (value ? functions.dateTime(value) : 'N/A'),
  // },
];

const { Title } = Typography;

const Sales = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sales } = useAppSelector(({ sales }) => sales);
  const [auxSales, setAuxSales] = useState<SaleDetails[]>([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });
  const isFirstRender = useRef(true);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(salesActions.fetchSales());
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setAuxSales(sales);
  }, [sales]);

  useEffect(() => {
    let totalAmounts = auxSales?.reduce((acc, item) => {
      let _total = (item?.amount_paid || 0) - (item?.cashback || 0);
      return (item?.total || _total) + acc;
    }, 0);
    setTotalSaleAmount(totalAmounts);
  }, [auxSales]);

  const applyFilters = ({ status, endDate, startDate }: { status?: number; endDate?: string; startDate?: string }) => {
    if (!status && !startDate && !endDate) {
      setAuxSales(sales);
    } else {
      let salesList = sales?.filter(item => {
        let matchDate1 = !!startDate ? functions.dateAfter(item?.created_at, startDate) : true;
        let matchDate2 = !!endDate ? functions.dateBefore(item?.created_at, endDate) : true;
        let matchStatus = !!status ? item?.status_id === status : true;
        return matchStatus && matchDate1 && matchDate2;
      });
      setAuxSales(salesList);
    }
  };

  useEffect(() => {
    applyFilters(filters);
  }, [filters]);

  const onAddNew = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path);
  };

  const onRowClick = (record: SaleDetails) => {
    dispatch(salesActions.setCurrentSale({ metadata: record }));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.SALE_DETAIL.hash`${Number(record?.sale_id)}`);
  };

  const onRefresh = async () => {
    const result = await dispatch(salesActions.fetchSales({ refetch: true }));
    if (result) message.info('Información actualizada');
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col lg={{ span: 12 }}>
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
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Card bodyStyle={{ padding: '10px' }} style={{ marginBottom: 10 }}>
            <Row gutter={[10, 10]}>
              <Col lg={6} xs={12}>
                <Select
                  size="large"
                  placeholder="Status"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={status => setFilters(p => ({ ...p, status }))}
                >
                  <Select.Option key={4} value={4}>
                    {STATUS_OBJ[4].name}
                  </Select.Option>
                  <Select.Option key={5} value={5}>
                    {STATUS_OBJ[5].name}
                  </Select.Option>
                </Select>
              </Col>
              <Col lg={6} xs={12}>
                <DatePicker
                  size="large"
                  placeholder="Inicio"
                  style={{ width: '100%' }}
                  onChange={(_, startDate) => setFilters(p => ({ ...p, startDate: startDate as string }))}
                />
              </Col>
              <Col lg={6} xs={12}>
                <DatePicker
                  size="large"
                  placeholder="Fin"
                  style={{ width: '100%' }}
                  onChange={(_, endDate) => setFilters(p => ({ ...p, endDate: endDate as string }))}
                />
              </Col>
              <Col lg={{ span: 6, offset: 0 }} xs={{ offset: 0, span: 12 }}>
                <Button size="large" block type="primary" icon={<PlusOutlined rev={{}} />} onClick={onAddNew}>
                  Nueva
                </Button>
              </Col>
            </Row>
          </Card>
          <Table
            onRow={record => {
              return {
                onClick: () => onRowClick(record), // click row
              };
            }}
            size="small"
            columns={columns}
            dataSource={auxSales}
            scroll={{ x: 700 }}
            footer={() => (
              <Row>
                <Col span={6}>
                  <Tooltip title="Recargar">
                    <Button size="large" type="primary" icon={<ReloadOutlined rev={{}} />} onClick={onRefresh}>
                      Recargar
                    </Button>
                  </Tooltip>
                </Col>
                <Col span={6} offset={12}>
                  <Title style={{ textAlign: 'end' }} level={4}>
                    Total ventas: {functions?.money(totalSaleAmount)}
                  </Title>
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default Sales;

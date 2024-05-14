import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { DollarOutlined, LineChartOutlined, PlusOutlined, ReconciliationOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Row, Select, Tag, message, Typography, Avatar, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_DATA, STATUS_OBJ } from '@/constants/status';
import { salesActions } from '@/redux/reducers/sales';
import { SaleDetails } from '@/redux/reducers/sales/types';
import Table from '@/components/molecules/Table';

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
    render: value => value?.name,
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
    render: (value: Date | string) => functions.tableDate(value),
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
  const { sales, cashiers } = useAppSelector(({ sales }) => sales);
  const [auxSales, setAuxSales] = useState<SaleDetails[]>([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });
  const isFirstRender = useRef(true);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const activeCashier = cashiers?.activeCashier;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(salesActions.fetchSales({ refetch: true }));

      if (!activeCashier?.cashier_id) dispatch(salesActions.cashiers.getActiveCashier());
      return;
    }
  }, [dispatch, activeCashier?.cashier_id]);

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

  useEffect(() => {
    let _todaySales = sales
      ?.filter(i => {
        return i?.cashier_id === activeCashier?.cashier_id && i?.status_id === STATUS_DATA.COMPLETED.id;
      })
      ?.reduce((acc, item) => {
        let _total = (item?.amount_paid || 0) - (item?.cashback || 0);
        return (item?.total || _total) + acc;
      }, 0);

    setTodaySales(_todaySales);
  }, [sales, activeCashier]);

  const applyFilters = useCallback(
    ({
      status,
      endDate,
      startDate,
      searchText,
    }: {
      status?: number;
      endDate?: string;
      startDate?: string;
      searchText?: string;
    }) => {
      if (!status && !startDate && !endDate && !searchText) {
        setAuxSales(sales);
      } else {
        let salesList = sales?.filter(item => {
          let matchDate1 = !!startDate ? functions.dateAfter(item?.created_at, startDate) : true;
          let matchDate2 = !!endDate ? functions.dateBefore(item?.created_at, endDate) : true;
          let matchStatus = !!status ? item?.status_id === status : true;
          let texts =
            functions.includes(item?.customers?.name, searchText) ||
            functions.includes(item?.customers?.address, searchText) ||
            functions.includes(item?.customers?.phone, searchText);
          return matchStatus && matchDate1 && matchDate2 && texts;
        });
        setAuxSales(salesList);
      }
    },
    [sales],
  );

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
      <Row style={{ width: '100%', marginTop: 10 }} gutter={[10, 10]}>
        <Col xs={24} md={12} lg={8}>
          <Card style={{ width: '100%' }}>
            <Card.Meta
              avatar={<Avatar icon={<LineChartOutlined rev={{}} />} style={{ background: '#2db7f5' }} size={60} />}
              title={functions?.money(totalSaleAmount)}
              description="Total de ventas"
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Card.Meta
              avatar={<Avatar icon={<ReconciliationOutlined rev={{}} />} style={{ background: '#a52df5' }} size={60} />}
              title={sales?.length || 0}
              description="Ventas totales"
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Card.Meta
              avatar={<Avatar icon={<DollarOutlined rev={{}} />} style={{ background: '#4beb88' }} size={60} />}
              title={functions.money(todaySales)}
              description="Ventas de hoy"
            />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Row gutter={[10, 10]} style={{ marginBottom: 10 }}>
            <Col lg={6} xs={24}>
              <Input
                placeholder="Nombre cliente, dirección"
                style={{ width: '100%' }}
                allowClear
                prefix={<SearchOutlined rev={{}} />}
                onChange={({ target }) => applyFilters({ searchText: target.value })}
              />
            </Col>
            <Col lg={4} xs={12}>
              <Select
                placeholder="Status"
                style={{ width: '100%' }}
                allowClear
                virtual={false}
                onChange={status => setFilters(p => ({ ...p, status }))}
              >
                <Select.Option key={4} value={4}>
                  {STATUS_OBJ[4].name}
                </Select.Option>
                <Select.Option key={5} value={5}>
                  {STATUS_OBJ[5].name}
                </Select.Option>
                <Select.Option key={7} value={7}>
                  {STATUS_OBJ[7].name}
                </Select.Option>
              </Select>
            </Col>
            <Col lg={4} xs={12}>
              <DatePicker
                placeholder="Inicio"
                style={{ width: '100%' }}
                onChange={(_, startDate) => setFilters(p => ({ ...p, startDate: startDate as string }))}
              />
            </Col>
            <Col lg={4} xs={12}>
              <DatePicker
                placeholder="Fin"
                style={{ width: '100%' }}
                onChange={(_, endDate) => setFilters(p => ({ ...p, endDate: endDate as string }))}
              />
            </Col>
            <Col lg={6} xs={24}>
              <Button block type="primary" icon={<PlusOutlined rev={{}} />} onClick={onAddNew}>
                Nueva
              </Button>
            </Col>
          </Row>
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
            onRefresh={onRefresh}
            totalItems={sales?.length || 0}
          />
        </Col>
      </Row>
    </>
  );
};

export default Sales;

import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { DollarOutlined, LineChartOutlined, PlusOutlined, ReconciliationOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Tag,
  Tooltip,
  message,
  Typography,
  Avatar,
  Calendar,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_DATA, STATUS_OBJ } from '@/constants/status';
import { salesActions } from '@/redux/reducers/sales';
import { SaleDetails } from '@/redux/reducers/sales/types';
import Table from '@/components/molecules/Table';
import dayjs, { Dayjs } from 'dayjs';

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

const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sales, cashiers } = useAppSelector(({ sales }) => sales);
  const [auxSales, setAuxSales] = useState<SaleDetails[]>([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const isFirstRender = useRef(true);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const activeCashier = cashiers?.activeCashier;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(salesActions.fetchSales());

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
              { title: 'Pedidos' },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 10]} style={{ marginTop: '10px' }}>
        <Col xs={24} lg={12}>
          <Card>
            <Button size="large" type="primary" block style={{ marginBottom: 20 }}>
              Nuevo pedido
            </Button>
            <Typography.Title level={4}>Pedidos del {functions.date1(selectedDate as any)}</Typography.Title>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Calendar
            style={{ width: '100%' }}
            value={selectedDate}
            onSelect={setSelectedDate}
            // onPanelChange={onPanelChange}
            // onSelect={onSelect}
          />
        </Col>
      </Row>
    </>
  );
};

export default Orders;

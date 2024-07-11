import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { Breadcrumb, Card, Col, Row, Typography, Calendar, Avatar, List, CalendarProps, Badge, Tag } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_DATA } from '@/constants/status';
import { salesActions } from '@/redux/reducers/sales';
import { SaleDetails, SaleMetadata } from '@/redux/reducers/sales/types';
import dayjs, { Dayjs } from 'dayjs';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { theme } from '@/styles/theme/config';

export const PAYMENT_METHOD: { [key: string]: string } = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
};

const dateCellRender = (value: Dayjs, orders: SaleMetadata[]) => {
  const pendings =
    orders?.filter(i => i?.status_id === STATUS_DATA.ORDER.id && functions.datesAreEquals(i?.order_due_date, value))?.length || 0;
  const paymentPending =
    orders?.filter(i => i?.status_id === STATUS_DATA.PENDING.id && functions.datesAreEquals(i?.created_at, value))?.length || 0;
  return (
    <div className="bg-pink-400">
      {pendings > 0 && (
        <small>
          <Badge color="geekblue" /> <strong>{pendings}</strong> {pendings > 1 ? 'pedidos' : 'pedido'}
        </small>
      )}
      {paymentPending > 0 && (
        <small>
          <Badge color="gold" /> <strong>{paymentPending}</strong> {paymentPending > 1 ? 'pendientes' : 'pendiente'}
        </small>
      )}
    </div>
  );
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sales, cashiers } = useAppSelector(({ sales }) => sales);
  const [orders, setOrders] = useState<SaleMetadata[]>([]);
  const [ordersByDate, setOrdersByDate] = useState<SaleMetadata[]>([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const isFirstRender = useRef(true);
  const activeCashier = cashiers?.activeCashier;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(salesActions.fetchSales());
      return;
    }
  }, [dispatch, activeCashier?.cashier_id]);

  useEffect(() => {
    let _orders: SaleMetadata[] = [];

    sales?.forEach(i => {
      if ([STATUS_DATA.ORDER.id, STATUS_DATA.PENDING.id].includes(i?.status_id as number)) {
        _orders.push(i);
      }
    });
    setOrders(_orders);
  }, [sales]);

  useEffect(() => {
    if (orders?.length) {
      let _orders: SaleMetadata[] = orders?.filter(i => {
        return (
          functions.datesAreEquals(i?.order_due_date, selectedDate) ||
          (functions.datesAreEquals(i?.created_at, selectedDate) && i?.status_id !== STATUS_DATA.ORDER.id)
        );
      });

      setOrdersByDate(_orders);
    }
  }, [orders, selectedDate]);

  const applyFilters = ({ status, endDate, startDate }: { status?: number; endDate?: string; startDate?: string }) => {
    // if (!status && !startDate && !endDate) {
    //   setAuxSales(sales);
    // } else {
    //   let salesList = sales?.filter(item => {
    //     let matchDate1 = !!startDate ? functions.dateAfter(item?.created_at, startDate) : true;
    //     let matchDate2 = !!endDate ? functions.dateBefore(item?.created_at, endDate) : true;
    //     let matchStatus = !!status ? item?.status_id === status : true;
    //     return matchStatus && matchDate1 && matchDate2;
    //   });
    //   setAuxSales(salesList);
    // }
  };

  useEffect(() => {
    applyFilters(filters);
  }, [filters]);

  const onAddNew = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path + '?mode=order');
  };

  const onRowClick = (record: SaleDetails) => {
    dispatch(salesActions.setCurrentSale({ metadata: record }));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.SALE_DETAIL.hash`${Number(record?.sale_id)}`);
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = useCallback(
    (current: any, info: any) => {
      if (info.type === 'date') return dateCellRender(current, orders);
      if (info.type === 'month') return null;
      return info.originNode;
    },
    [orders],
  );

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
        <Col xs={24} lg={10}>
          <Card hoverable onClick={onAddNew} style={{ marginBottom: 10 }}>
            <Card.Meta
              avatar={<Avatar icon={<ShoppingCartOutlined />} style={{ background: theme.colors.skyblue }} size={60} />}
              title="Nuevo pedido"
              description="Accede al punto de venta para crear un pedido"
            />
          </Card>
          <Typography.Title level={4}>
            Pedidos del {functions.date1(selectedDate as any)} ({ordersByDate?.length || 0})
          </Typography.Title>
          <Card>
            <List
              itemLayout="horizontal"
              style={{ maxHeight: 430, overflowY: 'auto' }}
              dataSource={ordersByDate}
              renderItem={(item, index) => (
                <List.Item key={item?.sale_id} onClick={() => onRowClick(item as SaleDetails)} style={{ cursor: 'pointer' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ background: 'grey' }} src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />
                    }
                    title={
                      <span>
                        {item.customers?.name || '- - -'}{' '}
                        <Tag color={item?.status_id === 7 ? 'blue-inverse' : 'gold-inverse'}>{item?.status?.name}</Tag>
                      </span>
                    }
                    description={
                      <div className="flex">
                        <div>
                          {item?.order_due_date && (
                            <p>
                              <strong>Fecha de entrega:</strong> {functions.date1(item?.order_due_date as string)}
                            </p>
                          )}
                          <p>
                            <strong>Fecha de creación:</strong> {functions.date1(item?.created_at as string)}
                          </p>
                          <p>
                            <strong>Monto:</strong> {functions.money(item.total)}
                          </p>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={14} style={{ maxHeight: 625, overflowY: 'auto' }}>
          <Calendar style={{ width: '100%' }} value={selectedDate} onSelect={setSelectedDate} cellRender={cellRender} />
        </Col>
      </Row>
    </>
  );
};

export default Orders;

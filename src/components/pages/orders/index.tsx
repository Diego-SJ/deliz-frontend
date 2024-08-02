import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { Breadcrumb, Card, Col, Row, Typography, Calendar, Avatar, List, CalendarProps, Badge, Tag, Tooltip } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_DATA } from '@/constants/status';
import { salesActions } from '@/redux/reducers/sales';
import { SaleDetails, SaleMetadata } from '@/redux/reducers/sales/types';
import dayjs, { Dayjs } from 'dayjs';
import { ClockCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { theme } from '@/styles/theme/config';
import CardRoot from '@/components/atoms/Card';
import { orderActions } from '@/redux/reducers/orders';
import { Order } from '@/redux/reducers/orders/types';

export const PAYMENT_METHOD: { [key: string]: string } = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
};

const dateCellRender = (date1: Dayjs, orders: Order[]) => {
  let pendingOrders = 0;
  let paymentPending = 0;

  for (let i = 0; i < orders.length; i++) {
    let currentOrder = orders[i];
    if (
      currentOrder?.status?.status_id === STATUS_DATA.ORDER.id &&
      date1.isSame(new Date(currentOrder?.order_due_date!), 'day')
    ) {
      pendingOrders++;
    }
    if (currentOrder?.status?.status_id === STATUS_DATA.PENDING.id && date1.isSame(new Date(currentOrder?.created_at!), 'day')) {
      paymentPending++;
    }
  }

  return (
    <div className="felx flex-col">
      {pendingOrders > 0 && (
        <Tooltip title={`${pendingOrders} pedido${pendingOrders > 0 ? 's' : ''} pendiente${pendingOrders > 0 ? 's' : ''}`}>
          <Tag className="w-full mb-2" color="blue" children={pendingOrders} icon={<ShoppingCartOutlined />} />
        </Tooltip>
      )}
      {paymentPending > 0 && (
        <Tooltip title={`${paymentPending} venta${paymentPending > 0 ? 's' : ''} sin completar`}>
          <Tag className="w-full" color="gold" children={paymentPending} icon={<ClockCircleOutlined />} />
        </Tooltip>
      )}
    </div>
  );
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders } = useAppSelector(({ orders }) => orders);
  const [ordersByDate, setOrdersByDate] = useState<SaleMetadata[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(orderActions.fetchOrdersAndPendings());
      return;
    }
  }, [dispatch]);

  const onChangeDate = (date: Dayjs) => {
    if (date.month() !== currentMonth) {
      setCurrentMonth(date.month());
      dispatch(orderActions.fetchOrdersAndPendings(date));
    }
  };

  const onAddNew = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path + '?mode=order');
  };

  const onRowClick = (record: SaleDetails) => {
    dispatch(salesActions.setCurrentSale({ metadata: record }));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.SALE_DETAIL.hash`${Number(record?.sale_id)}`);
  };

  const cellRender = useCallback<NonNullable<CalendarProps<Dayjs>['cellRender']>>(
    (currentDate, info) => {
      if (info.type === 'date') return dateCellRender(currentDate, orders);
      return info.originNode;
    },
    [orders],
  );

  return (
    <div className="max-w-[1200px] mx-auto">
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
      <Row gutter={[20, 20]} style={{ marginTop: '10px' }}>
        <Col xs={24} lg={10}>
          <CardRoot onClick={onAddNew} className="mb-6 border hover:border-primary cursor-pointer">
            <Card.Meta
              avatar={
                <Avatar
                  icon={<ShoppingCartOutlined className="text-blue-600" />}
                  className="bg-blue-600/10 shadow-md shadow-primary/40"
                  size={60}
                />
              }
              title="Nuevo pedido"
              description="Accede al punto de venta para crear un pedido"
            />
          </CardRoot>
          <Typography.Title level={4}>
            Pedidos del {functions.date1(selectedDate as any)} ({ordersByDate?.length || 0})
          </Typography.Title>
          <CardRoot>
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
          </CardRoot>
        </Col>
        <Col xs={24} lg={14}>
          <CardRoot className="" styles={{ body: { padding: 10 } }}>
            <Calendar
              className="w-full h-full !max-h-[400px]"
              value={selectedDate}
              onSelect={setSelectedDate}
              cellRender={cellRender}
              onChange={date => {
                onChangeDate(date);
              }}
            />
          </CardRoot>
        </Col>
      </Row>
    </div>
  );
};

export default Orders;

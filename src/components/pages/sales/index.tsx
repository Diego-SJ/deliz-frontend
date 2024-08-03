import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, DatePicker, Row, Select, Tag, message, Input, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_OBJ } from '@/constants/status';
import { salesActions } from '@/redux/reducers/sales';
import { SaleDetails } from '@/redux/reducers/sales/types';
import Table from '@/components/molecules/Table';
import CardRoot from '@/components/atoms/Card';
import useMediaQuery from '@/hooks/useMediaQueries';
import PaginatedList from '@/components/organisms/PaginatedList';

export const PAYMENT_METHOD: { [key: string]: string } = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  CC: 'Tarjeta crédito',
  DC: 'Tarjeta débito',
  TRANSFER: 'Transferencia',
};

const columns: ColumnsType<SaleDetails> = [
  { title: 'Folio', dataIndex: 'sale_id', width: 80, align: 'center' },
  {
    title: 'Cliente',
    dataIndex: 'customers',
    align: 'left',
    width: 300,
    render: value => value?.name || 'Público general',
  },
  {
    title: 'Total',
    width: 120,
    align: 'center',
    dataIndex: 'total',
    render: (value = 0) => {
      return functions.money(value || 0);
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
    render: (status, record) => {
      const _status = STATUS_OBJ[status?.status_id || 1];
      return <Tag color={_status?.color ?? 'orange'}>{record?.status?.name}</Tag>;
    },
  },
  {
    title: 'Fecha venta',
    dataIndex: 'created_at',
    align: 'center',
    width: 210,
    render: (value: Date | string) => functions.tableDate(value),
  },
];

const Sales = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sales, cashiers } = useAppSelector(({ sales }) => sales);
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
  const [auxSales, setAuxSales] = useState<SaleDetails[]>([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });
  const isFirstRender = useRef(true);
  const { isTablet } = useMediaQuery();
  const activeCashier = cashiers?.activeCashier;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(salesActions.fetchSales({ refetch: true }));
      return;
    }
  }, [dispatch, activeCashier?.cashier_id]);

  useEffect(() => {
    setAuxSales(sales);
  }, [sales]);

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
    <div className="max-w-[1200px] mx-auto">
      <Row justify="space-between" align="middle" className="mb-3">
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
      <Row>
        <Col span={24}>
          <Row gutter={[10, 10]} className="!mb-0">
            <Col lg={6} xs={24}>
              <Input
                placeholder="Nombre cliente, dirección"
                style={{ width: '100%' }}
                allowClear
                size={isTablet ? 'large' : 'middle'}
                prefix={<SearchOutlined />}
                onChange={({ target }) => applyFilters({ searchText: target.value })}
              />
            </Col>
            <Col lg={4} xs={12}>
              <Select
                placeholder="Status"
                style={{ width: '100%' }}
                allowClear
                virtual={false}
                size={isTablet ? 'large' : 'middle'}
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
            <Col lg={4} xs={12}>
              <DatePicker
                placeholder="Desde"
                style={{ width: '100%' }}
                size={isTablet ? 'large' : 'middle'}
                readOnly
                onChange={(_, startDate) => setFilters(p => ({ ...p, startDate: startDate as string }))}
              />
            </Col>
            <Col lg={4} xs={12}>
              <DatePicker
                placeholder="Hasta"
                style={{ width: '100%' }}
                size={isTablet ? 'large' : 'middle'}
                onChange={(_, endDate) => setFilters(p => ({ ...p, endDate: endDate as string }))}
              />
            </Col>
            {permissions?.sales?.add_sale && (
              <Col lg={{ offset: 1, span: 5 }} xs={12}>
                <Button
                  block
                  type="primary"
                  size={isTablet ? 'large' : 'middle'}
                  icon={<PlusCircleOutlined />}
                  onClick={onAddNew}
                >
                  Nueva
                </Button>
              </Col>
            )}
          </Row>

          {!isTablet ? (
            <CardRoot styles={{ body: { padding: 0, overflow: 'hidden' } }} className={`!mt-6`}>
              <Table
                onRow={record => {
                  return {
                    onClick: () => onRowClick(record), // click row
                  };
                }}
                rowKey={record => record.sale_id}
                columns={columns}
                dataSource={auxSales}
                scroll={{ x: 700, y: 'calc(100dvh - 350px)' }}
                onRefresh={onRefresh}
                totalItems={sales?.length || 0}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              className="mt-4 !max-h-[calc(100dvh-284px)]"
              $bodyHeight="calc(100dvh - 340px)"
              pagination={{ position: 'bottom', align: 'center' }}
              dataSource={auxSales}
              rootClassName="sadasd"
              renderItem={item => {
                const _status = STATUS_OBJ[item?.status_id || 1];
                return (
                  <div
                    key={item.sale_id}
                    onClick={() => onRowClick(item)}
                    className="flex justify-between py-3 px-4 items-center border-b border-gray-200 cursor-pointer"
                  >
                    <div className="flex flex-col w-1/3">
                      <Typography.Text strong className="!mb-2">
                        {item?.customers?.name || 'Público general'}
                      </Typography.Text>
                      <Typography.Text type="secondary">{functions.tableDate(item.created_at)}</Typography.Text>
                    </div>
                    <Typography.Text>{functions.money(item.total)}</Typography.Text>
                    <div className="flex flex-col w-1/3 text-end justify-end">
                      <Typography.Text className="!mb-2" type="secondary">
                        {PAYMENT_METHOD[item.payment_method || '']}
                      </Typography.Text>
                      <Tag className="ml-auto w-fit mx-0" color={_status?.color ?? 'orange'}>
                        {item?.status?.name}
                      </Tag>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Sales;

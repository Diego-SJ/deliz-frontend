import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import {
  FileTextOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_DATA, STATUS_OBJ } from '@/constants/status';
import { salesActions } from '@/redux/reducers/sales';
import { SaleRPC } from '@/redux/reducers/sales/types';
import CardRoot from '@/components/atoms/Card';
import useMediaQuery from '@/hooks/useMediaQueries';
import PaginatedList from '@/components/organisms/PaginatedList';
import { useDebouncedCallback } from 'use-debounce';
import { ModuleAccess } from '@/routes/module-access';
import BottomMenu from '@/components/organisms/bottom-menu';

export const PAYMENT_METHOD: { [key: string]: string } = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  CC: 'Tarjeta crédito',
  DC: 'Tarjeta débito',
  TRANSFER: 'Transferencia',
};

const columns: ColumnsType<SaleRPC> = [
  { title: 'Folio', dataIndex: 'sale_id', width: 80, align: 'center' },
  {
    title: 'Cliente',
    dataIndex: 'customers',
    align: 'left',
    width: 180,
    render: (_, record) => record?.customer_name || 'Público general',
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
    width: 150,
    align: 'center',
    dataIndex: 'payment_method',
    render: (value = 'CASH') => PAYMENT_METHOD[value],
  },
  {
    title: 'Sucursal',
    dataIndex: 'branch_name',
    align: 'center',
    width: 120,
    render: (value) => <Tag>{value || 'N/A'}</Tag>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 130,
    align: 'center',
    render: (_, record) => {
      const _status = STATUS_OBJ[record?.status_id || 1];
      return (
        <Tag color={_status?.color ?? 'orange'}>{record?.status_name}</Tag>
      );
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
  const {
    sales,
    cashiers,
    filters: salesFilters,
    loading,
  } = useAppSelector(({ sales }) => sales);
  const { permissions } = useAppSelector(
    ({ users }) => users?.user_auth?.profile!,
  );
  const { branches } = useAppSelector(({ branches }) => branches);
  const [auxSales, setAuxSales] = useState<SaleRPC[]>([]);
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

  const fetchSalesByTerm = useDebouncedCallback(() => {
    dispatch(salesActions.fetchSales({ refetch: true }));
  }, 650);

  const onAddNew = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path);
  };

  const onRowClick = (record: SaleRPC) => {
    navigate(APP_ROUTES.PRIVATE.SALE_DETAIL.hash`${Number(record?.sale_id)}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <Row justify="space-between" align="middle" className="mb-3">
        <Col lg={{ span: 12 }}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>Dashboard</Link>,
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
                value={salesFilters?.sales?.search || ''}
                onChange={({ target }) => {
                  dispatch(
                    salesActions.setSaleFilters({
                      search: target.value,
                      page: 0,
                    }),
                  );
                  fetchSalesByTerm();
                }}
              />
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  selectedKeys: [
                    salesFilters?.sales?.orderBy || 'created_at,desc',
                  ],
                  items: [
                    {
                      label: 'Creado (recientes primero)',
                      key: 'created_at,desc',
                    },
                    {
                      label: 'Creado (antiguos primero)',
                      key: 'created_at,asc',
                    },
                    { label: 'Estado (A-Z)', key: 'status_id,asc' },
                    { label: 'Estado (Z-A)', key: 'status_id,desc' },
                  ],
                  selectable: true,
                  onClick: async ({ key }) => {
                    dispatch(salesActions.setSaleFilters({ orderBy: key }));
                    dispatch(salesActions.fetchSales({ refetch: true }));
                  },
                }}
              >
                <Button
                  type={
                    !salesFilters?.sales?.orderBy ||
                    salesFilters?.sales?.orderBy === 'created_at,desc'
                      ? 'default'
                      : 'primary'
                  }
                  block
                  className={`${
                    !!salesFilters?.sales?.orderBy &&
                    salesFilters?.sales?.orderBy !== 'created_at,desc'
                      ? '!bg-white'
                      : ''
                  }`}
                  ghost={
                    !!salesFilters?.sales?.orderBy &&
                    salesFilters?.sales?.orderBy !== 'created_at,desc'
                  }
                  size={isTablet ? 'large' : 'middle'}
                  icon={<FilterOutlined className="text-base" />}
                >
                  Ordenar
                </Button>
              </Dropdown>
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  selectedKeys: [
                    !!salesFilters?.sales?.status_id &&
                    salesFilters?.sales?.status_id !== 0
                      ? salesFilters?.sales?.status_id?.toString() || ''
                      : '0',
                  ],
                  items: [
                    { label: 'Mostrar todos', key: '0' },
                    {
                      label: STATUS_DATA.PAID.name,
                      key: STATUS_DATA.PAID.id.toString(),
                    },
                    {
                      label: STATUS_DATA.PENDING.name,
                      key: STATUS_DATA.PENDING.id.toString(),
                    },
                  ],
                  selectable: true,
                  onClick: ({ key }) => {
                    dispatch(
                      salesActions.setSaleFilters({ status_id: Number(key) }),
                    );
                    dispatch(salesActions.fetchSales({ refetch: true }));
                  },
                }}
              >
                <Button
                  type={
                    !!salesFilters?.sales?.status_id &&
                    salesFilters?.sales?.status_id !== 0
                      ? 'primary'
                      : 'default'
                  }
                  block
                  className={`${!!salesFilters?.sales?.status_id && salesFilters?.sales?.status_id !== 0 ? '!bg-white' : ''}`}
                  ghost={
                    !!salesFilters?.sales?.status_id &&
                    salesFilters?.sales?.status_id !== 0
                  }
                  size={isTablet ? 'large' : 'middle'}
                  icon={<FileTextOutlined className="text-base" />}
                >
                  Estado
                </Button>
              </Dropdown>
            </Col>
            <Col lg={4} xs={12}>
              <ModuleAccess moduleName="branches">
                <Dropdown
                  menu={{
                    defaultSelectedKeys: [
                      salesFilters?.sales?.branch_id || 'ALL',
                    ],
                    items: [
                      { label: 'Todas las sucursales', key: 'ALL' },
                      ...(branches?.map((branch) => ({
                        label: branch.name,
                        key: branch.branch_id,
                      })) || []),
                    ],
                    selectable: true,
                    onClick: ({ key }) => {
                      dispatch(salesActions.setSaleFilters({ branch_id: key }));
                      dispatch(salesActions.fetchSales({ refetch: true }));
                    },
                  }}
                >
                  <Button
                    type={
                      !!salesFilters?.sales?.branch_id &&
                      salesFilters?.sales?.branch_id !== 'ALL'
                        ? 'primary'
                        : 'default'
                    }
                    block
                    className={`${
                      !!salesFilters?.sales?.branch_id &&
                      salesFilters?.sales?.branch_id !== 'ALL'
                        ? '!bg-white'
                        : ''
                    }`}
                    ghost={
                      !!salesFilters?.sales?.branch_id &&
                      salesFilters?.sales?.branch_id !== 'ALL'
                    }
                    size={isTablet ? 'large' : 'middle'}
                    icon={<ShopOutlined className="text-base" />}
                  >
                    {!salesFilters?.sales?.branch_id ||
                    salesFilters?.sales?.branch_id === 'ALL'
                      ? 'Sucursal'
                      : branches?.find(
                          (branch) =>
                            branch.branch_id === salesFilters?.sales?.branch_id,
                        )?.name}
                  </Button>
                </Dropdown>
              </ModuleAccess>
            </Col>
            {permissions?.pos?.add_sale?.value && (
              <Col lg={{ offset: 2, span: 4 }} xs={12}>
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
            <CardRoot styles={{ body: { padding: 0 } }} className={`!mt-6`}>
              <Table
                loading={loading}
                onRow={(record) => {
                  return {
                    onClick: () => onRowClick(record), // click row
                  };
                }}
                rowKey={(record) => `${record.sale_id}`}
                columns={columns}
                dataSource={auxSales}
                pagination={{
                  defaultCurrent: 0,
                  showTotal: (total, range) =>
                    `mostrando del ${range[0]} al ${range[1]} de ${total} elementos`,
                  showSizeChanger: true,
                  size: 'small',
                  onChange: (page, pageSize) => {
                    dispatch(
                      salesActions.setSaleFilters({ page: page - 1, pageSize }),
                    );
                    dispatch(salesActions.fetchSales({ refetch: true }));
                  },
                  pageSize: salesFilters?.sales?.pageSize,
                  position: ['bottomRight'],
                  total: salesFilters?.sales?.totalRecords,
                  current: (salesFilters?.sales?.page || 0) + 1,
                  className: '!mt-0 border-t pt-2 !mb-2 text-gray-400 pr-4',
                  pageSizeOptions: ['20', '50', '100'],
                }}
                scroll={{ x: 700, y: 'calc(100dvh - 300px)' }}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              className="mt-4 !max-h-[calc(100dvh-284px-80px)]" // screen - navbar - bottom menu
              $bodyHeight="calc(100dvh - 340px - 75px)"
              loading={loading}
              pagination={{
                defaultCurrent: 1,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} de ${total}`,
                showSizeChanger: true,
                size: 'small',
                onChange: (page, pageSize) => {
                  dispatch(
                    salesActions.setSaleFilters({ page: page - 1, pageSize }),
                  );
                  dispatch(salesActions.fetchSales({ refetch: true }));
                },
                pageSize: salesFilters?.sales?.pageSize,
                position: 'bottom',
                align: 'center',
                total: salesFilters?.sales?.totalRecords,
                current: (salesFilters?.sales?.page || 0) + 1,
                className: '!mt-0 border-t pt-2 !mb-1 text-gray-400 pr-4',
                pageSizeOptions: ['20', '50', '100'],
              }}
              dataSource={auxSales}
              rootClassName="sadasd"
              renderItem={(item) => {
                const _status = STATUS_OBJ[item?.status_id || 1];
                return (
                  <div
                    key={item.sale_id}
                    onClick={() => onRowClick(item)}
                    className="flex justify-between py-3 px-4 items-center border-b border-gray-200 cursor-pointer"
                  >
                    <div className="flex flex-col w-3/6">
                      <p className="m-0 mb-1 font-medium leading-[1.1]">
                        {item?.customer_name || 'Público general'}
                      </p>
                      <span className="text-xs text-gray-400/70">
                        {functions.tableDate(item.created_at)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pl-4 w-3/6">
                      <Tag
                        className="w-fit mx-0"
                        color={_status?.color ?? 'orange'}
                      >
                        {item?.status_name}
                      </Tag>
                      <div className="flex flex-col text-end justify-end">
                        <span className="text-xs text-gray-500 font-medium">
                          {functions.money(item.total)}
                        </span>
                        <span className="text-xs text-gray-400/70 mb-1">
                          {PAYMENT_METHOD[item.payment_method || '']}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </Col>
      </Row>
      {isTablet && <BottomMenu />}
    </div>
  );
};

export default Sales;

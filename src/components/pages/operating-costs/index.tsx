import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { FileTextOutlined, PlusCircleOutlined, SearchOutlined, ShopOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Row, Tag, Table, message, Input, Typography, Dropdown } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_OBJ } from '@/constants/status';
import CardRoot from '@/components/atoms/Card';
import useMediaQuery from '@/hooks/useMediaQueries';
import PaginatedList from '@/components/organisms/PaginatedList';
import { operatingCostsActions } from '@/redux/reducers/operating-costs';
import { OperatingCost } from '@/redux/reducers/operating-costs/types';
import { useDebouncedCallback } from 'use-debounce';

const columns: ColumnsType<OperatingCost> = [
  {
    title: 'Motivo',
    dataIndex: 'reason',
    align: 'left',
    width: 300,
    render: value => value || 'Sin motivo',
  },
  {
    title: 'Monto',
    width: 120,
    align: 'center',
    dataIndex: 'amount',
    render: (value = 0) => {
      return functions.money(value || 0);
    },
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    width: 130,
    align: 'center',
    render: (status, record) => {
      const _status = STATUS_OBJ[status?.status_id || 1];
      return <Tag color={_status?.color ?? 'orange'}>{(record as any)?.status?.name}</Tag>;
    },
  },
  {
    title: 'Fecha del gasto',
    dataIndex: 'operation_date',
    align: 'center',
    width: 210,
    render: (value: Date | string) => functions.date(value),
  },
  {
    title: 'Sucursal',
    dataIndex: 'branches',
    align: 'center',
    width: 120,
    render: (_, record) => <Tag>{record?.branches?.name}</Tag>,
  },
  {
    title: 'Fecha de creación',
    dataIndex: 'created_at',
    align: 'center',
    width: 230,
    render: (value: Date | string) => functions.tableDate(value),
  },
];

const PurchasesExpenses = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { branches } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
  const { operatingCosts, filters, loading } = useAppSelector(({ operatingCosts }) => operatingCosts);
  const [operations, setOperations] = useState<OperatingCost[]>([]);
  const isFirstRender = useRef(true);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(operatingCostsActions.fetchOperations());
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setOperations(operatingCosts);
  }, [operatingCosts]);

  const applyFilters = () => {
    dispatch(operatingCostsActions.fetchOperations());
  };

  const onSearch = useDebouncedCallback(() => {
    dispatch(operatingCostsActions.fetchOperations());
  }, 650);

  const onRowClick = (record: OperatingCost) => {
    navigate(APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.EDIT.hash`${record.operation_type?.toLowerCase()}${record.operating_cost_id}`);
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
              { title: 'Gastos' },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Row gutter={[10, 10]} className="!mb-0">
            <Col lg={8} xs={24}>
              <Input
                placeholder="Busca por motivo o notas"
                style={{ width: '100%' }}
                allowClear
                size={isTablet ? 'large' : 'middle'}
                prefix={<SearchOutlined />}
                value={filters?.search_text}
                onChange={({ target }) => {
                  dispatch(operatingCostsActions.setFilters({ search_text: target.value, page: 0 }));
                  onSearch();
                }}
              />
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  defaultSelectedKeys: [filters?.status_id !== 0 ? filters?.status_id?.toString() || '' : '0'],
                  items: [
                    { label: 'Mostrar todos', key: '0' },
                    { label: STATUS_OBJ[4].name, key: '4' },
                    { label: STATUS_OBJ[5].name, key: '5' },
                  ],
                  selectable: true,
                  onClick: ({ key }) => {
                    dispatch(operatingCostsActions.setFilters({ status_id: Number(key) }));
                    applyFilters();
                  },
                }}
              >
                <Button
                  type={filters?.status_id !== 0 ? 'primary' : 'default'}
                  block
                  className={`${filters?.status_id !== 0 ? '!bg-white' : ''}`}
                  ghost={filters?.status_id !== 0}
                  size={isTablet ? 'large' : 'middle'}
                  icon={<FileTextOutlined className="text-base" />}
                >
                  {filters?.status_id === 0 ? 'Estado' : STATUS_OBJ[filters?.status_id || 0]?.name}
                </Button>
              </Dropdown>
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  defaultSelectedKeys: [filters?.branch_id || 'ALL'],
                  items: [
                    { label: 'Todas las sucursales', key: 'ALL' },
                    ...(branches?.map(branch => ({ label: branch.name, key: branch.branch_id })) || []),
                  ],
                  selectable: true,
                  onClick: ({ key }) => {
                    dispatch(operatingCostsActions.setFilters({ branch_id: key }));
                    applyFilters();
                  },
                }}
              >
                <Button
                  type={!!filters?.branch_id && filters?.branch_id !== 'ALL' ? 'primary' : 'default'}
                  block
                  className={`${!!filters?.branch_id && filters?.branch_id !== 'ALL' ? '!bg-white' : ''}`}
                  ghost={!!filters?.branch_id && filters?.branch_id !== 'ALL'}
                  size={isTablet ? 'large' : 'middle'}
                  icon={<ShopOutlined className="text-base" />}
                >
                  {!filters?.branch_id || filters?.branch_id === 'ALL'
                    ? 'Sucursal'
                    : branches?.find(branch => branch.branch_id === filters?.branch_id)?.name}
                </Button>
              </Dropdown>
            </Col>
            <Col lg={4} xs={12}>
              {permissions?.expenses?.add_expense?.value && (
                <Button
                  block
                  type="primary"
                  size={isTablet ? 'large' : 'middle'}
                  icon={<PlusCircleOutlined />}
                  onClick={() => navigate(APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.ADD_NEW.hash`${'expense'}`)}
                >
                  Agregar
                </Button>
              )}
            </Col>
          </Row>

          {!isTablet ? (
            <CardRoot styles={{ body: { padding: 0, overflow: 'hidden' } }} className={`!mt-6`}>
              <Table
                onRow={record => {
                  return {
                    onClick: () => onRowClick(record), // click row
                  };
                }}
                loading={loading}
                rowKey={record => record.operating_cost_id}
                columns={columns}
                dataSource={operations}
                scroll={{ x: 700, y: 'calc(100dvh - 300px)' }}
                pagination={{
                  defaultCurrent: 0,
                  showTotal: (total, range) => `mostrando del ${range[0]} al ${range[1]} de ${total} elementos`,
                  showSizeChanger: true,
                  size: 'small',
                  onChange: (page, pageSize) => {
                    dispatch(operatingCostsActions.setFilters({ page: page - 1, pageSize }));
                    dispatch(operatingCostsActions.fetchOperations());
                  },
                  pageSize: filters?.pageSize,
                  position: ['bottomRight'],
                  total: filters?.totalRecords,
                  current: (filters?.page || 0) + 1,
                  className: '!mt-0 border-t pt-2 !mb-2 text-gray-400 pr-4',
                  pageSizeOptions: ['20', '50', '100'],
                }}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              className="mt-4 !max-h-[calc(100dvh-284px)]"
              $bodyHeight="calc(100dvh - 340px)"
              dataSource={operations}
              loading={loading}
              pagination={{
                defaultCurrent: 1,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total}`,
                showSizeChanger: true,
                size: 'small',
                onChange: (page, pageSize) => {
                  dispatch(operatingCostsActions.setFilters({ page: page - 1, pageSize }));
                  dispatch(operatingCostsActions.fetchOperations());
                },
                pageSize: filters?.pageSize,
                position: 'bottom',
                align: 'center',
                total: filters?.totalRecords,
                current: (filters?.page || 0) + 1,
                className: '!mt-0 border-t pt-2 !mb-1 text-gray-400 pr-4',
                pageSizeOptions: ['20', '50', '100'],
              }}
              renderItem={item => {
                const _status = STATUS_OBJ[item?.status_id || 1];
                return (
                  <div
                    key={item.operating_cost_id}
                    onClick={() => onRowClick(item)}
                    className="flex justify-between py-3 px-4 items-center border-b border-gray-200 cursor-pointer"
                  >
                    <div className="flex flex-col w-3/5">
                      <Typography.Text strong className="!mb-1">
                        {item?.reason || 'Público general'}
                      </Typography.Text>
                      <Typography.Text className="text-gray-400 text-small font-light mb-1">
                        {functions.tableDate(item.created_at)}
                      </Typography.Text>
                      <Tag className="w-fit text-small font-light">Sucursal {item?.branches?.name || 'Desconocida'}</Tag>
                    </div>

                    <div className="flex flex-col w-2/5 text-end justify-between h-full ">
                      <Typography.Text className="!mb-4 font-medium">{functions.money(item.amount)}</Typography.Text>
                      <Tag className="ml-auto w-fit mx-0" color={_status?.color ?? 'orange'}>
                        {(item as any)?.status?.name}
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

export default PurchasesExpenses;

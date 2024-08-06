import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { FileTextOutlined, PlusCircleOutlined, SearchOutlined, ShopOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Row, Tag, message, Input, Typography, Dropdown } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_OBJ } from '@/constants/status';
import { SaleDetails } from '@/redux/reducers/sales/types';
import Table from '@/components/molecules/Table';
import CardRoot from '@/components/atoms/Card';
import useMediaQuery from '@/hooks/useMediaQueries';
import PaginatedList from '@/components/organisms/PaginatedList';
import { operatingCostsActions } from '@/redux/reducers/operatingCosts';
import { OperatingCost } from '@/redux/reducers/operatingCosts/types';
import { useDebouncedCallback } from 'use-debounce';

const columns: ColumnsType<SaleDetails> = [
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
      return <Tag color={_status?.color ?? 'orange'}>{record?.status?.name}</Tag>;
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
    title: 'Fecha de creación',
    dataIndex: 'created_at',
    align: 'center',
    width: 210,
    render: (value: Date | string) => functions.tableDate(value),
  },
];

const PurchasesExpenses = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { branches } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
  const { operatingCosts, filters } = useAppSelector(({ operatingCosts }) => operatingCosts);
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

  const onSearch = useDebouncedCallback((value: string) => {
    dispatch(operatingCostsActions.filterBySearch(value)).then(data => {
      setOperations(data || []);
    });
  }, 300);

  const onRowClick = (record: OperatingCost) => {
    navigate(
      APP_ROUTES.PRIVATE.DASHBOARD.PURCHASES_EXPENSES.EDIT.hash`${record.operation_type?.toLowerCase()}${
        record.operating_cost_id
      }`,
    );
  };

  const onRefresh = async () => {
    const result = await dispatch(operatingCostsActions.fetchOperations());
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
                onChange={({ target }) => onSearch(target.value)}
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
            {/* <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  defaultSelectedKeys: ['ALL'],
                  items: EXPENSES_TYPES,
                  selectable: true,
                  onClick: ({ key }) => {
                    setFilters(p => ({ ...p, operationType: key }));
                  },
                }}
              >
                <Button
                  type={filters?.operationType !== 'ALL' ? 'primary' : 'default'}
                  block
                  className={`${filters?.operationType !== 'ALL' ? '!bg-white' : ''}`}
                  ghost={filters?.operationType !== 'ALL'}
                  size={isTablet ? 'large' : 'middle'}
                  icon={<AuditOutlined className="text-base" />}
                >
                  {filters?.operationType === 'ALL' ? 'Estado' : (EXPENSES_TYPES_MAP as any)[filters?.operationType || 'ALL']}
                </Button>
              </Dropdown>
            </Col> */}
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
              {/* <Dropdown
                menu={{
                  defaultSelectedKeys: ['ALL'],
                  items: [
                    { label: 'Nueva compra', key: 'purchase' },
                    { label: 'Nuevo gasto', key: 'expense' },
                  ],

                  selectable: true,
                  onClick: ({ key }) => {
                   ;
                  },
                }}
              > */}
              {permissions?.expenses?.add_expense && (
                <Button
                  block
                  type="primary"
                  size={isTablet ? 'large' : 'middle'}
                  icon={<PlusCircleOutlined />}
                  onClick={() => navigate(APP_ROUTES.PRIVATE.DASHBOARD.PURCHASES_EXPENSES.ADD_NEW.hash`${'expense'}`)}
                >
                  Agregar
                </Button>
              )}
              {/* </Dropdown> */}
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
                rowKey={record => record.operating_cost_id}
                columns={columns}
                dataSource={operations}
                scroll={{ x: 700, y: 'calc(100dvh - 350px)' }}
                onRefresh={onRefresh}
                totalItems={operations?.length || 0}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              className="mt-4 !max-h-[calc(100dvh-284px)]"
              $bodyHeight="calc(100dvh - 340px)"
              pagination={{ position: 'bottom', align: 'center' }}
              dataSource={operations}
              rootClassName="sadasd"
              renderItem={item => {
                const _status = STATUS_OBJ[item?.status_id || 1];
                return (
                  <div
                    key={item.operating_cost_id}
                    onClick={() => onRowClick(item)}
                    className="flex justify-between py-3 px-4 items-center border-b border-gray-200 cursor-pointer"
                  >
                    <div className="flex flex-col w-1/3">
                      <Typography.Text strong className="!mb-2">
                        {item?.reason || 'Público general'}
                      </Typography.Text>
                      <Typography.Text type="secondary">{functions.tableDate(item.created_at)}</Typography.Text>
                    </div>

                    <div className="flex flex-col w-1/3 text-end justify-end">
                      <Typography.Text className="!mb-2 font-medium">{functions.money(item.amount)}</Typography.Text>
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

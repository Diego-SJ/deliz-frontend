import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { Breadcrumb, Col, Row, Tag, Dropdown, Button, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cashier } from '@/redux/reducers/sales/types';
import Table from '@/components/molecules/Table';
import { cashiersActions } from '@/redux/reducers/cashiers';
import CardRoot from '@/components/atoms/Card';
import useMediaQuery from '@/hooks/useMediaQueries';
import { FilterOutlined } from '@ant-design/icons';
import CashRegisterSvg from '@/assets/img/jsx/cash-register';
import PaginatedList from '@/components/organisms/PaginatedList';
import { CashCut } from '@/redux/reducers/cashiers/types';
import { LockKeyhole, LockKeyholeOpen } from 'lucide-react';

export const getStatus = (total = 0, received = 0) => {
  if (total === received) return { color: 'green', text: 'Cerrada sin diferencias' };
  if (total > received) return { color: 'red', text: `Faltante de ${functions.money(total - received)}` };
  return { color: 'blue', text: `Sobrante de ${functions.money(received - total)}` };
};

const columns: ColumnsType<Cashier> = [
  {
    title: 'Fecha de apertura',
    dataIndex: 'opening_date',
    width: 240,
    render: (value = '') => <span className="pl-3">{functions.tableDate(value)}</span>,
  },
  {
    title: 'Monto de apertura',
    width: 160,
    align: 'center',
    dataIndex: 'initial_amount',
    render: (value = 0) => {
      return functions.money(value);
    },
  },

  {
    title: 'Monto esperado',
    dataIndex: 'final_amount',
    align: 'center',
    width: 160,
    render: (_, record) => functions.money(record.final_amount || 0),
  },
  {
    title: 'Monto recibido',
    dataIndex: 'received_amount',
    align: 'center',
    width: 160,
    render: (value = 0) => functions.money(value),
  },
  {
    title: 'Estatus',
    dataIndex: 'final_amount',
    align: 'center',
    width: 160,
    render: (final_amount, record) => {
      let { color, text } = getStatus(final_amount, record.received_amount);
      return (
        <Tag color={color} className="mx-auto">
          {text}
        </Tag>
      );
    },
  },
  {
    title: 'Fecha de cierre',
    dataIndex: 'closing_date',
    align: 'center',
    width: 240,
    render: (value = '') => functions.tableDate(value),
  },
];

const CloseSales = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { cashiers } = useAppSelector(({ sales }) => sales);
  const { cash_cuts } = useAppSelector(({ cashiers }) => cashiers);
  const { cash_registers, currentBranch, currentCashRegister } = useAppSelector(({ branches }) => branches);
  const [filters, setFilters] = useState({
    cash_register_id: currentCashRegister?.cash_register_id,
    order: 'opening_date,false',
  });
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    dispatch(
      cashiersActions.cash_cuts.fetchCashCutsByCashRegister({
        cash_register_id: filters.cash_register_id || '',
        order: filters.order,
      }),
    );
  }, [filters]);

  const onRowClick = (record: CashCut) => {
    navigation(APP_ROUTES.PRIVATE.TRANSACTIONS.CASHIER_DETAIL.hash`${record!.cash_cut_id!}`);
  };

  const onRefresh = async () => {
    dispatch(
      cashiersActions.cash_cuts.fetchCashCutsByCashRegister({
        cash_register_id: filters.cash_register_id || '',
        order: filters.order,
      }),
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <Row justify="space-between" align="middle" className="mb-3">
        <Col lg={{ span: 12 }}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>Cajas</Link>,
                key: 'transactions',
              },
              { title: 'Historico de cortes de caja' },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Row gutter={[10, 10]} className="!mb-6">
            <Col lg={4} md={12} xs={12}>
              <Dropdown
                menu={{
                  defaultSelectedKeys: [filters.cash_register_id || ''],
                  items: cash_registers
                    ?.filter(cs => cs.branch_id === currentBranch?.branch_id)
                    ?.map(item => ({ label: `Caja ${item.name}`, key: item.cash_register_id })),
                  selectable: true,
                  onClick: ({ key }) => {
                    setFilters(p => ({ ...p, cash_register_id: key }));
                  },
                }}
              >
                <Button block size={isTablet ? 'large' : 'middle'} icon={<CashRegisterSvg className="text-black !w-4 !h-4" />}>
                  Caja {currentCashRegister?.name}
                </Button>
              </Dropdown>
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  defaultSelectedKeys: [filters.order],
                  items: [
                    { key: 'opening_date,false', label: 'Fecha de apertura (recientes primero)' },
                    { key: 'opening_date,true', label: 'Fecha de apertura (antiguos primero)' },
                  ],
                  selectable: true,
                  onClick: ({ key }) => {
                    setFilters(p => ({ ...p, order: key }));
                  },
                }}
              >
                <Button block size={isTablet ? 'large' : 'middle'} icon={<FilterOutlined className="text-base" />}>
                  Ordenar
                </Button>
              </Dropdown>
            </Col>
          </Row>

          {!isTablet ? (
            <CardRoot styles={{ body: { padding: 0, overflow: 'hidden' } }}>
              <Table
                onRow={record => {
                  return {
                    onClick: () => onRowClick(record), // click row
                  };
                }}
                columns={columns}
                dataSource={cash_cuts}
                rowKey={item => `${item.cash_cut_id}`}
                scroll={{ x: 768 }}
                onRefresh={onRefresh}
                totalItems={cashiers?.data?.length}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              className="mt-4"
              $bodyHeight="calc(100dvh - 250px)"
              pagination={{ position: 'bottom', align: 'center' }}
              dataSource={cash_cuts}
              renderItem={item => {
                let { color, text } = getStatus(item.final_amount, item.received_amount);
                return (
                  <div
                    key={item.cash_cut_id}
                    onClick={() => onRowClick(item)}
                    className="flex flex-col justify-between py-3 px-4 items-center border-b border-gray-200 cursor-pointer"
                  >
                    <div className="flex w-full justify-between mb-1">
                      <div className="flex flex-col">
                        <Typography.Paragraph className="!mb-0 flex gap-2 items-center text-gray-800">
                          <LockKeyholeOpen className="w-4" /> <span>{functions.tableDate(item?.opening_date)}</span>
                        </Typography.Paragraph>

                        <Typography.Paragraph className="flex gap-2 items-center text-gray-800">
                          <LockKeyhole className="w-4" /> <span>{functions.tableDate(item?.closing_date)}</span>
                        </Typography.Paragraph>
                      </div>
                      <Tag color={color} className="w-fit h-fit mt-2 -mr-1">
                        {text}
                      </Tag>
                    </div>
                    <div className="grid w-full grid-cols-3">
                      <div className="!text-xs flex-col-reverse text-center text-gray-400 inline-flex">
                        <span className="font-light mr-1">Apertura</span>{' '}
                        <span className="font-medium block">{functions.money(item.initial_amount)}</span>
                      </div>
                      <div className="!text-xs flex-col-reverse text-center text-gray-400 font-light inline-flex">
                        <span className="font-light mr-1">Esperado</span>{' '}
                        <span className="font-medium block">{functions.money(item.final_amount)}</span>
                      </div>
                      <div className="!text-xs flex-col-reverse text-center text-gray-400 font-light inline-flex">
                        <span className="font-light mr-1">Recibido</span>{' '}
                        <span className="font-medium block">{functions.money(item.received_amount)}</span>
                      </div>
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

export default CloseSales;

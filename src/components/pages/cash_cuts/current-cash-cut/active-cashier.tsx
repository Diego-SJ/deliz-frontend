import { useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import IncomeBlueSvg from '@/assets/img/svg/income-blue.svg';
import ExpenseSvg from '@/assets/img/svg/expense.svg';
import SaleCashSvg from '@/assets/img/svg/sale-cash.svg';
import { Avatar, Badge, Button, Card, Col, Divider, Input, List, Row, Typography } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { PAYMENT_METHOD_NAME } from '@/constants/payment_methods';
import CashRegisterSvg from '@/assets/img/jsx/cash-register';
import OpenCashierModal from './open-cashier-modal';
import AddOperationDrawer from './add-operation';
import CashCutForm from './cash-cut-form';
import { useState } from 'react';
import useMediaQuery from '@/hooks/useMediaQueries';
import dayjs from 'dayjs';

export const OPERATION_TYPE_NAME = {
  INCOME: 'Ingreso',
  EXPENSE: 'Retiro',
  SALE: 'Venta',
};

export const getImageType = (type: 'INCOME' | 'EXPENSE' | 'SALE') => {
  if (type === 'INCOME') return IncomeBlueSvg;
  if (type === 'EXPENSE') return ExpenseSvg;
  return SaleCashSvg;
};

export const getColorName = (type: 'INCOME' | 'EXPENSE' | 'SALE') => {
  if (type === 'SALE') return { border: 'border-green-500', bg: 'bg-green-50' };
  if (type === 'EXPENSE') return { border: 'border-slate-500', bg: 'bg-slate-50' };
  return { border: 'border-cyan-500', bg: 'bg-cyan-50' };
};

const OpenCashier = () => {
  const { active_cash_cut } = useAppSelector(({ cashiers }) => cashiers);
  const { currentBranch, currentCashRegister } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
  const [openCloseCashier, setOpenCloseCashier] = useState(false);
  const { isTablet } = useMediaQuery();

  const handleDrawerVisible = () => {
    setOpenCloseCashier(prev => !prev);
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <Row gutter={[20, 20]}>
            <Col xs={24}>
              <CardRoot>
                <div className="flex flex-col gap-4 w-full items-center md:flex-row ">
                  <Card.Meta
                    className="w-full"
                    avatar={<Avatar src={<CashRegisterSvg className="fill-primary" />} className="bg-primary/5 p-3" size={60} />}
                    title={
                      <div className="flex flex-col  justify-between h-full">
                        <Typography.Title level={5} style={{ margin: 0 }}>
                          Caja {currentCashRegister?.name}
                          <Badge
                            style={{ marginLeft: 15, color: !!active_cash_cut?.cash_cut_id ? 'green' : 'red' }}
                            status={!!active_cash_cut?.cash_cut_id ? 'success' : 'error'}
                            text={!!active_cash_cut?.cash_cut_id ? `Abierta` : 'Cerrada'}
                          />
                        </Typography.Title>
                        <div className="flex flex-col">
                          {active_cash_cut?.opening_date && (
                            <span className="text-slate-400 text-sm font-light">
                              Apertura: {dayjs(active_cash_cut?.opening_date).utc().format('dddd DD MMMM hh:mm a')}
                            </span>
                          )}
                          <span className="text-slate-400 text-sm font-light">Sucursal {currentBranch?.name}</span>
                        </div>
                      </div>
                    }
                    // description={
                    //   !!active_cash_cut?.notes && (
                    //     <div>
                    //       <Typography.Paragraph className="!mb-1">Notas</Typography.Paragraph>
                    //       <Typography.Paragraph className="text-slate-400">active_cash_cut?.notes</Typography.Paragraph>
                    //     </div>
                    //   )
                    // }
                  />
                  {!!active_cash_cut?.cash_cut_id && permissions?.cash_registers?.make_cash_cut?.value && (
                    <>
                      <Button
                        className="w-full md:w-fit"
                        size={isTablet ? 'large' : 'middle'}
                        type="primary"
                        onClick={handleDrawerVisible}
                      >
                        Hacer corte de caja
                      </Button>
                      <CashCutForm visible={openCloseCashier} onClose={handleDrawerVisible} />
                    </>
                  )}
                </div>
              </CardRoot>
            </Col>
            {!!active_cash_cut?.notes && (
              <Col xs={24}>
                <CardRoot classNames={{ body: '!py-3' }}>
                  <Typography.Paragraph className="!m-0">Notas</Typography.Paragraph>
                  <Typography.Paragraph className="font-light !m-0 text-slate-400">{active_cash_cut?.notes}</Typography.Paragraph>
                  {/* <Input.TextArea defaultValue={active_cash_cut?.notes} disabled autoSize={false} /> */}
                </CardRoot>
              </Col>
            )}
          </Row>
          {!!active_cash_cut?.cash_cut_id && (
            <Row style={{ marginTop: 20 }} gutter={[20, 20]}>
              <Col xs={24} md={24} lg={10}>
                <CardRoot className="!p-0" styles={{ body: { padding: 0 } }}>
                  <Typography.Title level={5} className="m-0 py-3 px-4" style={{ marginBottom: 0 }}>
                    Administración del dinero
                  </Typography.Title>
                  {permissions?.cash_registers?.make_cash_cut_operation?.value && (
                    <>
                      <Divider className="m-0" />
                      <AddOperationDrawer />
                    </>
                  )}
                  <Divider className="mt-0 mb-4" />
                  <div className="flex flex-col px-4">
                    <div className="flex justify-between py-1 ">
                      <Typography.Text className="m-0 text-neutral-400 !font-light">Monto inicial</Typography.Text>
                      <Typography.Text className="m-0 text-neutral-600">
                        {functions.money(active_cash_cut?.initial_amount)}
                      </Typography.Text>
                    </div>

                    <div className="flex justify-between py-1">
                      <Typography.Text className="m-0 text-neutral-400 !font-light">Ventas realizadas</Typography.Text>
                      <Typography.Text className="m-0 text-neutral-600">
                        {functions.money(active_cash_cut?.sales_amount || 0)}
                      </Typography.Text>
                    </div>

                    <div className="flex justify-between py-1">
                      <Typography.Text className="m-0 text-neutral-400 !font-light">Ingresos</Typography.Text>
                      <Typography.Text className="m-0 text-neutral-600">
                        {functions.money(active_cash_cut?.incomes_amount || 0)}
                      </Typography.Text>
                    </div>

                    <div className="flex justify-between py-1">
                      <Typography.Text className="m-0 text-neutral-400 !font-light">Gastos y egresos</Typography.Text>
                      <Typography.Text className="m-0 text-neutral-600">
                        - {functions.money(active_cash_cut?.expenses_amount)}
                      </Typography.Text>
                    </div>
                  </div>
                  <Divider className="my-4" />
                  <div className="flex justify-between py-1 mb-4 px-4">
                    <Typography.Text className="m-0 text-base font-medium">Monto total en la caja</Typography.Text>
                    <Typography.Text className="m-0 text-base font-medium">
                      {functions.money(active_cash_cut?.final_amount)}
                    </Typography.Text>
                  </div>
                </CardRoot>
              </Col>
              <Col xs={24} md={24} lg={14}>
                <CardRoot className="max-h-[30rem] overflow-auto" styles={{ body: { padding: 0 } }}>
                  <List
                    itemLayout="horizontal"
                    dataSource={active_cash_cut?.operations || []}
                    renderItem={(item, index) => {
                      const { border, bg } = getColorName(item.operation_type);
                      return (
                        <List.Item className="w-full" key={index}>
                          <div className="flex justify-between w-full px-4">
                            <div className="flex gap-4 ">
                              <Avatar
                                src={getImageType(item?.operation_type)}
                                className={`p-[0.4rem] ${bg} border-2 ${border} min-w-[3rem] min-h-[3rem] max-w-[3rem] max-h-[3rem]`}
                              />
                              <div className="flex flex-col">
                                <Typography.Text className="text-base font-normal">
                                  {OPERATION_TYPE_NAME[item.operation_type] || '- - -'}{' '}
                                  {PAYMENT_METHOD_NAME[item.payment_method] || item.payment_method || '- - -'}
                                </Typography.Text>
                                <Typography.Text className="text-sm text-slate-400 font-light">
                                  {item.name || '- - -'}
                                </Typography.Text>
                              </div>
                            </div>
                            <div className="flex flex-col items-end min-w-[35%]">
                              <Typography.Text className="text-base font-medium mb-1">
                                {functions.money(item.amount)}
                              </Typography.Text>
                              <Typography.Text className="text-xs text-slate-400 font-light">
                                {functions.tableDate(item.created_at)}
                              </Typography.Text>
                            </div>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                </CardRoot>
              </Col>
            </Row>
          )}
        </Col>
        {!active_cash_cut?.cash_cut_id && (
          <Col xs={24}>
            <OpenCashierModal />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default OpenCashier;

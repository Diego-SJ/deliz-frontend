import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Avatar, Breadcrumb, Card, Col, Divider, List, Row, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import functions from '@/utils/functions';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { OPERATION_TYPE_NAME, getColorName, getImageType } from '../current-cashier/active-cashier';
import CardRoot from '@/components/atoms/Card';
import { PAYMENT_METHOD_NAME } from '@/constants/payment_methods';
import CashRegisterSvg from '@/assets/img/jsx/cash-register';
import { CashCut } from '@/redux/reducers/cashiers/types';
import { getStatus } from '../index';

const CashierDetail = () => {
  const dispatch = useAppDispatch();
  const { cash_cut_id } = useParams();
  const { cashiers } = useAppSelector(({ sales }) => sales);
  const [currentCashCut, setCurrentCashCut] = useState<(CashCut & { branches: any; cash_registers: any }) | null>(null);
  const firstRender = useRef(true);
  const { text, color } = getStatus(currentCashCut?.final_amount, currentCashCut?.received_amount);

  useEffect(() => {
    if (firstRender.current && cash_cut_id) {
      firstRender.current = false;

      dispatch(cashiersActions.cash_cuts.fetchCashCutDataById(cash_cut_id)).then(data => {
        setCurrentCashCut(data);
      });
    }
  }, [cashiers?.data, dispatch, cash_cut_id]);

  return (
    <div className="max-w-[1200px] mx-auto">
      <Breadcrumb
        className="mb-3"
        items={[
          {
            title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>Cajas</Link>,
            key: 'Cajas',
          },
          {
            title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path}>Historico de cortes de caja</Link>,
            key: 'Historico de cortes de caja',
          },
          { title: 'Detalle de caja' },
        ]}
      />
      <div className="max-w-[900px] mx-auto">
        <Row style={{ marginTop: 20 }} gutter={[20, 20]}>
          <Col xs={24} md={24} lg={10}>
            <CardRoot className="mb-5" loading={!currentCashCut?.cash_cut_id}>
              <div className="flex flex-col gap-4 w-full items-center">
                <Card.Meta
                  className="w-full"
                  avatar={
                    <Avatar src={<CashRegisterSvg className="fill-slate-600" />} className="bg-slate-600/5 p-3" size={60} />
                  }
                  title={
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Caja {currentCashCut?.cash_registers?.name}
                    </Typography.Title>
                  }
                  description={
                    <Typography.Text className="text-neutral-400">Sucursal {currentCashCut?.branches?.name}</Typography.Text>
                  }
                />
                <div className="flex flex-col text-start w-full">
                  <Typography.Text className="!mb-2 text-neutral-400 !font-light">
                    <span className="block text-gray-600 font-medium">Apertura: </span>{' '}
                    {functions.tableDate(currentCashCut?.opening_date || '')}
                  </Typography.Text>
                  <Typography.Text className="mb-2 text-neutral-400 !font-light">
                    <span className="block text-gray-600 font-medium">Cierre: </span>
                    {functions.tableDate(currentCashCut?.closing_date || '')}
                  </Typography.Text>

                  <span className="block text-gray-600 font-medium mb-2">Estado: </span>
                  <Tag color={color} className="w-fit">
                    {text}
                  </Tag>
                </div>
              </div>
            </CardRoot>

            <CardRoot className="!p-0" styles={{ body: { padding: 0 } }} loading={!currentCashCut?.cash_cut_id}>
              <Typography.Title level={5} className="m-0 py-3 px-6" style={{ marginBottom: 0 }}>
                Administración del dinero
              </Typography.Title>
              <Divider className="m-0" />
              <Divider className="mt-0 mb-4" />
              <div className="p-2">
                <div className="flex flex-col px-4">
                  <div className="flex justify-between py-1 ">
                    <Typography.Text className="m-0 text-neutral-400 !font-light">Monto inicial</Typography.Text>
                    <Typography.Text className="m-0 text-neutral-600">
                      {functions.money(currentCashCut?.initial_amount)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-neutral-400 !font-light">Monto de ventas</Typography.Text>
                    <Typography.Text className="m-0 text-neutral-600">
                      {functions.money(currentCashCut?.sales_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-neutral-400 !font-light">Monto de ingresos</Typography.Text>
                    <Typography.Text className="m-0 text-neutral-600">
                      {functions.money(currentCashCut?.incomes_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-neutral-400 !font-light">Monto de egresos</Typography.Text>
                    <Typography.Text className="m-0 text-neutral-600">
                      - {functions.money(currentCashCut?.expenses_amount)}
                    </Typography.Text>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between py-0 mb-1 px-4">
                  <Typography.Text className="m-0 text-base font-medium">Monto esperado</Typography.Text>
                  <Typography.Text className="m-0 text-base font-medium">
                    {functions.money(currentCashCut?.final_amount)}
                  </Typography.Text>
                </div>
                <div className="flex justify-between py-0 mb-1 px-4">
                  <Typography.Text className="m-0 text-base font-medium">Monto recibido</Typography.Text>
                  <Typography.Text className="m-0 text-base font-medium">
                    {functions.money(currentCashCut?.received_amount)}
                  </Typography.Text>
                </div>
                <div className="flex justify-between py-0 mb-1 px-4">
                  <Typography.Text className="m-0 text-base font-medium">Diferencia</Typography.Text>
                  <Typography.Text className="mb-2 text-base font-medium">
                    {functions.money((currentCashCut?.received_amount || 0) - (currentCashCut?.final_amount || 0))}
                  </Typography.Text>
                </div>
              </div>
            </CardRoot>
          </Col>
          <Col xs={24} md={24} lg={14}>
            <CardRoot
              className="max-h-[30rem] overflow-auto"
              styles={{ body: { padding: 0 } }}
              loading={!currentCashCut?.cash_cut_id}
            >
              <List
                itemLayout="horizontal"
                dataSource={currentCashCut?.operations || []}
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
                          <Typography.Text className="text-base font-medium mb-1">{functions.money(item.amount)}</Typography.Text>
                          <Typography.Text className="text-xs text-slate-400 font-light text-end">
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
      </div>
    </div>
  );
};

export default CashierDetail;

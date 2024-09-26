import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Avatar, Breadcrumb, Card, Col, Divider, Input, List, Row, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import functions from '@/utils/functions';
import { cashiersActions } from '@/redux/reducers/cashiers';
import CardRoot from '@/components/atoms/Card';
import CashRegisterSvg from '@/assets/img/jsx/cash-register';
import { CashCut } from '@/redux/reducers/cashiers/types';
import OperationItem from './operation-item';

const CashierDetail = () => {
  const dispatch = useAppDispatch();
  const { cash_cut_id } = useParams();
  const { cashiers } = useAppSelector(({ sales }) => sales);
  const [currentCashCut, setCurrentCashCut] = useState<(CashCut & { branches: any; cash_registers: any }) | null>(null);
  const firstRender = useRef(true);

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
            title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>Cajas</Link>,
            key: 'Cajas',
          },
          {
            title: <Link to={APP_ROUTES.PRIVATE.TRANSACTIONS.CASHIERS.path}>Historico de cortes de caja</Link>,
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
                  <Typography.Text className="!mb-2 text-gray-400 !font-light">
                    Fecha y hora de apertura:
                    <span className="block text-gray-600 font-medium">
                      {functions.tableDate(currentCashCut?.opening_date || '')}
                    </span>
                  </Typography.Text>
                  <Typography.Text className="mb-2 text-gray-400 !font-light">
                    Fecha y hora de cierre:
                    <span className="block text-gray-600 font-medium">
                      {functions.tableDate(currentCashCut?.closing_date || '')}
                    </span>
                  </Typography.Text>

                  {/* <span className="mb-2 text-gray-400 !font-light">Estado: </span>
                  <Tag color={color} className="w-fit">
                    {text}
                  </Tag> */}
                </div>
              </div>
            </CardRoot>

            <CardRoot
              className="!p-0"
              styles={{ body: { padding: !!currentCashCut?.cash_cut_id ? 0 : 20 } }}
              loading={!currentCashCut?.cash_cut_id}
            >
              <Typography.Title level={5} className="m-0 py-3 px-6" style={{ marginBottom: 0 }}>
                Administración del dinero
              </Typography.Title>
              <Divider className="m-0" />
              <div className="p-2">
                <div className="flex flex-col px-4">
                  <div className="flex justify-between py-1 ">
                    <Typography.Text className="m-0 text-neutral-400 !font-light">Monto inicial</Typography.Text>
                    <Typography.Text className="m-0 text-neutral-600">
                      {functions.money(currentCashCut?.initial_amount)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-neutral-400 !font-light">Ventas realizadas</Typography.Text>
                    <Typography.Text className="m-0 text-neutral-600">
                      {functions.money(currentCashCut?.sales_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-neutral-400 !font-light">Ingresos</Typography.Text>
                    <Typography.Text className="m-0 text-neutral-600">
                      {functions.money(currentCashCut?.incomes_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-neutral-400 !font-light">Gastos y egresos</Typography.Text>
                    <Typography.Text className="m-0 text-neutral-600">
                      - {functions.money(currentCashCut?.expenses_amount)}
                    </Typography.Text>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between py-0 mb-1 px-4">
                  <Typography.Text className="m-0 text-sm font-base">Monto esperado</Typography.Text>
                  <Typography.Text className="m-0 text-base font-medium">
                    {functions.money(currentCashCut?.final_amount)}
                  </Typography.Text>
                </div>
                <div className="flex justify-between py-0 mb-1 px-4">
                  <Typography.Text className="m-0 text-sm font-base">Monto recibido</Typography.Text>
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
            {!!currentCashCut?.notes && (
              <Col xs={24}>
                <CardRoot>
                  <Typography.Paragraph className="!mb-1">Notas</Typography.Paragraph>
                  <Input.TextArea defaultValue={currentCashCut?.notes} readOnly autoSize={false} />
                </CardRoot>
              </Col>
            )}
            <CardRoot
              className="max-h-[calc(100dvh-200px)] lg:max-h-[calc(100dvh-150px)] overflow-auto"
              styles={{ body: { padding: !!currentCashCut?.cash_cut_id ? 0 : 20 } }}
              loading={!currentCashCut?.cash_cut_id}
            >
              <List
                itemLayout="horizontal"
                dataSource={currentCashCut?.operations || []}
                renderItem={(item, index) => <OperationItem data={item} key={index} />}
              />
            </CardRoot>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CashierDetail;

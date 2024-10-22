import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Avatar, Breadcrumb, Col, Divider, Input, List, Row, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import functions from '@/utils/functions';
import { cashiersActions } from '@/redux/reducers/cashiers';
import CardRoot from '@/components/atoms/Card';
import CashRegisterSvg from '@/assets/img/jsx/cash-register';
import { CashCut } from '@/redux/reducers/cashiers/types';
import OperationItem from './operation-item';
import { Calendar, User } from 'lucide-react';

const CashierDetail = () => {
  const dispatch = useAppDispatch();
  const { cash_cut_id } = useParams();
  const { cashiers } = useAppSelector(({ sales }) => sales);
  const [currentCashCut, setCurrentCashCut] = useState<(CashCut & { branches: any; cash_registers: any }) | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current && cash_cut_id) {
      firstRender.current = false;

      dispatch(cashiersActions.cash_cuts.fetchCashCutDataById(cash_cut_id)).then((data) => {
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
        <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
          <Col xs={24} md={24} lg={10}>
            <CardRoot
              className="!p-5"
              classNames={{ body: '!p-0' }}
              style={{ marginBottom: 10 }}
              loading={!currentCashCut?.cash_cut_id}
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-4 w-full">
                  <Avatar
                    src={<CashRegisterSvg className="fill-green-600" />}
                    className="bg-green-400/10 !p-3"
                    size={50}
                  />
                  <div className="flex flex-col  justify-between h-full">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Caja {currentCashCut?.cash_registers?.name}
                    </Typography.Title>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Sucursal {currentCashCut?.branches?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between py-1 ">
                    <Typography.Text className="m-0 text-gray-400 !font-light">Monto inicial</Typography.Text>
                    <Typography.Text className="m-0 text-gray-600">
                      {functions.money(currentCashCut?.initial_amount)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-gray-400 !font-light">Ventas realizadas</Typography.Text>
                    <Typography.Text className="m-0 text-gray-600">
                      {functions.money(currentCashCut?.sales_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-gray-400 !font-light">Ingresos</Typography.Text>
                    <Typography.Text className="m-0 text-gray-600">
                      {functions.money(currentCashCut?.incomes_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-gray-400 !font-light">Gastos y egresos</Typography.Text>
                    <Typography.Text className="m-0 text-gray-600">
                      - {functions.money(currentCashCut?.expenses_amount)}
                    </Typography.Text>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between">
                  <Typography.Text className="m-0 text-sm font-base">Monto esperado</Typography.Text>
                  <Typography.Text className="m-0 text-base font-medium">
                    {functions.money(currentCashCut?.final_amount)}
                  </Typography.Text>
                </div>
                <div className="flex justify-between">
                  <Typography.Text className="m-0 text-sm font-base">Monto recibido</Typography.Text>
                  <Typography.Text className="m-0 text-base font-medium">
                    {functions.money(currentCashCut?.received_amount)}
                  </Typography.Text>
                </div>
                <div className="flex justify-between">
                  <Typography.Text className="m-0 text-base font-medium">Diferencia</Typography.Text>
                  <Typography.Text className="mb-2 text-base font-medium">
                    {functions.money((currentCashCut?.received_amount || 0) - (currentCashCut?.final_amount || 0))}
                  </Typography.Text>
                </div>
              </div>
            </CardRoot>

            <CardRoot className="!p-5" classNames={{ body: '!p-0' }} loading={!currentCashCut?.cash_cut_id}>
              <div className="flex flex-col gap-3 text-start w-full">
                <div className="flex flex-col text-gray-400">
                  <span className="text-gray-800 flex items-center gap-2">
                    <Calendar className="w-3" /> Fecha y hora de apertura
                  </span>{' '}
                  <span className="font-light">
                    {functions.formatToLocalTimezone(currentCashCut?.opening_date || '')}
                  </span>
                </div>
                <div className="flex flex-col text-gray-400">
                  <span className="text-gray-800 flex items-center gap-2">
                    <Calendar className="w-3" /> Fecha y hora de cierre
                  </span>{' '}
                  <span className="font-light">
                    {functions.formatToLocalTimezone(currentCashCut?.closing_date || '')}
                  </span>
                </div>

                <div className="flex flex-col text-gray-400">
                  <span className="text-gray-800 flex items-center gap-2">
                    <User className="w-3" /> Abierta por:
                  </span>{' '}
                  <span className="font-light">
                    {`${(currentCashCut?.opened_by as any)?.first_name || '- - -'} ${(currentCashCut?.opened_by as any)?.last_name || ''}`}
                  </span>
                </div>

                <div className="flex flex-col text-gray-400">
                  <span className="text-gray-800 flex items-center gap-2">
                    <User className="w-3" /> Cerrada por:
                  </span>{' '}
                  <span className="font-light">
                    {`${(currentCashCut?.closed_by as any)?.first_name || '- - -'} ${(currentCashCut?.closed_by as any)?.last_name || ''}`}
                  </span>
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

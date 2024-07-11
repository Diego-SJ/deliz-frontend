import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Avatar, Badge, Breadcrumb, Card, Col, Divider, List, Row, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import functions from '@/utils/functions';
import StoreSvg from '@/assets/img/svg/store.svg';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { OPERATION_TYPE_NAME, PAYMENT_METHOD_NAME, getColorName, getImageType } from '../current-cashier/open-cashier';

const CashierDetail = () => {
  const dispatch = useAppDispatch();
  const { cashier_id } = useParams();
  const { cashiers } = useAppSelector(({ sales }) => sales);
  const { cashier_detail, loading } = useAppSelector(({ cashiers }) => cashiers);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current && cashier_id) {
      firstRender.current = false;

      dispatch(cashiersActions.cashier_detail.getCashierOperationsById(Number(cashier_id)));
    }
  }, [cashiers?.data, dispatch, cashier_id]);

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
        <Col lg={{ span: 12 }}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>Cajas</Link>,
                key: 'Cajas',
              },
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path}>Cajas</Link>,
                key: 'Cajas',
              },
              { title: 'Detalle de cajas' },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <Card>
            <Row gutter={[20, 20]}>
              <Col xs={24} md={14}>
                <Card.Meta
                  avatar={<Avatar src={StoreSvg} className="bg-slate-100" style={{ padding: 10 }} size={60} />}
                  title={
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Local Caxuxi <Badge style={{ marginLeft: 15, color: 'green' }} status={'success'} text="Cerrada" />
                    </Typography.Title>
                  }
                  description={
                    <Typography.Text type="secondary">
                      {`Caja cerrada el ${functions.fullDateTime(cashier_detail?.data?.created_at || '')}`}
                    </Typography.Text>
                  }
                />
              </Col>
            </Row>
          </Card>
          <Row style={{ width: '100%', marginTop: 10 }} gutter={[10, 10]}>
            <Col xs={24} md={24} lg={10}>
              <Card
                className="w-full"
                styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
                loading={loading}
              >
                <Typography.Title level={5} className="m-0 py-3 px-4" style={{ marginBottom: 0 }}>
                  Administración del dinero
                </Typography.Title>
                <Divider className="m-0" />
                <Divider className="mt-0 mb-4" />
                <div className="flex flex-col px-4">
                  <div className="flex justify-between py-1 ">
                    <Typography.Text className="m-0 text-base text-gray-500">Monto inicial</Typography.Text>
                    <Typography.Text className="m-0 text-base text-gray-500">
                      {functions.money(cashier_detail?.data?.initial_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-base text-gray-500">Monto de ventas</Typography.Text>
                    <Typography.Text className="m-0 text-base text-gray-500">
                      {functions.money(cashier_detail?.data?.sales_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-base text-gray-500">Monto ingresado</Typography.Text>
                    <Typography.Text className="m-0 text-base text-gray-500">
                      {functions.money(cashier_detail?.data?.incomes_amount || 0)}
                    </Typography.Text>
                  </div>

                  <div className="flex justify-between py-1">
                    <Typography.Text className="m-0 text-base text-gray-500">Monto retirado</Typography.Text>
                    <Typography.Text className="m-0 text-base text-gray-500">
                      - {functions.money(cashier_detail?.data?.expenses_amount || 0)}
                    </Typography.Text>
                  </div>
                </div>
                <Divider className="my-4" />
                <div className="flex justify-between py-1 mb-4 px-4">
                  <Typography.Text className="m-0 text-base font-medium">Monto total en la caja</Typography.Text>
                  <Typography.Text className="m-0 text-base font-medium">
                    {functions.money(cashier_detail?.data?.final_amount)}
                  </Typography.Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={24} lg={14}>
              <Card className="max-h-[30rem] overflow-auto" styles={{ body: { padding: 0 } }}>
                <List
                  loading={loading}
                  itemLayout="horizontal"
                  dataSource={cashier_detail?.operations || []}
                  renderItem={(item, index) => {
                    const { border, bg } = getColorName(item?.operation_type);
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
                                {PAYMENT_METHOD_NAME[item.payment_method] || '- - -'}
                              </Typography.Text>
                              <Typography.Text className="text-sm text-gray-400 font-light">
                                {item.name || '- - -'}
                              </Typography.Text>
                            </div>
                          </div>
                          <div className="flex flex-col items-end min-w-[35%]">
                            <Typography.Text className="text-base font-medium">{functions.money(item.amount)}</Typography.Text>
                            <Typography.Text className="text-sm text-gray-400">
                              {functions.tableDate(item.created_at)}
                            </Typography.Text>
                          </div>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default CashierDetail;

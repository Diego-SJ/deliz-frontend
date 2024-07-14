import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Cashier, PaymentMethod } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import StoreSvg from '@/assets/img/svg/store.svg';
import CashierSvg from '@/assets/img/svg/cashier.svg';
import IncomeSvg from '@/assets/img/svg/income.svg';
import IncomeBlueSvg from '@/assets/img/svg/income-blue.svg';
import OutcomeSvg from '@/assets/img/svg/outcome.svg';
import ExpenseSvg from '@/assets/img/svg/expense.svg';
import SaleCashSvg from '@/assets/img/svg/sale-cash.svg';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  Row,
  Space,
  Typography,
  message,
} from 'antd';
import { useState } from 'react';
import { cashiersActions } from '@/redux/reducers/cashiers';
import CardRoot from '@/components/atoms/Card';

type Props = {
  onSuccess?: (args: boolean) => void;
};

export const OPERATION_TYPE_NAME = {
  INCOME: 'Ingreso',
  EXPENSE: 'Retiro',
  SALE: 'Venta',
};

export const PAYMENT_METHOD_NAME = {
  CASH: 'en efectivo',
  CC: 'con tarjeta',
  DC: 'con tarjeta',
  CARD: 'con tarjeta',
  TRANSFER: 'por transferencia',
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

const OpenCashier = ({ onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [addOperationForm] = Form.useForm();
  const [closeDayForm] = Form.useForm();
  const dispatch = useAppDispatch();
  const { cashiers, loading } = useAppSelector(({ sales }) => sales);
  const { cash_operations } = useAppSelector(({ cashiers }) => cashiers);
  const [openCloseCashier, setOpenCloseCashier] = useState(false);
  const [operationType, setOperationType] = useState<'INCOME' | 'EXPENSE' | null>(null);
  const { isTablet } = useMediaQuery();

  const onClose = () => {
    form.resetFields();
    dispatch(salesActions.setCashiers({ drawer: null }));
  };

  const onFinish = async (values: Cashier) => {
    let success = await dispatch(salesActions.cashiers.add(values));

    if (success) {
      form.resetFields();
      onClose();
      if (onSuccess) onSuccess(success);
    }
  };

  const closeCashier = () => {
    let { amount } = closeDayForm.getFieldsValue();
    amount = Number(amount.toFixed(2));
    if (amount === null || amount === undefined || amount < 0) {
      message.warning('Completa los campos requeridos');
      return false;
    }
    let cashierMessage = '';
    let description = '';
    let type = '';
    let totalAmount: number = Number((cash_operations?.total_amount || 0)?.toFixed(2));
    totalAmount = totalAmount < 0 ? Math.abs(totalAmount) : totalAmount;
    if (amount < totalAmount) {
      cashierMessage = `Están faltando ${functions.money(totalAmount - amount)} en la caja `;
      description = `Registraste ${functions.money(totalAmount)} en tu caja pero sólo tienes ${functions.money(
        amount,
      )}. Cancele el cierre para revisar los valores, o continúa para cerrar así de todos modos.`;
      type = 'warning';
    } else if (amount > totalAmount) {
      cashierMessage = `Están sobrando ${functions.money(amount - totalAmount)} en la caja`;
      description = `Registraste ${functions.money(totalAmount)} en tu caja pero tienes ${functions.money(
        amount,
      )} disponible. Cancele para revisar los valores, o continúa para cerrar así de todos modos.`;
      type = 'warning';
    } else if (amount === totalAmount) {
      cashierMessage = '¡Listo! Tu caja cerrará sin diferencias';
      description = `Tienes un total de ${functions.money(
        amount,
      )} registrado y disponible en tu caja y lo cerrará sin diferencia de valor.`;
      type = 'success';
    }
    Modal.confirm({
      onOk: async () => {
        const result = await dispatch(salesActions.cashiers.closeDay(amount));
        if (result) {
          setOpenCloseCashier(false);
          closeDayForm.resetFields();
        }
      },
      title: <Typography.Title level={4}>{cashierMessage}</Typography.Title>,
      content: (
        <div className="mb-6">
          <Typography.Text>{description}</Typography.Text>
        </div>
      ),
      cancelText: 'Cancelar',
      okText: 'Confirmar',
      type: type as 'success' | 'warning',
    });
  };

  const closeAddOperation = () => {
    setOperationType(null);
    addOperationForm.resetFields();
  };

  const addOperation = async () => {
    const { amount, name, payment_method } = addOperationForm.getFieldsValue();

    if (!amount || !payment_method || !name) {
      message.warning('Completa los campos requeridos');
      return false;
    }

    let success = false;

    success = await dispatch(
      cashiersActions.cash_operations.add({
        amount: amount as number,
        name,
        operation_type: operationType as 'INCOME' | 'EXPENSE',
        payment_method: payment_method as PaymentMethod,
      }),
    );

    if (success) {
      addOperationForm.resetFields();
      closeAddOperation();
    }
  };

  const handleCloseCashierDrawer = () => {
    setOpenCloseCashier(prev => !prev);
    closeDayForm.resetFields();
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <CardRoot>
            <Row gutter={[20, 20]}>
              <Col xs={24} md={14}>
                <Card.Meta
                  avatar={<Avatar src={StoreSvg} className="bg-slate-100" style={{ padding: 10 }} size={60} />}
                  title={
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Local Caxuxi{' '}
                      <Badge
                        style={{ marginLeft: 15, color: !!cashiers?.activeCashier ? 'green' : 'red' }}
                        status={!!cashiers?.activeCashier ? 'success' : 'error'}
                        text={!!cashiers?.activeCashier ? 'Abierta' : 'Cerrada'}
                      />
                    </Typography.Title>
                  }
                  description={<Typography.Text type="secondary">Cambiar sucursal y caja</Typography.Text>}
                />
              </Col>

              {!!cashiers?.activeCashier && (
                <Col xs={24} md={{ span: 6, offset: 4 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                  <Button
                    type="primary"
                    block
                    onClick={handleCloseCashierDrawer}
                    disabled={!!cashiers?.activeCashier?.close_date}
                  >
                    Cerrar caja
                  </Button>
                </Col>
              )}
            </Row>
          </CardRoot>
          {!!cashiers?.activeCashier && (
            <>
              <Row style={{ width: '100%', marginTop: 20 }} gutter={[20, 20]}>
                <Col xs={24} md={24} lg={10}>
                  <CardRoot className="w-full" styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}>
                    <Typography.Title level={5} className="m-0 py-3 px-4" style={{ marginBottom: 0 }}>
                      Administración del dinero
                    </Typography.Title>
                    <Divider className="m-0" />
                    <div className="flex">
                      <div
                        className="p-4 w-1/2 flex flex-col justify-center items-center hover:shadow-md cursor-pointer hover:bg-gray-50"
                        onClick={() => setOperationType('INCOME')}
                      >
                        <Avatar size={80} className="mb-2 p-2" src={IncomeSvg} />
                        <Typography.Text className="text-base">Ingresar dinero</Typography.Text>
                      </div>
                      <span className="w-[1px] bg-slate-200 h-[7rem] mt-auto mb-auto"></span>
                      <div
                        className="p-4 w-1/2 flex flex-col justify-center items-center hover:shadow-md cursor-pointer hover:bg-gray-50"
                        onClick={() => setOperationType('EXPENSE')}
                      >
                        <Avatar size={80} className="mb-2 p-2" src={OutcomeSvg} />
                        <Typography.Text className="text-base">Retirar dinero</Typography.Text>
                      </div>
                    </div>
                    <Divider className="mt-0 mb-4" />
                    <div className="flex flex-col px-4">
                      <div className="flex justify-between py-1 ">
                        <Typography.Text className="m-0 text-base text-gray-500">Monto inicial</Typography.Text>
                        <Typography.Text className="m-0 text-base text-gray-500">
                          {functions.money(cashiers?.activeCashier?.initial_amount)}
                        </Typography.Text>
                      </div>

                      <div className="flex justify-between py-1">
                        <Typography.Text className="m-0 text-base text-gray-500">Monto de ventas</Typography.Text>
                        <Typography.Text className="m-0 text-base text-gray-500">
                          {functions.money(cash_operations?.sales_amount || 0)}
                        </Typography.Text>
                      </div>

                      <div className="flex justify-between py-1">
                        <Typography.Text className="m-0 text-base text-gray-500">Monto ingresado</Typography.Text>
                        <Typography.Text className="m-0 text-base text-gray-500">
                          {functions.money(cash_operations?.incomes_amount || 0)}
                        </Typography.Text>
                      </div>

                      <div className="flex justify-between py-1">
                        <Typography.Text className="m-0 text-base text-gray-500">Monto retirado</Typography.Text>
                        <Typography.Text className="m-0 text-base text-gray-500">
                          - {functions.money(cash_operations?.expenses_amount)}
                        </Typography.Text>
                      </div>
                    </div>
                    <Divider className="my-4" />
                    <div className="flex justify-between py-1 mb-4 px-4">
                      <Typography.Text className="m-0 text-base font-medium">Monto total en la caja</Typography.Text>
                      <Typography.Text className="m-0 text-base font-medium">
                        {functions.money(cash_operations?.total_amount || 0)}
                      </Typography.Text>
                    </div>
                  </CardRoot>
                </Col>
                <Col xs={24} md={24} lg={14}>
                  <CardRoot className="max-h-[30rem] overflow-auto" styles={{ body: { padding: 0 } }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={cash_operations?.operations || []}
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
                                  {item.operation_type === 'SALE' ? (
                                    <>
                                      {item.amount < (item.total || 0) ? (
                                        <>
                                          {functions.money(item.amount)}
                                          <span className="text-sm text-slate-500 font-light">
                                            {' '}
                                            / {functions.money(item.total)}
                                          </span>
                                        </>
                                      ) : (
                                        functions.money(item.amount)
                                      )}
                                    </>
                                  ) : (
                                    functions.money(item.amount)
                                  )}
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
            </>
          )}
        </Col>
        <Col xs={24}>
          {!cashiers?.activeCashier && (
            <Card>
              <Row>
                <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar src={CashierSvg} size={250} />
                </Col>
                <Col xs={24} lg={12}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ ...cashiers?.selected, initial_amount: cashiers?.selected?.initial_amount || 0 }}
                  >
                    <Form.Item name="initial_amount" label="Monto inicial">
                      <InputNumber
                        size="large"
                        placeholder="$0.00"
                        style={{ width: '100%' }}
                        min={0}
                        type="number"
                        inputMode="decimal"
                        onFocus={({ target }) => target.select()}
                      />
                    </Form.Item>
                    <Form.Item name="name" label="Comentarios">
                      <Input size="large" placeholder="Caja 1" />
                    </Form.Item>
                    {cashiers?.drawer === 'edit' && (
                      <Form.Item name="received_amount" label="Saldo recibido en caja">
                        <InputNumber size="large" placeholder="$0.00" style={{ width: '100%' }} />
                      </Form.Item>
                    )}
                    <Button
                      size="large"
                      type="primary"
                      block
                      onClick={() => form.submit()}
                      loading={loading}
                      // disabled={disabaleButton()}
                    >
                      Abrir caja
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card>
          )}
        </Col>

        {/* Close cashier */}
        <Drawer
          title="Cerrar caja"
          placement={isTablet ? 'bottom' : 'right'}
          onClose={handleCloseCashierDrawer}
          height={'80%'}
          width={isTablet ? '100%' : '450px'}
          open={openCloseCashier}
          destroyOnClose
        >
          <Form layout="vertical" onFinish={closeCashier} form={closeDayForm} initialValues={{}}>
            <Typography.Title level={3} className="text-center mb-6">
              ¿Qué monto en efectivo tienes disponible en tu caja?
            </Typography.Title>
            <Form.Item name="amount" required>
              <InputNumber
                prefix="$"
                size="large"
                inputMode="decimal"
                autoFocus
                onFocus={({ target }) => target.select()}
                type="number"
                placeholder="0.00"
                style={{ width: '100%' }}
                className="text-center"
              />
            </Form.Item>

            <Row gutter={[10, 10]}>
              <Col xs={12}>
                <Button size="large" type="default" block onClick={handleCloseCashierDrawer} loading={loading}>
                  Cancelar
                </Button>
              </Col>
              <Col xs={12}>
                <Button size="large" type="primary" block onClick={() => closeDayForm.submit()} loading={loading}>
                  Continuar
                </Button>
              </Col>
            </Row>
          </Form>
        </Drawer>

        {/* Add income and outcome */}
        <Drawer
          title={operationType === 'INCOME' ? 'Ingresar dinero' : 'Retirar dinero'}
          placement={isTablet ? 'bottom' : 'right'}
          onClose={closeAddOperation}
          height={'80%'}
          width={isTablet ? '100%' : '450px'}
          open={!!operationType}
          destroyOnClose
        >
          <Form layout="vertical" onFinish={addOperation} form={addOperationForm} initialValues={{ payment_method: 'CASH' }}>
            <Form.Item name="name" label="Motivo" required>
              <Input size="large" placeholder="Ejemplo: pago de proveedores" onFocus={({ target }) => target.select()} />
            </Form.Item>
            <Form.Item name="amount" label="Monto" required>
              <InputNumber
                size="large"
                inputMode="decimal"
                autoFocus
                onFocus={({ target }) => target.select()}
                type="number"
                placeholder="$0.00"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="payment_method" label="Método de pago" required>
              <Radio.Group>
                <Radio value="CASH">Efectivo</Radio>
                <Radio value="CC">Tarjeta</Radio>
                <Radio value="TRANSFER">Transferencia</Radio>
              </Radio.Group>
            </Form.Item>
            <Row gutter={[10, 10]}>
              <Col xs={12}>
                <Button size="large" type="default" block onClick={() => setOperationType(null)} loading={loading}>
                  Cancelar
                </Button>
              </Col>
              <Col xs={12}>
                <Button size="large" type="primary" block onClick={() => addOperationForm.submit()} loading={loading}>
                  Continuar
                </Button>
              </Col>
            </Row>
          </Form>
        </Drawer>

        {/* Change sucursal and cashier */}
        <Drawer
          title={cashiers?.drawer === 'new' ? '¿Donde quieres cobrar?' : 'Editar caja'}
          width={isTablet ? '100%' : '450px'}
          onClose={onClose}
          open={!!cashiers?.drawer}
          styles={{ body: { paddingBottom: 80 } }}
          destroyOnClose
        >
          <Typography.Title level={5}>Elije una sucursal</Typography.Title>
          <Space direction="vertical" style={{ marginBottom: 20 }}>
            <Radio value={1}>Option A</Radio>
            <Radio value={2}>Option B</Radio>
            <Radio value={3}>Option C</Radio>
          </Space>

          <Typography.Title level={5}>Elije la caja</Typography.Title>
          <Space direction="vertical">
            <Radio value={1}>Local Caxuxi</Radio>
          </Space>
        </Drawer>
      </Row>
    </>
  );
};

export default OpenCashier;

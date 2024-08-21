import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import {
  App,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
  Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CardRoot from '@/components/atoms/Card';

import dayjs from 'dayjs';
import { operatingCostsActions } from '@/redux/reducers/operatingCosts';
import { STATUS_DATA } from '@/constants/status';

type Params = {
  action: 'edit' | 'add';
  operating_cost_id?: string;
  operation_type: 'expense' | 'purchase';
};

const UI_TEXTS = {
  BREADCRUMB: {
    add: { expense: 'Agregar gasto', purchase: 'Agregar compra' },
    edit: { expense: 'Detalles del gasto', purchase: 'Editar compra' },
  },
  saveBtn: { edit: 'Guardar cambios', add: 'Guardar' },
};

const { TextArea } = Input;

const AddOperationPurchaseExpense = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let { action = 'add', operation_type = 'expense', operating_cost_id } = useParams<Params>();
  const [loading, setLoading] = useState(false);
  const { loading: isLoading } = useAppSelector(({ operatingCosts }) => operatingCosts);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const firstRender = useRef<boolean>(false);
  const [payWithCashRegister, setPayWithCashRegister] = useState(false);
  const { modal } = App.useApp();

  useEffect(() => {
    if (!firstRender.current && operating_cost_id) {
      firstRender.current = true;
      dispatch(operatingCostsActions.getOperationById(operating_cost_id)).then(data => {
        form.setFieldsValue({ ...data, operation_date: data?.operation_date ? dayjs(data?.operation_date) : dayjs() });
      });
    }
  }, [operating_cost_id, dispatch]);

  const clearFields = () => {
    form.resetFields();
  };

  const onFinish = async () => {
    form.validateFields().then(async values => {
      setLoading(true);
      let operation = { ...values, operation_type: operation_type?.toUpperCase(), pay_from_cash_register: payWithCashRegister };

      const result = await dispatch(operatingCostsActions.upsertOperation(operation));

      if (result) {
        clearFields();
      }

      setLoading(false);
    });
  };

  const confirmDelete = async () => {
    setLoading(true);
    if (!operating_cost_id) return;
    const success = await dispatch(operatingCostsActions.deleteOperation(operating_cost_id));
    if (success) {
      clearFields();
      navigate(-1);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col pt-4 px-4 pb-10 w-full min-h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] overflow-auto">
        <div className="w-full max-w-[800px] mx-auto mb-20">
          <Row justify="space-between" className="mb-3">
            <Col span={24}>
              <Breadcrumb
                items={[
                  {
                    title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>{APP_ROUTES.PRIVATE.HOME.title}</Link>,
                    key: 'dashboard',
                  },
                  {
                    title: (
                      <Link to={APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.path}>{APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.title}</Link>
                    ),
                    key: 'expenses',
                  },
                  {
                    title: UI_TEXTS.BREADCRUMB[action][operation_type],
                  },
                ]}
              />
            </Col>
          </Row>

          <div className="flex gap-4  w-full mb-4">
            <Button icon={<ArrowLeftOutlined />} shape="circle" onClick={() => navigate(-1)} />
            <Typography.Title level={4} className="m-0">
              {UI_TEXTS.BREADCRUMB[action][operation_type]}
            </Typography.Title>
          </div>

          <Form
            requiredMark={false}
            form={form}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              status_id: STATUS_DATA.PAID.id,
              operation_date: dayjs(),
              pay_from_cash_register: false,
            }}
            validateMessages={{
              required: '${label} es obligatorio.',
              types: {
                number: '${label} no es un número válido!',
              },
            }}
          >
            <Row gutter={[20, 20]} className="mb-5">
              <Col md={12} xs={24}>
                <CardRoot loading={isLoading}>
                  <Form.Item name="operating_cost_id" hidden>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item name="reason" label="Motivo" rules={[{ required: true }]}>
                    <Input
                      size="large"
                      placeholder="E.g: Pago de luz"
                      autoComplete="off"
                      onPressEnter={onFinish}
                      readOnly={action !== 'add'}
                    />
                  </Form.Item>
                  <Form.Item name="amount" label="Monto" rules={[{ required: true }]}>
                    <InputNumber
                      size="large"
                      className="!w-full"
                      min={0}
                      inputMode="numeric"
                      type="number"
                      placeholder="$0"
                      onPressEnter={onFinish}
                      readOnly={action !== 'add'}
                    />
                  </Form.Item>
                  {action === 'add' && (
                    <Form.Item name="pay_from_cash_register" className="!m-0">
                      <Tooltip title="El monto será descontado y registrado en la caja actual">
                        <div className="!relative z-0 mt-5">
                          <Checkbox
                            className="w-full px-3 h-[40px] rounded-lg border border-gray-300 checked:bg-primary z-[1]"
                            onChange={({ target }) => setPayWithCashRegister(target.checked)}
                            value={payWithCashRegister}
                          />
                          <span className="absolute left-10 z-[-1] top-1/2 -translate-y-1/2">Usar efectivo de la caja</span>
                        </div>
                      </Tooltip>
                    </Form.Item>
                  )}
                </CardRoot>
              </Col>
              <Col md={12} xs={24}>
                <CardRoot loading={isLoading}>
                  <Form.Item hidden name="supplier_id" label="Proveedor">
                    <Input size="large" placeholder="Proveedor" onPressEnter={onFinish} readOnly={action !== 'add'} />
                  </Form.Item>
                  <Form.Item name="operation_date" label="Fecha del gasto">
                    <DatePicker
                      size="large"
                      format={'D [de] MMMM, YYYY'}
                      defaultValue={dayjs()}
                      placeholder="Fecha de operación"
                      onChange={date => {
                        if (date > dayjs()) {
                          form.setFieldsValue({ status_id: STATUS_DATA.PENDING.id });
                        } else if (date <= dayjs()) {
                          form.setFieldsValue({ status_id: STATUS_DATA.PAID.id });
                        }
                      }}
                      readOnly={action !== 'add'}
                    />
                  </Form.Item>
                  <Form.Item name="status_id" label="Estado">
                    <Select
                      size="large"
                      placeholder="Estado"
                      options={[
                        { label: STATUS_DATA.PAID.name, value: STATUS_DATA.PAID.id },
                        { label: STATUS_DATA.PENDING.name, value: STATUS_DATA.PENDING.id },
                      ]}
                      disabled={action !== 'add'}
                    />
                  </Form.Item>
                  <Form.Item name="notes" label="Notas" className="!m-0">
                    <TextArea size="large" rows={2} placeholder="Notas" readOnly={action !== 'add'} />
                  </Form.Item>
                </CardRoot>
              </Col>
            </Row>
          </Form>

          {action === 'edit' && permissions?.expenses?.delete_expense && (
            <CardRoot
              title={`Eliminar ${operation_type === 'expense' ? 'Gasto' : 'Compra'}`}
              className="my-5"
              loading={isLoading}
            >
              <div className="flex flex-col md:flex-row gap-5 md:gap-8 justify-between items-center">
                <Typography.Text type="danger">
                  Una vez eliminado el registro, no se podrá recuperar la información.
                </Typography.Text>
                <Button
                  ghost
                  danger
                  className="w-full md:max-w-40"
                  onClick={() => {
                    modal.confirm({
                      title: `Eliminar ${operation_type === 'expense' ? 'Gasto' : 'Compra'}`,
                      type: 'error',
                      okText: 'Eliminar',
                      onOk: confirmDelete,
                      okType: 'danger',
                      cancelText: 'Cancelar',
                      content: `¿Confirma que deseas eliminar este registro?`,
                      footer: (_, { OkBtn, CancelBtn }) => (
                        <>
                          <CancelBtn />
                          <OkBtn />
                        </>
                      ),
                    });
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </CardRoot>
          )}
        </div>
      </div>
      {(permissions?.expenses?.add_expense || permissions?.expenses?.edit_expense) && action === 'add' && (
        <Card
          className="rounded-none box-border absolute bottom-0 left-0 w-full"
          classNames={{ body: 'w-full flex items-center' }}
          styles={{ body: { padding: '0px', height: '80px' } }}
        >
          <div className="flex justify-end gap-6 max-w-[700px] mx-auto w-full px-4 lg:px-0">
            <Button size="large" className="w-full md:w-40" onClick={() => navigate(-1)} loading={loading}>
              Cancelar
            </Button>
            <Button size="large" type="primary" className="w-full md:w-40" onClick={onFinish} loading={loading}>
              {UI_TEXTS.saveBtn[action]}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default AddOperationPurchaseExpense;

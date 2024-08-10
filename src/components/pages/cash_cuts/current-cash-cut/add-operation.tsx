import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch } from '@/hooks/useStore';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Drawer, Form, Input, InputNumber, Radio, Row, Typography } from 'antd';
import { CircleDollarSign, NotebookPenIcon } from 'lucide-react';
import { useState } from 'react';

const AddOperationDrawer = () => {
  const dispatch = useAppDispatch();
  const [addOperationForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [operationType, setOperationType] = useState<'INCOME' | 'EXPENSE' | null>(null);
  const { isTablet } = useMediaQuery();

  const closeAddOperation = () => {
    setOperationType(null);
    addOperationForm.resetFields();
  };

  const addOperation = async () => {
    addOperationForm.validateFields().then(async values => {
      const { amount, name, payment_method } = values;
      setLoading(true);
      let success = await dispatch(
        cashiersActions.cash_operations.add({
          amount: amount as number,
          name,
          operation_type: operationType as 'INCOME' | 'EXPENSE',
          payment_method: payment_method as any,
        }),
      );
      setLoading(false);
      if (success) {
        closeAddOperation();
      }
    });
  };

  return (
    <>
      <div className="flex">
        <div
          className="p-4 w-1/2 flex flex-col justify-center items-center hover:shadow-md cursor-pointer hover:bg-gray-50 group"
          onClick={() => setOperationType('INCOME')}
        >
          <Avatar
            size={80}
            className="mb-2 p-2"
            src={<DownloadOutlined className="text-4xl text-neutral-400 group-hover:text-primary" />}
          />
          <Typography.Text className="text-base text-center leading-5">Ingresar dinero</Typography.Text>
        </div>
        <span className="w-[1px] bg-slate-200 h-[7rem] mt-auto mb-auto"></span>
        <div
          className="p-4 w-1/2 flex flex-col justify-center items-center hover:shadow-md cursor-pointer hover:bg-gray-50 group"
          onClick={() => setOperationType('EXPENSE')}
        >
          <Avatar
            size={80}
            className="mb-2 p-2"
            src={<UploadOutlined className="text-4xl text-neutral-400 group-hover:text-primary" />}
          />
          <Typography.Text className="text-base text-center leading-5">Retirar dinero</Typography.Text>
        </div>
      </div>
      {/* Add income and outcome */}
      <Drawer
        title={operationType === 'INCOME' ? 'Ingresar dinero' : 'Retirar dinero'}
        placement={isTablet ? 'bottom' : 'right'}
        onClose={closeAddOperation}
        height={'80dvh'}
        width={isTablet ? '100%' : '450px'}
        open={!!operationType}
        destroyOnClose
        footer={
          <Row gutter={[20, 20]}>
            <Col xs={12}>
              <Button size="large" type="default" block onClick={() => setOperationType(null)} loading={loading}>
                Cancelar
              </Button>
            </Col>
            <Col xs={12}>
              <Button size="large" type="primary" block onClick={() => addOperationForm.submit()} loading={loading}>
                Guardar
              </Button>
            </Col>
          </Row>
        }
      >
        <Form
          requiredMark={false}
          layout="vertical"
          onFinish={addOperation}
          form={addOperationForm}
          initialValues={{ payment_method: 'CASH' }}
        >
          <Form.Item name="name" label="Motivo" rules={[{ required: true, message: 'Campo obligatorio' }]}>
            <Input
              size="large"
              prefix={<NotebookPenIcon className="text-neutral-400 w-5" />}
              placeholder="Ejemplo: pago de proveedores"
              onFocus={({ target }) => target.select()}
              onPressEnter={addOperation}
            />
          </Form.Item>
          <Form.Item name="amount" label="Monto" rules={[{ required: true, message: 'Campo obligatorio' }]}>
            <InputNumber
              size="large"
              inputMode="decimal"
              prefix={<CircleDollarSign className="text-neutral-400 w-5" />}
              min={0}
              autoFocus
              onFocus={({ target }) => target.select()}
              type="number"
              placeholder="$0.00"
              onPressEnter={addOperation}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="payment_method" label="Método de pago">
            <Radio.Group className="flex flex-col">
              <Radio value="CASH">Efectivo</Radio>
              <Radio value="CC">Tarjeta de crédito</Radio>
              <Radio value="DC">Tarjeta de débito</Radio>
              <Radio value="TRANSFER">Transferencia</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default AddOperationDrawer;

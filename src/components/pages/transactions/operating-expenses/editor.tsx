import { PAYMENT_METHODS } from '@/constants/payment_methods';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { OperatingExpense } from '@/redux/reducers/sales/types';
import { Button, Form, Input, InputNumber, Select } from 'antd';

const { TextArea } = Input;

type ExpensesEditor = {
  onSuccess?: (success: boolean) => void;
};

const ExpensesEditor: React.FC<ExpensesEditor> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { operating_expenses, loading } = useAppSelector(({ sales }) => sales);

  const onFinish = async (values: OperatingExpense) => {
    let success = false;
    if (operating_expenses?.drawer === 'new') success = await dispatch(salesActions.operating_expenses.add(values));
    else
      success = await dispatch(
        salesActions.operating_expenses.update({ ...values, expense_id: operating_expenses?.selected?.expense_id }),
      );

    if (success) form.resetFields();
    if (onSuccess && success) onSuccess(success);
  };

  return (
    <Form
      form={form}
      wrapperCol={{ span: 24 }}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...operating_expenses?.selected,
        payment_method: operating_expenses?.selected?.payment_method ?? 'CASH',
        months_without_interest: operating_expenses?.selected?.months_without_interest ?? 0,
      }}
      validateMessages={{ required: '${label} es obligatorio.', types: { email: 'Formato del correo inválido' } }}
    >
      <Form.Item name="expense_name" label="Gasto" rules={[{ required: true }]}>
        <Input placeholder="Gasto" />
      </Form.Item>
      <Form.Item name="amount" label="Monto" rules={[{ required: true }]}>
        <InputNumber placeholder="Monto" min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="description" label="Descripción">
        <TextArea rows={2} placeholder="Descripción" />
      </Form.Item>
      <Form.Item name="payment_method" label="Método de pago" rules={[{ required: true }]}>
        <Select size="large" placeholder="Método de pago" options={PAYMENT_METHODS} />
      </Form.Item>
      <Form.Item name="months_without_interest" label="Meses sin intereses">
        <Select
          size="large"
          placeholder="Meses sin intereses"
          options={[
            { value: 0, label: 'No' },
            { value: 3, label: '3 MSI' },
            { value: 6, label: '6 MSI' },
            { value: 9, label: '9 MSI' },
            { value: 12, label: '12 MSI' },
            { value: 24, label: '24 MSI' },
            { value: 3, label: '3 MSI' },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" size="large" htmlType="submit" loading={loading}>
          {operating_expenses?.drawer === 'new' ? 'Guardar' : 'Guardar cambios'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ExpensesEditor;

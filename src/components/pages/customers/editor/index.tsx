import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { Button, Form, Input } from 'antd';

const UI_TEXTS = {
  saveBtn: { edit: 'Guardar cambios', add: 'Guardar' },
};

const { TextArea } = Input;

type CustomerEditorProps = {
  onSuccess?: (customer: Customer | null) => void;
};

const CustomerEditor: React.FC<CustomerEditorProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { current_customer, loading } = useAppSelector(
    ({ customers }) => customers,
  );
  const { permissions } = useAppSelector(
    ({ users }) => users.user_auth.profile!,
  );

  const onFinish = async (values: Customer) => {
    let success: boolean | Customer = false;
    let customer = {
      ...values,
      phone: values.phone?.replaceAll(' ', '')?.trim(),
    };

    if (current_customer?.customer_id === -1)
      success = await dispatch(customerActions.saveCustomer(customer));
    else success = await dispatch(customerActions.updateCustomer(customer));

    if (onSuccess && success) {
      form.resetFields();
      onSuccess((success as Customer) || values || null);
    }
  };

  return (
    <Form
      form={form}
      wrapperCol={{ span: 24 }}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      initialValues={current_customer}
      validateMessages={{
        required: '${label} es obligatorio.',
        types: { email: 'Formato del correo inválido' },
      }}
    >
      <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
        <Input size="large" placeholder="E.g: Fulanito" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Teléfono"
        rules={[
          {
            pattern: new RegExp(/^[0-9\d]*$/),
            message: 'Formato de teléfono inválido',
          },
          {
            max: 10,
            message: 'El teléfono debe tener 10 dígitos',
          },
        ]}
      >
        <Input
          size="large"
          placeholder="E.g: 1234567890"
          maxLength={10}
          minLength={10}
          inputMode="tel"
          type="number"
        />
      </Form.Item>
      <Form.Item name="email" label="Correo" rules={[{ type: 'email' }]}>
        <Input size="large" placeholder="ejemplo@email.com" inputMode="email" />
      </Form.Item>
      <Form.Item name="address" label="Dirección">
        <TextArea size="large" rows={2} placeholder="E.g: Calle Pirul 6" />
      </Form.Item>
      {permissions?.customers?.edit_customer?.value && (
        <Button
          size="large"
          block
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {
            UI_TEXTS.saveBtn[
              current_customer?.customer_id === -1 ? 'add' : 'edit'
            ]
          }
        </Button>
      )}
    </Form>
  );
};

export default CustomerEditor;

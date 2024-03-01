import { STATUS } from '@/constants/status';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Category } from '@/redux/reducers/products/types';
import { Button, Form, Input, Select } from 'antd';

const UI_TEXTS = {
  saveBtn: { edit: 'Guardar cambios', add: 'Guardar' },
};

const { TextArea } = Input;

type CustomerEditorProps = {
  onSuccess?: (success: boolean) => void;
};

const CategoryEditor: React.FC<CustomerEditorProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { current_category, loading } = useAppSelector(({ products }) => products);

  const onFinish = async (values: Category) => {
    let success = false;
    if (!current_category?.category_id) success = await dispatch(productActions.categories.add(values));
    else success = await dispatch(productActions.categories.update({ ...values, category_id: current_category?.category_id }));

    if (success) form.resetFields();
    if (onSuccess) onSuccess(success);
  };

  return (
    <Form
      form={form}
      wrapperCol={{ span: 24 }}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ ...current_category, status: current_category?.status ?? 1 }}
      validateMessages={{ required: '${label} es obligatorio.', types: { email: 'Formato del correo inválido' } }}
    >
      <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
        <Input placeholder="Nombre" />
      </Form.Item>
      <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
        <TextArea rows={2} placeholder="Descripción" />
      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Select size="large" placeholder="Por default es Activo">
          {STATUS.map(item => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button block type="primary" size="large" htmlType="submit" loading={loading}>
          {UI_TEXTS.saveBtn[!current_category?.category_id ? 'add' : 'edit']}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryEditor;

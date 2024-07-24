import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Size } from '@/redux/reducers/products/types';
import { Button, Form, Input } from 'antd';

const { TextArea } = Input;

type CustomerEditorProps = {
  onSuccess?: (success: boolean) => void;
};

const CategoryEditor: React.FC<CustomerEditorProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { sizes, loading } = useAppSelector(({ products }) => products);

  const onFinish = async (values: Size) => {
    let success = false;
    if (sizes?.drawer === 'new') success = await dispatch(productActions.sizes.add(values));
    else success = await dispatch(productActions.sizes.update({ ...values, size_id: sizes?.selected?.size_id }));

    if (success) form.resetFields();
    if (onSuccess) onSuccess(success);
  };

  return (
    <Form
      form={form}
      wrapperCol={{ span: 24 }}
      layout="vertical"
      onFinish={onFinish}
      initialValues={sizes?.selected}
      validateMessages={{ required: '${label} es obligatorio.', types: { email: 'Formato del correo inválido' } }}
    >
      <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
        <Input placeholder="Nombre" />
      </Form.Item>
      <Form.Item name="short_name" label="Abreviación" rules={[{ required: true }]}>
        <Input placeholder="Abreviación" />
      </Form.Item>
      <Form.Item name="description" label="Descripción">
        <TextArea rows={2} placeholder="Descripción" />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          {sizes?.drawer === 'new' ? 'Guardar' : 'Guardar cambios'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryEditor;

import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Category } from '@/redux/reducers/products/types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';

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
      <Form.Item name="description" label="Descripción">
        <TextArea rows={2} placeholder="Descripción" />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          {UI_TEXTS.saveBtn[!current_category?.category_id ? 'add' : 'edit']}
        </Button>
      </Form.Item>
    </Form>
  );
};

export const QuickCategoryCreationForm = ({ onSuccess }: { onSuccess?: (category_id: number) => void }) => {
  const [categoryName, setCategoryName] = useState('');
  const dispatch = useAppDispatch();

  const onClick = async () => {
    const category_id = await dispatch(productActions.categories.add({ name: categoryName, description: categoryName }));
    setCategoryName('');
    if (onSuccess) onSuccess(category_id);
  };

  return (
    <div className="flex gap-4 py-1 px-2">
      <Input
        className="w-full"
        placeholder="Nueva categoría"
        onKeyDown={e => e.stopPropagation()}
        value={categoryName}
        onChange={e => setCategoryName(e.target.value)}
      />
      <Button className="w-fit" icon={<PlusCircleOutlined />} onClick={onClick}>
        Agregar
      </Button>
    </div>
  );
};

export default CategoryEditor;

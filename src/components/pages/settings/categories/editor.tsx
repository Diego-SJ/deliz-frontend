import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Category } from '@/redux/reducers/products/types';
import { CloseOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Popover } from 'antd';
import Picker, { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useState } from 'react';

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
  const [emoji, setEmoji] = useState<EmojiClickData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (current_category?.image_url) {
      setEmoji({ emoji: current_category?.image_url } as any);
    }
  }, [current_category]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const onFinish = async (values: Category) => {
    let success = false;
    const category = {
      ...values,
      image_url: emoji?.emoji,
    };

    if (!current_category?.category_id) success = await dispatch(productActions.categories.add(category));
    else success = await dispatch(productActions.categories.update({ ...category, category_id: current_category?.category_id }));

    if (success) form.resetFields();
    if (onSuccess) onSuccess(success);
  };

  return (
    <Form
      form={form}
      wrapperCol={{ span: 24 }}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      initialValues={{ ...current_category, status: current_category?.status ?? 1 }}
      validateMessages={{ required: '${label} es obligatorio.', types: { email: 'Formato del correo inválido' } }}
    >
      <div className="flex justify-center">
        <div className="inline-flex relative">
          <Button
            onClick={() => setEmoji(null)}
            icon={<CloseOutlined />}
            className="absolute -right-2 -top-2 z-10"
            shape="circle"
            hidden={!emoji?.emoji}
          />
          <Popover
            content={
              <Picker
                onEmojiClick={value => {
                  console.log(value);
                  setEmoji(value);
                  setOpen(false);
                }}
              />
            }
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <Avatar
              icon={!emoji?.emoji ? <PlusOutlined className="text-slate-400 text-3xl" /> : null}
              className="w-20 h-20 bg-slate-600/10 text-5xl border-2 border-slate-200 hover:border-primary cursor-pointer"
            >
              {emoji?.emoji}
            </Avatar>
          </Popover>
        </div>
      </div>
      <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
        <Input placeholder="Nombre" size="large" />
      </Form.Item>
      <Form.Item name="description" label="Descripción">
        <TextArea rows={2} placeholder="Descripción" size="large" />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading} size="large">
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

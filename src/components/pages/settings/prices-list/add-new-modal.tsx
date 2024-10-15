import { useAppDispatch } from '@/hooks/useStore';
import { branchesActions } from '@/redux/reducers/branches';
import { Price } from '@/redux/reducers/branches/type';
import { App, Form, Input, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
  value?: Price | null;
  open: boolean;
  onClose: () => void;
};

const AddNewPriceModal = ({ open = false, onClose, value }: Props) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && value?.price_id) {
      form.setFieldsValue({ ...value });
    } else if (open && !value?.price_id) {
      form.resetFields();
    }
  }, [open, value]);

  const onSave = async () => {
    setLoading(true);
    await form
      .validateFields()
      .then(async (values) => {
        await dispatch(branchesActions.upsertPrice(values));
        message.success('Precio guardado correctamente');
        form.resetFields();
        onClose();
      })
      .catch(() => {
        message.error('Por favor, completa los campos requeridos');
      })
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={value?.price_id ? 'Editar precio' : 'Nuevo precio'}
      onCancel={handleClose}
      onOk={onSave}
      width={340}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      okText="Guardar"
      cancelText="Cancelar"
      forceRender
    >
      <Typography.Text type="secondary">
        {value?.price_id
          ? 'Al editar el tipo de precio, se actualizará en todos los productos que lo tengan asignado'
          : 'Una vez creado el tipo de precio, podrás asignarlo a tus productos'}
      </Typography.Text>
      <Form form={form} layout="vertical" className="mt-4" initialValues={{ ...value }}>
        <Form.Item name="company_id" hidden>
          <Input size="large" />
        </Form.Item>
        <Form.Item name="price_id" hidden>
          <Input size="large" />
        </Form.Item>
        <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Este campo es requerido' }]}>
          <Input size="large" placeholder="Nombre del precio" onPressEnter={onSave} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewPriceModal;

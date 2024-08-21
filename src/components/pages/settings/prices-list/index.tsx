import { PlusCircleOutlined } from '@ant-design/icons';
import { App, Button, Card, Form, Input, List, Modal, Tag, Typography } from 'antd';

import BreadcrumbSettings from '../menu/breadcrumb';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { branchesActions } from '@/redux/reducers/branches';
import useMediaQuery from '@/hooks/useMediaQueries';

const PricesListPage = () => {
  const mounted = useRef(false);
  const dispatch = useAppDispatch();
  const { prices_list } = useAppSelector(state => state.branches);
  const { company_id } = useAppSelector(state => state.app.company);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const [open, setOpen] = useState(false);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      dispatch(branchesActions.getPrices());
    }
  }, [mounted]);

  const openModal = () => {
    setOpen(true);
    form.setFieldsValue({ company_id });
  };

  const closeModal = () => {
    form.resetFields();
    setOpen(false);
  };

  const onEdit = (data: { price_id: string; name: string }) => {
    form.setFieldValue('name', data.name);
    form.setFieldValue('price_id', data.price_id);
    openModal();
  };

  const onDelete = async (price_id: string) => {
    modal.confirm({
      title: '¿Estás seguro de eliminar este precio?',
      content: 'Una vez eliminado, no podrás recuperarlo',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okType: 'danger',
      onOk: async () => {
        await dispatch(branchesActions.deletePrice(price_id));
        message.success('Precio eliminado correctamente');
      },
    });
  };

  const onSave = async () => {
    await form
      .validateFields()
      .then(async values => {
        await dispatch(branchesActions.upsertPrice(values));

        form.resetFields();
        closeModal();
        message.success('Precio guardado correctamente');
      })
      .catch(() => {
        message.error('Por favor, completa los campos requeridos');
      });
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Lista de precios' }]} />

      <div className="flex flex-col mb-2 w-full">
        <Typography.Title level={4}>Lista de precios</Typography.Title>

        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row gap-3">
          <Typography.Text className="text-gray-500">
            Configura las listas de precios que deseas ofrecerle a tus clientes
          </Typography.Text>

          {permissions?.price_list?.add_price && (
            <Button icon={<PlusCircleOutlined />} onClick={openModal} size={isTablet ? 'large' : 'middle'}>
              Agregar nuevo
            </Button>
          )}
        </div>
      </div>

      <Card style={{ width: '100%' }} styles={{ body: { padding: 0 } }} title="Precios" className="shadow-md rounded-xl">
        <List
          itemLayout="horizontal"
          footer={
            permissions?.price_list?.add_price ? (
              <div className="px-2">
                <Button type="text" icon={<PlusCircleOutlined />} className="text-primary" onClick={openModal}>
                  Agregar nuevo
                </Button>
              </div>
            ) : null
          }
          className="px-0"
          dataSource={prices_list}
          renderItem={item => (
            <List.Item
              styles={{ actions: { paddingRight: 15, margin: 0 } }}
              classNames={{ actions: 'flex' }}
              className="flex"
              actions={[
                permissions?.price_list?.edit_price ? (
                  <Button type="link" onClick={() => onEdit(item)} className="w-min px-0">
                    Editar
                  </Button>
                ) : null,
                item.is_default || !permissions?.price_list?.delete_price ? null : (
                  <Button danger type="link" className="w-min px-0" onClick={() => onDelete(item.price_id)}>
                    Eliminar
                  </Button>
                ),
              ].filter(Boolean)}
            >
              <div className="pl-4 md:pl-6 flex gap-2">
                <Typography.Text>{item.name}</Typography.Text>
                {item.is_default && (
                  <Tag bordered={false} color="green">
                    Predeterminado
                  </Tag>
                )}
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        open={open}
        onClose={closeModal}
        title={form.getFieldValue('price_id') ? 'Editar precio' : 'Nuevo precio'}
        onCancel={closeModal}
        onOk={async () => {
          await onSave();
        }}
        width={340}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Typography.Text type="secondary">
          {form.getFieldValue('price_id')
            ? 'Al editar el tipo de precio, se actualizará en todos los productos que lo tengan asignado'
            : 'Una vez creado el tipo de precio, podrás asignarlo a tus productos'}
        </Typography.Text>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="company_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="price_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Este campo es requerido' }]}>
            <Input placeholder="Nombre del precio" onPressEnter={onSave} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PricesListPage;

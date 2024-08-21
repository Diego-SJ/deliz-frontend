import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { PlusCircleOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, List, Modal, Select, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import BreadcrumbSettings from '../../settings/menu/breadcrumb';
import CardRoot from '@/components/atoms/Card';
import { branchesActions } from '@/redux/reducers/branches';
import { Branch, CashRegister } from '@/redux/reducers/branches/type';
import useMediaQuery from '@/hooks/useMediaQueries';

const CashRegistersPage = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const [open, setOpen] = useState(false);
  const { cash_registers, branches } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
  const [options, setOptions] = useState<CashRegister[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const { isTablet } = useMediaQuery();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(branchesActions.getCashRegistersByCompanyId());
      setSelectedBranch(branches?.find(item => item.main_branch) || null);
      return;
    }
  }, [dispatch, branches]);

  useEffect(() => {
    setOptions(cash_registers?.filter(i => i?.branch_id === selectedBranch?.branch_id) || []);
  }, [cash_registers, selectedBranch]);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    form.resetFields();
    setOpen(false);
  };

  const onEdit = (data: CashRegister) => {
    form.setFieldValue('name', data.name);
    form.setFieldValue('is_default', data.is_default);
    form.setFieldValue('cash_register_id', data.cash_register_id);
    form.setFieldValue('branch_id', selectedBranch?.branch_id);
    openModal();
  };

  const onDelete = async (cash_register_id: string) => {
    modal.confirm({
      title: '¿Estás seguro de eliminar esta caja?',
      content: 'Una vez eliminada, no podrás recuperarla',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okType: 'danger',
      onOk: async () => {
        await dispatch(branchesActions.deleteCashRegister(cash_register_id));
        message.success('Caja eliminada correctamente');
      },
    });
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Cajas' }]} />

      <div className="flex flex-col mb-0 w-full">
        <Typography.Title level={4}>Cajas Registradoras</Typography.Title>

        <div className="flex justify-between md:items-center mb-3 flex-col md:flex-row gap-3">
          <Typography.Text type="secondary">
            Administra las cajas registradoras que tendrá cada una de tus sucursales
          </Typography.Text>
        </div>

        <div className="flex gap-4 mb-6">
          <Select
            value={selectedBranch?.branch_id}
            options={branches.map(item => ({ label: `Sucursal ${item.name}`, value: item.branch_id }))}
            onChange={branch_id => {
              const branch = branches.find(item => item.branch_id === branch_id);
              setSelectedBranch(branch || null);
            }}
            size={isTablet ? 'large' : 'middle'}
            placeholder="Selecciona una sucursal"
          />

          {permissions?.branches?.add_branch && (
            <Button icon={<PlusCircleOutlined />} onClick={openModal} size={isTablet ? 'large' : 'middle'}>
              Agregar nueva
            </Button>
          )}
        </div>
      </div>

      <CardRoot
        style={{ width: '100%' }}
        styles={{ body: { padding: 0 } }}
        title={`Cajas de la sucursal ${selectedBranch?.name || 'Principal'}`}
      >
        <List
          itemLayout="horizontal"
          footer={
            permissions?.branches?.add_branch ? (
              <div className="px-2">
                <Button type="text" icon={<PlusCircleOutlined />} className="text-primary" onClick={openModal}>
                  Agregar nueva
                </Button>
              </div>
            ) : null
          }
          className="px-0"
          dataSource={options}
          renderItem={item => (
            <List.Item
              styles={{ actions: { paddingRight: 15, margin: 0 } }}
              classNames={{ actions: 'flex' }}
              className="flex"
              actions={[
                permissions?.cash_registers?.edit_cash_register ? (
                  <Button type="link" onClick={() => onEdit(item)} className="w-min px-0">
                    Editar
                  </Button>
                ) : null,
                item?.is_default || !permissions?.cash_registers?.delete_cash_register ? null : (
                  <Button danger type="link" className="w-min px-0" onClick={() => onDelete(item.cash_register_id)}>
                    Eliminar
                  </Button>
                ),
              ].filter(Boolean)}
            >
              <div className="pl-4 md:pl-6 flex gap-4">
                <Typography.Text>Caja {item.name}</Typography.Text>
                {item.is_default && (
                  <Tag bordered={false} color="green">
                    Predeterminada
                  </Tag>
                )}
              </div>
            </List.Item>
          )}
        />
      </CardRoot>

      <Modal
        open={open}
        onClose={closeModal}
        title={form.getFieldValue('cash_register_id') ? 'Editar caja' : 'Nueva caja registradora'}
        onCancel={closeModal}
        onOk={async () => {
          await form
            .validateFields()
            .then(async values => {
              await dispatch(branchesActions.upsertCashRegister({ ...values, branch_id: selectedBranch?.branch_id }));

              form.resetFields();
              closeModal();
              message.success('Caja registrada correctamente');
            })
            .catch(() => {
              message.error('Por favor, completa los campos requeridos');
            });
        }}
        width={340}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Typography.Text type="secondary">
          {form.getFieldValue('cash_register_id')
            ? 'Edita el nombre de la caja registradora'
            : 'Una vez creada, podrás asignarla a una sucursal'}
        </Typography.Text>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="cash_register_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="is_default" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="branch_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Este campo es requerido' }]}>
            <Input prefix="Caja" placeholder="Mostrador 1" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CashRegistersPage;

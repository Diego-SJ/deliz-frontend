import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Branch, CashRegister } from '@/redux/reducers/branches/type';
import { userActions } from '@/redux/reducers/users';
import { Profile } from '@/redux/reducers/users/types';
import { ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { App, Button, Card, Form, Input, Select, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Permissions from './permissions/index';
import { PermissionsType } from './permissions/data-and-types';

const getCashRegisters = (branches: Branch[], cash_registers: CashRegister[], branchesIds: string[]) => {
  const selectedBranches = branches.filter(cr => branchesIds.includes(cr.branch_id));

  return selectedBranches.map(branch => {
    return {
      label: `Sucursal ${branch.name}`,
      title: branch?.name,
      options: cash_registers
        ?.filter(cr => cr.branch_id === branch.branch_id)
        .map(cr => ({
          label: `Caja ${cr.name}`,
          value: cr.cash_register_id,
        })),
    };
  });
};

const ManageUserProfile = () => {
  const mounted = useRef(false);
  const [form] = Form.useForm();
  const { profile_id } = useParams();
  const { branches, cash_registers } = useAppSelector(({ branches }) => branches);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [selectedCashRegisters, setSelectedCashRegisters] = useState<string[]>([]);
  const { modal } = App.useApp();
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [permissions, setPermissions] = useState<PermissionsType>({});

  const fetchDetails = async () => {
    setLoading(true);
    const data = await dispatch(userActions.fetchUser(profile_id!));
    const role = data?.role || 'ADMIN';
    form.setFieldsValue({ ...data, role });
    setSelectedRole(role);
    setPermissions(data?.permissions || {});
    setSelectedBranches(data?.branches || []);
    setSelectedCashRegisters(data?.cash_registers || []);
    setCurrentProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!!profile_id && !mounted.current) {
      mounted.current = true;
      fetchDetails();
    }
  }, [profile_id, mounted]);

  const confirmDeleteBranch = async () => {
    await dispatch(userActions.deleteUser(profile_id!));
    navigate(-1);
  };

  const onSubmit = async () => {
    setLoadingSave(true);
    await form
      .validateFields()
      .then(async values => {
        const newValues = { ...values, permissions };

        if (!profile_id) {
          const result = await dispatch(userActions.createUser(newValues));
          if (result) navigate(-1);
        } else {
          const result = await dispatch(userActions.updateProfile(newValues));

          form.setFieldsValue(result);
          setCurrentProfile(result);
          setPermissions(result?.permissions || {});
        }
      })
      .finally(() => setLoadingSave(false));
  };

  const onBranchesChange = (branches: string[]) => {
    setSelectedBranches(branches);
    form.setFieldsValue({ branches });

    if (!branches.length) {
      setSelectedCashRegisters([]);
      form.setFieldsValue({ cash_registers: [] });
    } else {
      const cashRegisters = cash_registers.filter(cr => branches.includes(cr.branch_id));
      setSelectedCashRegisters(cashRegisters.map(cr => cr.cash_register_id));
      form.setFieldsValue({ cash_registers: cashRegisters.map(cr => cr.cash_register_id) });
    }
  };

  return (
    <>
      <div className={`flex flex-col gap-2 p-4 min-h-[calc(100%-82px)] max-h-[calc(100%-82px)] overflow-auto`}>
        <div className="flex gap-4 max-w-[700px] mx-auto w-full">
          <Button icon={<ArrowLeftOutlined />} shape="circle" onClick={() => navigate(-1)} />
          <Typography.Title level={4}>{profile_id ? 'Actualizar perfil' : 'Registrar usuario'}</Typography.Title>
        </div>
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-4 max-w-[700px] mx-auto w-full"
          initialValues={{ role: 'ADMIN' }}
          autoComplete="off"
          validateMessages={{
            required: '${label} es obligatorio.',
          }}
        >
          <Form.Item name="profile_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="is_default" hidden>
            <Input />
          </Form.Item>
          <Card title="Información básica" className="shadow-md rounded-xl" loading={loading}>
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <Form.Item className="mb-0 w-full" name="first_name" label="Nombre(s)">
                <Input placeholder="Nombre(s)" onPressEnter={onSubmit} />
              </Form.Item>
              <Form.Item className="mb-0 w-full" name="last_name" label="Apellido(s)">
                <Input placeholder="Apellido(s)" onPressEnter={onSubmit} />
              </Form.Item>
            </div>
            <Form.Item className="w-full mb-4" name="phone" label="Teléfono">
              <Input placeholder="Teléfono" inputMode="tel" onPressEnter={onSubmit} />
            </Form.Item>
          </Card>

          <Card title="Credenciales" className="shadow-md rounded-xl" loading={loading}>
            <Typography.Paragraph className="!-mt-2 mb-2 text-slate-400 font-light">
              Con ellas el usuario podrá acceder al sistema
            </Typography.Paragraph>
            <div className="flex gap-6 mb-2 flex-col md:flex-row">
              <Form.Item
                className="mb-0 w-full"
                name="email"
                label="Correo"
                rules={[{ required: true, message: 'Ingresa un email válido', type: 'email' }]}
              >
                <Input
                  autoComplete="nope"
                  type="email"
                  inputMode="email"
                  placeholder="ejemplo@ejemplo.com"
                  onPressEnter={onSubmit}
                />
              </Form.Item>
              <Form.Item
                className="mb-0 w-full"
                name="password"
                label="Contraseña"
                rules={[{ required: true, message: 'Campo obligatorio' }]}
              >
                <Input.Password
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  placeholder="*******"
                  autoComplete="new-password"
                  onPressEnter={onSubmit}
                />
              </Form.Item>
            </div>
          </Card>

          <Card title="Permisos" className="shadow-md rounded-xl" loading={loading}>
            <Form.Item className="w-full" name="role" label="Tipo de usuario" tooltip="Selecciona el tipo de usuario">
              <Select
                placeholder="Selecciona la sucursal"
                options={[
                  { label: 'Administrador', value: 'ADMIN' },
                  { label: 'Cajero', value: 'CASHIER' },
                ]}
                onChange={value => setSelectedRole(value)}
              />
            </Form.Item>
            {selectedRole !== 'ADMIN' && (
              <>
                <Form.Item
                  className="w-full"
                  name="branches"
                  label="Sucursales"
                  tooltip="Selecciona las sucursales a las que el usuario tendrá acceso"
                  rules={[{ required: true, message: 'Selecciona al menos una sucursal' }]}
                >
                  <Select
                    mode="tags"
                    aria-autocomplete="none"
                    placeholder="Selecciona la sucursal"
                    options={branches.map(branch => ({ label: branch.name, value: branch.branch_id }))}
                    onChange={onBranchesChange}
                  />
                </Form.Item>
                <Form.Item
                  className="w-full"
                  name="cash_registers"
                  label="Cajas"
                  tooltip="Selecciona las cajas a las que el usuario tendrá acceso"
                  rules={[{ required: true, message: 'Selecciona al menos una caja' }]}
                >
                  <Select
                    mode="tags"
                    placeholder="Selecciona la sucursal"
                    value={selectedCashRegisters}
                    aria-autocomplete="none"
                    options={getCashRegisters(branches, cash_registers, selectedBranches)}
                    onChange={value => setSelectedCashRegisters(value)}
                  />
                </Form.Item>

                <Permissions value={permissions} onPermissionsChange={setPermissions} />
              </>
            )}
          </Card>
        </Form>

        {profile_id && !currentProfile?.is_default && (
          <Card title="Inhabilitar usuario" className="my-2 shadow-md rounded-xl max-w-[700px] mx-auto w-full">
            <div className="flex flex-col md:flex-row gap-5 md:gap-8 justify-between items-center">
              <Typography.Text type="danger">
                NOTA: Una vez eliminado, el usuario no podrá acceder al sistema ni realizar acciones.
              </Typography.Text>
              <Button
                ghost
                danger
                className="w-full md:max-w-40"
                onClick={() => {
                  modal.confirm({
                    title: 'Eliminar usuario',
                    type: 'warning',
                    okText: 'Aceptar',
                    onOk: confirmDeleteBranch,
                    okType: 'danger',
                    cancelText: 'Cancelar',
                    content: 'Una vez eliminado, el usuario no podrá acceder al sistema ni realizar acciones.',
                    footer: (_, { OkBtn, CancelBtn }) => (
                      <>
                        <CancelBtn />
                        <OkBtn />
                      </>
                    ),
                  });
                }}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        )}
      </div>
      <Card
        className="rounded-none box-border"
        classNames={{ body: 'w-full flex items-center' }}
        styles={{ body: { padding: '0px', height: '80px' } }}
      >
        <div className="flex justify-end gap-6 max-w-[700px] mx-auto w-full px-4 lg:px-0">
          <Button className="w-full md:w-40" onClick={() => navigate(-1)} loading={loadingSave}>
            Cancelar
          </Button>
          <Button type="primary" className="w-full md:w-40" onClick={onSubmit} loading={loadingSave}>
            Guardar
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ManageUserProfile;

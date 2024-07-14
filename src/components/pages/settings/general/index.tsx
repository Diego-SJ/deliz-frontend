import { Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import BreadcrumbSettings from '../menu/breadcrumb';
import LogoManagement from './logo-management';
import { Business } from '@/redux/reducers/app/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';
import { useTransition } from 'react';

const GeneralSettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [loading, startTransition] = useTransition();
  const { business } = useAppSelector(state => state.app);

  const onFinish = () => {
    startTransition(() => {
      form.validateFields().then(async (values: Business) => {
        await dispatch(appActions.business.upsertBusiness(values));
      });
    });
  };

  return (
    <>
      <div className={`flex flex-col gap-2 p-4 min-h-[calc(100%-82px)] max-h-[calc(100%-82px)] overflow-auto`}>
        <div className=" max-w-[700px] mx-auto w-full">
          <BreadcrumbSettings items={[{ label: 'General' }]} />
          <div className="flex gap-4 mb-2 w-full">
            <Typography.Title level={4}>Configuraciones generales</Typography.Title>
          </div>

          <Card
            style={{ width: '100%' }}
            title="Logo"
            className="shadow-md rounded-xl mb-4"
            classNames={{ header: 'bg-slate-100' }}
          >
            <LogoManagement />
          </Card>

          <Card style={{ width: '100%' }} title="Datos de tu negocio" className="shadow-md rounded-xl">
            <Form
              form={form}
              layout="vertical"
              initialValues={business}
              validateMessages={{ required: '${label} es obligatorio.', pattern: { mismatch: '${label} no es válido' } }}
            >
              <Form.Item name="business_id" hidden>
                <Input />
              </Form.Item>

              <Form.Item className="w-full" name="name" label="Nombre">
                <Input placeholder="Nombre de tu negocio" />
              </Form.Item>
              <div className="flex gap-6">
                <Form.Item className="w-full" name="phone" label="Teléfono">
                  <Input placeholder="Teléfono de tu negocio" />
                </Form.Item>
                <Form.Item
                  className="w-full"
                  name="email"
                  label="Correo electrónico"
                  rules={[{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }]}
                >
                  <Input placeholder="Correo electrónico de tu negocio" />
                </Form.Item>
              </div>
              <Form.Item className="mb-0 w-full" name="address" label="Dirección">
                <Input placeholder="Dirección de tu negocio" />
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
      <Card
        className="rounded-none box-border"
        classNames={{ body: 'w-full flex items-center' }}
        styles={{ body: { padding: '0px', height: '80px' } }}
      >
        <div className="flex justify-end gap-6 max-w-[700px] mx-auto w-full  px-4 lg:px-0">
          <Button className="w-full md:w-40" onClick={() => navigate(-1)} loading={loading}>
            Cancelar
          </Button>
          <Button type="primary" className="w-full md:w-40" onClick={onFinish} loading={loading}>
            Guardar
          </Button>
        </div>
      </Card>
    </>
  );
};

export default GeneralSettingsPage;

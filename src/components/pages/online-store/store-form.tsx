import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { CopyOutlined, ExportOutlined } from '@ant-design/icons';
import {
  App,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  GetProp,
  Input,
  Row,
  Select,
  Switch,
  TimePicker,
  Typography,
} from 'antd';
import LogoManagement from './logo-management';
import CardRoot from '@/components/atoms/Card';
import FormItem from 'antd/es/form/FormItem';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storesActions } from '@/redux/reducers/stores';
import { STATUS_DATA } from '@/constants/status';
import { getStoreRecord } from '@/utils/stores';
import dayjs, { Dayjs } from 'dayjs';
import { ModuleAccess } from '@/routes/module-access';

const storeUrl = 'https://posiffy.store';
const timeFormat = 'HH:mm';

const transformTime = (time?: string): Dayjs | null => {
  return time ? dayjs(time, timeFormat) : null;
};

const StoreForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { store, loading } = useAppSelector(({ stores }) => stores);
  const { prices_list } = useAppSelector(({ branches }) => branches);
  const { company } = useAppSelector(({ app }) => app);
  const { profile } = useAppSelector(({ users }) => users?.user_auth);
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([]);
  const [showPricesInCatalog, setSetshowPricesInCatalog] = useState(true);
  const [scheduleChecks, setScheduleChecks] = useState<string[]>([
    'monday_closed',
    'tuesday_closed',
    'wednesday_closed',
    'thursday_closed',
    'friday_closed',
    'saturday_closed',
    'sunday_closed',
  ]);
  const { schedule, delivery_types } = store || {};

  useEffect(() => {
    setDeliveryOptions(Object.entries(delivery_types || {})?.map(([key, value]) => (value ? key : '')) || []);
    setScheduleChecks(
      Object.entries(schedule || {})?.map(([key, value]) =>
        value?.closed || (!value?.from && !value?.to) ? `${key}_closed` : '',
      ) || [],
    );
    form.setFieldsValue({
      monday_time: [transformTime(schedule?.monday?.from), transformTime(schedule?.monday?.to)],
      tuesday_time: [transformTime(schedule?.tuesday?.from), transformTime(schedule?.tuesday?.to)],
      wednesday_time: [transformTime(schedule?.wednesday?.from), transformTime(schedule?.wednesday?.to)],
      thursday_time: [transformTime(schedule?.thursday?.from), transformTime(schedule?.thursday?.to)],
      friday_time: [transformTime(schedule?.friday?.from), transformTime(schedule?.friday?.to)],
      saturday_time: [transformTime(schedule?.saturday?.from), transformTime(schedule?.saturday?.to)],
      sunday_time: [transformTime(schedule?.sunday?.from), transformTime(schedule?.sunday?.to)],
    });
  }, [delivery_types, schedule]);

  const openStore = () => {
    window.open(`${storeUrl}/${store?.slug}`, '_blank');
  };

  const onChangeDeliveryType: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    setDeliveryOptions(checkedValues as string[]);
  };

  const onDayChange = (day: string) => {
    setScheduleChecks((prev) => {
      if (prev.includes(day)) {
        return prev.filter((item) => item !== day);
      }
      return [...prev, day];
    });
  };

  const inactiveStore = () => {
    modal.confirm({
      title: '¿Estás seguro de desactivar tu tienda?',
      content:
        'Si desactivas tu tienda, tus clientes no podrán ver tu catálogo en línea. Puedes activarla nuevamente en cualquier momento.',
      onOk: () => {
        dispatch(
          storesActions.updateStore({
            status_id: STATUS_DATA.HIDDEN.id,
            store_id: store?.store_id,
          }),
        );
      },
      okText: 'Desactivar',
      okType: 'danger',
      cancelText: 'Cancelar',
    });
  };

  const onSubmit = () => {
    if (!profile?.permissions?.online_store?.edit_online_store?.value) return;

    form
      .validateFields()
      .then(async (values) => {
        const dataStore = {
          ...values,
          store_id: store?.store_id,
          company_id: company?.company_id,
          deliveryOptions,
          scheduleChecks,
          logo_url: store?.logo_url,
          default_price: showPricesInCatalog ? values.default_price : null,
        };
        await dispatch(storesActions.updateStore(getStoreRecord(dataStore)));
        message.success('Tienda actualizada correctamente');
      })
      .catch((error) => {
        console.log(error);
        message.error('Por favor completa los campos requeridos');
      });
  };

  return (
    <>
      <section
        className={`p-4 w-full max-w-[700px] mx-auto flex flex-col gap-5 ${
          profile?.permissions?.online_store?.edit_online_store?.value ? 'min-h-[calc(100dvh-144px)]' : ''
        } ${profile?.permissions?.online_store?.edit_online_store?.value ? 'max-h-[calc(100dvh-144px)]' : ''} overflow-auto`}
      >
        <CardRoot>
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-2 items-center">
              <Typography.Title level={5} className="!m-0">
                Catálogo en linea{' '}
              </Typography.Title>
              <Badge status="success" text="Activo" />
            </div>

            <Button type="primary" className="" icon={<ExportOutlined />} onClick={openStore}>
              Visitar
            </Button>
          </div>
        </CardRoot>
        <Form
          form={form}
          initialValues={{
            ...store,
            name: store?.name || company?.name,
            email: store?.email || company?.email,
            phone: store?.phone || company?.phone,
            facebook: store?.social_media?.facebook,
            instagram: store?.social_media?.instagram,
            whatsapp: store?.social_media?.whatsapp,
          }}
          layout="vertical"
          className="w-full"
        >
          <CardRoot title="Links" className="mb-5">
            <div className="flex gap-5 items-center w-full">
              <Form.Item
                label="Edita la URL de tu negocio"
                name="slug"
                className="!w-full"
                rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
              >
                <Input addonBefore={storeUrl + '/'} className="!w-full" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(`${storeUrl}/${store?.slug}/store`);
                  message.success('Link copiado al portapapeles');
                }}
              >
                Link del catálogo
              </Button>
              <ModuleAccess moduleName="landing_page">
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(`${storeUrl}/${store?.slug}`);
                    message.success('Link copiado al portapapeles');
                  }}
                >
                  Link de la landing page
                </Button>
              </ModuleAccess>
            </div>
          </CardRoot>

          <CardRoot title="Tu Marca" className="mb-5">
            <LogoManagement />
            <Form.Item
              label="Título del catálogo"
              name="name"
              rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
            >
              <Input placeholder={company.name} />
            </Form.Item>
            <Form.Item
              label="Descripción del catálogo"
              name="description"
              rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
            >
              <Input.TextArea placeholder="¡Cuentanos sobre tu negocio!" maxLength={70} showCount />
            </Form.Item>
          </CardRoot>

          <CardRoot title="Contacto" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 ">
              <Form.Item label="Correo" name="email" className="w-full">
                <Input type="email" inputMode="email" placeholder="ejemplo@email.com" />
              </Form.Item>
              <Form.Item
                label="Teléfono"
                name="phone"
                className="w-full"
                rules={[{ pattern: /^[0-9]*$/, message: 'Solo se permiten números' }]}
                tooltip="Teléfono al cual tus clientes podrán realizar llamadas"
              >
                <Input maxLength={10} inputMode="tel" placeholder="Ingresa tu teléfono" />
              </Form.Item>
            </div>
            <Form.Item
              label="Ubicación"
              name="location_url"
              className="w-full"
              tooltip="Link de Google Maps para que tus clientes puedan encontrarte"
              rules={[
                {
                  pattern:
                    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
                  message: 'Ingresa un link válido',
                },
              ]}
            >
              <Input type="url" inputMode="url" placeholder="https://maps.app.goo.gl/minegocio" />
            </Form.Item>
          </CardRoot>

          <CardRoot title="Redes Sociales" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
              <Form.Item
                label="Link de Facebook"
                name="facebook"
                className="w-full"
                rules={[
                  {
                    pattern: /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/,
                    message: 'Ingresa un link válido',
                  },
                ]}
              >
                <Input type="url" inputMode="url" placeholder="https://www.facebook.com/minegocio" />
              </Form.Item>
              <Form.Item
                label="Link de Instagram"
                name="instagram"
                className="w-full"
                rules={[
                  {
                    pattern: /^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9(\.\?)?]/,
                    message: 'Ingresa un link válido',
                  },
                ]}
              >
                <Input type="url" inputMode="url" placeholder="https://www.instagram.com/minegocio" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
              <Form.Item
                label="Número de WhatsApp"
                name="whatsapp"
                className="w-full"
                rules={[{ pattern: /^[0-9]*$/, message: 'Solo se permiten números' }]}
              >
                <Input inputMode="tel" placeholder="Ingresa tu número de WhatsApp" />
              </Form.Item>
            </div>
          </CardRoot>

          <CardRoot title="Productos" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
              <div className="flex flex-col">
                <Form.Item label="Mostrar precios en el catálogo" className="w-full">
                  <Switch onChange={setSetshowPricesInCatalog} checked={showPricesInCatalog} />
                </Form.Item>
                {showPricesInCatalog && (
                  <Form.Item
                    label="Selecciona el precio que se mostrará en tu catálogo"
                    name="default_price"
                    className="w-full"
                  >
                    <Select
                      placeholder="Selecciona un precio"
                      options={prices_list?.map((price) => ({ value: price.price_id, label: price.name }))}
                    />
                  </Form.Item>
                )}
              </div>
              <ModuleAccess moduleName="orders_by_whatsapp">
                <Form.Item
                  label="Permitir pedidos a través de WhatsApp"
                  name="allow_orders_by_whatsapp"
                  className="w-full"
                >
                  <Switch />
                </Form.Item>
              </ModuleAccess>
            </div>
          </CardRoot>

          <CardRoot title="Atención Al Cliente" className="mb-5">
            <Checkbox.Group style={{ width: '100%' }} value={deliveryOptions} onChange={onChangeDeliveryType}>
              <Row>
                <Col span={8}>
                  <Checkbox value="on_site">En sitio</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="take_away">Para llevar</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="home_delivery">A domicilio</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </CardRoot>

          <CardRoot title="Horarios De Atención" className="mb-0">
            <div className="grid grid-cols-[1fr_1fr_2fr] border-b py-3 mb-5">
              <Typography.Paragraph className="!m-0">Día</Typography.Paragraph>
              <Typography.Paragraph className="!m-0">Cerrado</Typography.Paragraph>
              <Typography.Paragraph className="!m-0">Horario</Typography.Paragraph>
            </div>
            <div className="grid grid-cols-[1fr_1fr_2fr] place-items-center gap-y-5">
              <Typography.Paragraph className="!m-0 !w-full text-start">Lunes</Typography.Paragraph>
              <FormItem name="monday_closed" className="!m-0 w-full ">
                <Switch
                  className="mr-auto"
                  size="small"
                  checked={!!scheduleChecks.includes('monday_closed')}
                  onChange={() => onDayChange('monday_closed')}
                />
              </FormItem>
              <FormItem name="monday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  disabled={!!scheduleChecks.includes('monday_closed')}
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  needConfirm={true}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Martes</Typography.Paragraph>
              <FormItem name="tuesday_closed" className="!m-0 w-full">
                <Switch
                  className="mr-auto"
                  size="small"
                  checked={scheduleChecks.includes('tuesday_closed')}
                  onChange={() => onDayChange('tuesday_closed')}
                />
              </FormItem>
              <FormItem name="tuesday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  needConfirm={true}
                  disabled={scheduleChecks.includes('tuesday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Miércoles</Typography.Paragraph>
              <FormItem name="wednesday_closed" className="!m-0 w-full">
                <Switch
                  className="mr-auto"
                  size="small"
                  checked={scheduleChecks.includes('wednesday_closed')}
                  onChange={() => onDayChange('wednesday_closed')}
                />
              </FormItem>
              <FormItem name="wednesday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  needConfirm={true}
                  disabled={scheduleChecks.includes('wednesday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Jueves</Typography.Paragraph>
              <FormItem name="thursday_closed" className="!m-0 w-full">
                <Switch
                  className="mr-auto"
                  size="small"
                  checked={scheduleChecks.includes('thursday_closed')}
                  onChange={() => onDayChange('thursday_closed')}
                />
              </FormItem>
              <FormItem name="thursday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  needConfirm={true}
                  disabled={scheduleChecks.includes('thursday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Viernes</Typography.Paragraph>
              <FormItem name="friday_closed" className="!m-0 w-full">
                <Switch
                  className="mr-auto"
                  size="small"
                  checked={scheduleChecks.includes('friday_closed')}
                  onChange={() => onDayChange('friday_closed')}
                />
              </FormItem>
              <FormItem name="friday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  needConfirm={true}
                  disabled={scheduleChecks.includes('friday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Sábado</Typography.Paragraph>
              <FormItem name="saturday_closed" className="!m-0 w-full">
                <Switch
                  className="mr-auto"
                  size="small"
                  checked={scheduleChecks.includes('saturday_closed')}
                  onChange={() => onDayChange('saturday_closed')}
                />
              </FormItem>
              <FormItem name="saturday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  needConfirm={true}
                  disabled={scheduleChecks.includes('saturday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Domingo</Typography.Paragraph>
              <FormItem name="sunday_closed" className="!m-0 w-full">
                <Switch
                  className="mr-auto"
                  size="small"
                  checked={scheduleChecks.includes('sunday_closed')}
                  onChange={() => onDayChange('sunday_closed')}
                />
              </FormItem>
              <FormItem name="sunday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  needConfirm={true}
                  disabled={scheduleChecks.includes('sunday_closed')}
                />
              </FormItem>
            </div>
          </CardRoot>
        </Form>

        {profile?.permissions?.online_store?.edit_online_store?.value && (
          <CardRoot title="Desactivar Tienda" className="mb-10">
            <Typography.Paragraph>
              Si desactivas tu tienda, tus clientes no podrán ver tu catálogo en línea. Puedes activarla nuevamente en
              cualquier momento.
            </Typography.Paragraph>

            <Button type="primary" danger onClick={inactiveStore}>
              Desactivar Tienda
            </Button>
          </CardRoot>
        )}
      </section>

      {profile?.permissions?.online_store?.edit_online_store?.value && (
        <Card
          className="rounded-none box-border w-full border-none !border-t border-slate-200"
          classNames={{ body: 'w-full flex items-center' }}
          styles={{ body: { padding: '0px', height: '80px' } }}
        >
          <div className="flex justify-end gap-6 max-w-[700px] mx-auto w-full  px-4 lg:px-0">
            <Button className="w-full md:w-40" onClick={() => navigate(-1)} loading={loading}>
              Cancelar
            </Button>
            <Button type="primary" className="w-full md:w-40" onClick={onSubmit} loading={loading}>
              Guardar
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default StoreForm;

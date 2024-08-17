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
  Switch,
  TimePicker,
  Tooltip,
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
  const { company } = useAppSelector(({ app }) => app);
  const { profile } = useAppSelector(({ users }) => users?.user_auth);
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([]);
  const [scheduleChecks, setScheduleChecks] = useState<string[]>([]);

  useEffect(() => {
    setDeliveryOptions(Object.entries(store?.delivery_types || {})?.map(([key, value]) => (value ? key : '')) || []);
    setScheduleChecks(Object.entries(store?.schedule || {})?.map(([key, value]) => (value?.closed ? `${key}_closed` : '')) || []);
    form.setFieldsValue({
      monday_time: [transformTime(store?.schedule?.monday?.from), transformTime(store?.schedule?.monday?.to)],
      tuesday_time: [transformTime(store?.schedule?.tuesday?.from), transformTime(store?.schedule?.tuesday?.to)],
      wednesday_time: [transformTime(store?.schedule?.wednesday?.from), transformTime(store?.schedule?.wednesday?.to)],
      thursday_time: [transformTime(store?.schedule?.thursday?.from), transformTime(store?.schedule?.thursday?.to)],
      friday_time: [transformTime(store?.schedule?.friday?.from), transformTime(store?.schedule?.friday?.to)],
      saturday_time: [transformTime(store?.schedule?.saturday?.from), transformTime(store?.schedule?.saturday?.to)],
      sunday_time: [transformTime(store?.schedule?.sunday?.from), transformTime(store?.schedule?.sunday?.to)],
    });
  }, [store]);

  const openStore = () => {
    window.open(`${storeUrl}/${store?.slug}`, '_blank');
  };

  const onChangeDeliveryType: GetProp<typeof Checkbox.Group, 'onChange'> = checkedValues => {
    setDeliveryOptions(checkedValues as string[]);
  };

  const onDayChange = (day: string) => {
    setScheduleChecks(prev => {
      if (prev.includes(day)) {
        return prev.filter(item => item !== day);
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
        dispatch(storesActions.updateStore({ status_id: STATUS_DATA.HIDDEN.id, store_id: store?.store_id }));
      },
      okText: 'Desactivar',
      okType: 'danger',
      cancelText: 'Cancelar',
    });
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        const dataStore = {
          ...values,
          store_id: store?.store_id,
          company_id: company?.company_id,
          deliveryOptions,
          scheduleChecks,
          logo_url: store?.logo_url,
        };
        await dispatch(storesActions.updateStore(getStoreRecord(dataStore)));
        message.success('Tienda actualizada correctamente');
      })
      .catch(() => {
        message.error('Por favor completa los campos requeridos');
      });
  };

  return (
    <>
      <section className="p-4 w-full max-w-[700px] mx-auto flex flex-col gap-5 min-h-[calc(100dvh-144px)] max-h-[calc(100dvh-144px)] overflow-auto">
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
          }}
          requiredMark={false}
          layout="vertical"
          className="w-full"
        >
          <CardRoot title="Link De Tu Catálogo" className="mb-5">
            <div className="flex gap-5 items-center w-full">
              <Form.Item
                label="Comparte tu catálogo con este link"
                name="slug"
                className="!w-full"
                rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
              >
                <Input addonBefore={storeUrl + '/'} className="!w-full" />
              </Form.Item>
              <Tooltip title="Copiar">
                <Button
                  icon={<CopyOutlined />}
                  className="w-full -mb-1"
                  onClick={() => {
                    navigator.clipboard.writeText(storeUrl + '/' + form.getFieldValue('slug'));
                    message.success('Link copiado al portapapeles');
                  }}
                />
              </Tooltip>
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
              <FormItem name="monday_closed" className="!m-0 w-full">
                <Switch
                  className="mr-auto"
                  size="small"
                  value={form.getFieldValue('monday_closed')}
                  onChange={value => onDayChange('monday_closed')}
                />
              </FormItem>
              <FormItem name="monday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  disabled={form.getFieldValue('monday_closed')}
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Martes</Typography.Paragraph>
              <FormItem name="tuesday_closed" className="!m-0 w-full">
                <Switch className="mr-auto" size="small" onChange={value => onDayChange('tuesday_closed')} />
              </FormItem>
              <FormItem name="tuesday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  disabled={scheduleChecks.includes('tuesday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Miércoles</Typography.Paragraph>
              <FormItem name="wednesday_closed" className="!m-0 w-full">
                <Switch className="mr-auto" size="small" onChange={value => onDayChange('wednesday_closed')} />
              </FormItem>
              <FormItem name="wednesday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  disabled={scheduleChecks.includes('wednesday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Jueves</Typography.Paragraph>
              <FormItem name="thursday_closed" className="!m-0 w-full">
                <Switch className="mr-auto" size="small" onChange={value => onDayChange('thursday_closed')} />
              </FormItem>
              <FormItem name="thursday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  disabled={scheduleChecks.includes('thursday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Viernes</Typography.Paragraph>
              <FormItem name="friday_closed" className="!m-0 w-full">
                <Switch className="mr-auto" size="small" onChange={value => onDayChange('friday_closed')} />
              </FormItem>
              <FormItem name="friday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  disabled={scheduleChecks.includes('friday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Sábado</Typography.Paragraph>
              <FormItem name="saturday_closed" className="!m-0 w-full">
                <Switch className="mr-auto" size="small" onChange={value => onDayChange('saturday_closed')} />
              </FormItem>
              <FormItem name="saturday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  disabled={scheduleChecks.includes('saturday_closed')}
                />
              </FormItem>

              <Typography.Paragraph className="!m-0 !w-full text-start">Domingo</Typography.Paragraph>
              <FormItem name="sunday_closed" className="!m-0 w-full">
                <Switch className="mr-auto" size="small" onChange={value => onDayChange('sunday_closed')} />
              </FormItem>
              <FormItem name="sunday_time" className="!m-0 w-full">
                <TimePicker.RangePicker
                  format={timeFormat}
                  placeholder={['Desde', 'Hasta']}
                  className="w-full"
                  disabled={scheduleChecks.includes('sunday_closed')}
                />
              </FormItem>
            </div>
          </CardRoot>
        </Form>

        <CardRoot title="Desactivar Tienda" className="mb-10">
          <Typography.Paragraph>
            Si desactivas tu tienda, tus clientes no podrán ver tu catálogo en línea. Puedes activarla nuevamente en cualquier
            momento.
          </Typography.Paragraph>

          <Button type="primary" danger onClick={inactiveStore}>
            Desactivar Tienda
          </Button>
        </CardRoot>
      </section>

      {profile?.permissions?.products?.show_in_catalog && (
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

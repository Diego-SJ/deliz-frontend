import { Avatar, Button, Form, Input, Select, Typography } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';

const StepOne = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { step = 1, ...onboardingValues } = useAppSelector(({ app }) => app.onboarding);
  const { loading } = useAppSelector(({ app }) => app);

  const handlePreviousStep = () => {
    dispatch(appActions.setOnboarding({ step: step - 1 }));
  };

  const handleOnFinish = async () => {
    form.validateFields().then(async values => {
      await dispatch(appActions.updateOnboarding({ step: step + 1, ...values }));
    });
  };

  return (
    <>
      <div className="flex flex-col items-center  px-6 min-h-[calc(100dvh-135px)] max-h-[calc(100dvh-135px)] overflow-y-scroll py-8">
        <Avatar
          icon={<RocketOutlined className="text-primary text-3xl" />}
          shape="square"
          className="bg-primary/10 !rounded-2xl min-h-14 w-14"
        />
        <Typography.Title level={3} className="!mb-1 !mt-2">
          ¡Configura tu tienda!
        </Typography.Title>
        <Typography.Text type="secondary" className="mb-5 md:mb-10">
          Ayudanos a configurar tu tienda
        </Typography.Text>

        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
          initialValues={onboardingValues}
          onFinish={handleOnFinish}
          className="grid grid-cols-1 md:grid-cols-2 md:gap-4 w-full max-w-[600px] mx-auto mt-4"
        >
          <Form.Item label="Nombre(s)" name="owner_name" rules={[{ required: true, message: 'Campo obligatorio' }]}>
            <Input size="large" placeholder="Nombre(s)" />
          </Form.Item>
          <Form.Item label="Apellido(s)" name="owner_last_name" rules={[{ required: true, message: 'Campo obligatorio' }]}>
            <Input size="large" placeholder="Apellido(s)" />
          </Form.Item>

          <Form.Item label="Nombre de tu negocio" name="business_name" rules={[{ required: true, message: 'Campo obligatorio' }]}>
            <Input size="large" placeholder="Nombre(s)" />
          </Form.Item>
          <Form.Item label="Nicho del negocio" name="business_niche" rules={[{ required: true, message: 'Campo obligatorio' }]}>
            <Select
              size="large"
              placeholder="Selecciona un nicho"
              virtual={false}
              options={[
                { label: 'Alimentos y bebidas', value: 'food' },
                { label: 'Moda y Estilo de Vida', value: 'fashion_lifestyle' },
                { label: 'Tecnología y Servicios Digitales', value: 'technology' },
                { label: 'Hogar y jardín', value: 'home' },
                { label: 'Salud, belleza y bienestar', value: 'health' },
                { label: 'E-commerce', value: 'ecommerce' },
                { label: 'Educación y Capacitación', value: 'education' },

                { label: 'Turismo y Hospitalidad', value: 'tourism' },

                { label: 'Sustentabilidad y Medio Ambiente', value: 'sustainability' },

                { label: 'Servicios Financieros y Legales', value: 'financial_services' },
                { label: 'Mascotas', value: 'pets' },
                { label: 'Deportes y Fitness', value: 'sports' },
                { label: 'Arte y Cultura', value: 'art' },
                { label: 'Entretenimiento', value: 'entertainment' },
                { label: 'Otros', value: 'other' },
              ]}
            />
          </Form.Item>
        </Form>
      </div>

      <footer className="h-[70px] flex justify-center items-center px-6 mt-auto border-t">
        <div className="max-w-[700px] mx-auto flex w-full justify-between gap-6">
          {step > 1 ? (
            <Button size="large" type="default" className="w-full max-w-40" onClick={handlePreviousStep} loading={loading}>
              Anterior
            </Button>
          ) : (
            <span />
          )}
          {step <= 3 && (
            <Button size="large" type="primary" className="w-full max-w-40" onClick={handleOnFinish} loading={loading}>
              {step === 3 ? 'Finalizar' : 'Siguiente'}
            </Button>
          )}
        </div>
      </footer>
    </>
  );
};

export default StepOne;

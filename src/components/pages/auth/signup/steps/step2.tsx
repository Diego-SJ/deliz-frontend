import { Avatar, Button, Form, InputNumber, Select, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';
import { useState } from 'react';

const StepTwo = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(({ app }) => app);
  const { step = 1, ...onboardingValues } = useAppSelector(({ app }) => app.onboarding);
  const [isEcommerce, setIsEcommerce] = useState(onboardingValues?.is_ecommerce ?? true);

  const handlePreviousStep = () => {
    dispatch(appActions.setOnboarding({ step: step - 1 }));
  };

  const handleOnFinish = async () => {
    form.validateFields().then(async values => {
      await dispatch(appActions.updateOnboarding({ step: step + 1, ...{ ...values, no_branches: values?.no_branches || 1 } }));
    });
  };

  return (
    <>
      <div className="flex flex-col items-center  px-6 min-h-[calc(100dvh-135px)] max-h-[calc(100dvh-135px)] overflow-y-scroll py-8">
        <Avatar
          icon={<ShopOutlined className="text-primary text-3xl" />}
          shape="square"
          className="bg-primary/10 !rounded-2xl min-h-14 w-14"
        />
        <Typography.Title level={3} className="!mb-1 !mt-2">
          Cuentanos sobre tu negocio
        </Typography.Title>
        <Typography.Text type="secondary" className="mb-5 md:mb-10 text-center">
          Ayudanos a conocer más sobre tu negocio para brindarte la mejor experiencia
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
          <Form.Item
            label="¿Cuentas con una tienda física"
            name="is_ecommerce"
            rules={[{ required: true, message: 'Campo obligatorio' }]}
          >
            <Select
              size="large"
              placeholder="Selecciona una opción"
              virtual={false}
              options={[
                { label: 'Si', value: false },
                { label: 'No', value: true },
              ]}
              onChange={value => setIsEcommerce(value)}
            />
          </Form.Item>

          {!isEcommerce && (
            <Form.Item
              label="¿Cuantas sucursales tienes?"
              name="no_branches"
              rules={[{ required: true, message: 'Campo obligatorio' }]}
            >
              <InputNumber className="w-full" size="large" placeholder="Ingresa el número de sucursales" min={1} />
            </Form.Item>
          )}

          <Form.Item
            label="Colaboradores que usarán el sistema"
            name="no_employees"
            rules={[{ required: true, message: 'Campo obligatorio' }]}
          >
            <Select
              size="large"
              placeholder="Selecciona una opción"
              virtual={false}
              options={[
                { label: 'Entre 1 y 2', value: '1-2' },
                { label: 'Entre 3 y 5', value: '3-5' },
                { label: 'Entre 6 y 10', value: '6-10' },
                { label: 'Más de 10', value: '10+' },
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

export default StepTwo;

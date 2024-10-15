import { APP_ROUTES } from '@/routes/routes';
import { App, Avatar, Button, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/atoms/AnimatedBackground';
import { useState } from 'react';
import { userActions } from '@/redux/reducers/users';
import { useAppDispatch } from '@/hooks/useStore';
import PosiffyWebp from '@/assets/logo-color.svg';
import DevicesWebp from '@/assets/webp/devices.webp';

const SignInAdmin = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');

  const handleOnFinish = async () => {
    form.validateFields().then(async (values) => {
      if (values?.invitation_code !== 'MVP2024') {
        message.error('Código de invitación incorrecto');
        return;
      }

      setLoading(true);
      await dispatch(userActions.signUp(values));
      setLoading(false);
    });
  };

  const handleChange = (value: string) => {
    if (!isNaN(Number(value)) || value === '') {
      setWhatsappNumber(value);
    }
  };

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] flex">
      <AnimatedBackground />
      <div className="flex flex-col justify-center items-center w-full md:w-[50%] lg:w-[40%] p-10 bg-white z-10 shadow-lg">
        <Form
          form={form}
          name="basic"
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
          onFinish={handleOnFinish}
          className="w-full max-w-[400px] mx-auto"
        >
          <Avatar
            src={PosiffyWebp}
            size={68}
            className="!p-2 mx-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
          <Typography.Title level={2} className="!mb-1">
            ¡Registrate!
          </Typography.Title>
          <Typography.Paragraph type="secondary" className="caption !mb-5">
            ¿Ya tienes una cuenta?{' '}
            <span
              className="text-primary cursor-pointer"
              onClick={() => navigate(APP_ROUTES.AUTH.SIGN_IN_ADMIN.path)}
            >
              Inicia sesión
            </span>
          </Typography.Paragraph>
          <Form.Item
            label="Correo"
            name="email"
            rules={[{ required: true, message: 'Ingresa un correo válido' }]}
          >
            <Input size="large" placeholder="email@ejemplo.com" />
          </Form.Item>

          <Form.Item
            label="Número de WhatsApp"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa un número válido',
                pattern: /^[0-9]{10}$/,
                min: 10,
                max: 10,
              },
            ]}
          >
            <Input
              className="w-full"
              prefix="+52"
              value={whatsappNumber}
              onChange={({ target }) => handleChange(target.value)}
              size="large"
              inputMode="tel"
              placeholder="Whatsapp"
              min={0}
              minLength={10}
              maxLength={10}
            />
          </Form.Item>
          <Form.Item
            className="!mb-9"
            label="Contraseña"
            name="password"
            rules={[
              {
                required: true,
                message: 'Ingresa una contraseña válida',
                min: 6,
              },
            ]}
          >
            <Input.Password size="large" placeholder="contraseña" />
          </Form.Item>
          <Form.Item
            className="!mb-9"
            label="Código de invitación"
            name="invitation_code"
            rules={[
              {
                required: true,
                message: 'Ingresa un código de invitación válido',
              },
            ]}
          >
            <Input size="large" placeholder="Código de invitación" />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              Registrarme
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="md:w-[50%] lg:w-[60%]  items-center justify-center hidden md:inline-flex ">
        <img
          src={DevicesWebp}
          alt="ecoomerce web"
          className="w-[80%] z-10 drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default SignInAdmin;

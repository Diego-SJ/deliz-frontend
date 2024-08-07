import { APP_ROUTES } from '@/routes/routes';
import { App, Button, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/atoms/AnimatedBackground';
import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { userActions } from '@/redux/reducers/users';
import { useAppDispatch } from '@/hooks/useStore';
import PosiffyWebp from '@/assets/logo-color.svg';

const SignInAdmin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const handleOnFinish = async (values: any) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setLoading(false);
      return message.error(error?.message ?? 'No se pudo iniciar sesión.');
    }

    if (data) {
      const profileSuccess = await dispatch(userActions.loginSuccess(data.user.id));
      if (profileSuccess === true) {
        setLoading(false);
        message.success('¡Bienvenido!');
        navigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path, { replace: true });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] flex justify-center items-center">
      <AnimatedBackground />

      <div className="flex w-full min-h-[100dvh] max-h-[100dvh] bg-white sm:bg-primary items-center sm:min-h-[auto] sm:max-h-[auto] sm:max-w-[400px]  md:max-w-[800px] mx-auto my-auto rounded-3xl z-10 shadow-lg overflow-hidden">
        <div className="flex flex-col w-full p-10 bg-white">
          <Form
            form={form}
            name="basic"
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
            onFinish={handleOnFinish}
            className="text-center"
          >
            <img src={PosiffyWebp} alt="posiffy" className="w-20 mb-6 mx-auto" onClick={() => navigate('/')} />
            <Typography.Title level={2}>Inicio de sesión</Typography.Title>
            <Form.Item label="Correo" name="email" rules={[{ required: true, message: 'Por favor ingresa un correo válido' }]}>
              <Input size="large" placeholder="email@ejemplo.com" />
            </Form.Item>
            <Form.Item
              className="!mb-9"
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Ingresa una contraseña válida' }]}
            >
              <Input.Password size="large" placeholder="contraseña" />
            </Form.Item>
            {/* <Button type="link">Recuperar contraseña</Button> */}
            <Form.Item>
              <Button block type="primary" htmlType="submit" size="large" loading={loading}>
                Ingresar
              </Button>
            </Form.Item>
            {/* <Typography.Paragraph type="secondary" className="caption">
              ¿No tienes una cuenta?{' '}
              <Button type="link" href={APP_ROUTES.AUTH.SIGN_UP.path}>
                Registrate
              </Button>
            </Typography.Paragraph> */}
          </Form>
        </div>

        <div className="w-full  items-center justify-center hidden md:inline-flex ">
          <img src="src/assets/img/svg/ecommerce-web.svg" alt="ecoomerce web" className="w-[80%]" />
        </div>
      </div>
    </div>
  );
};

export default SignInAdmin;

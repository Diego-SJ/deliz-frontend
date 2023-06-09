import { APP_ROUTES } from '@/constants/routes';
import { Button, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FormContainer, LayoutContent } from './styles';
import AnimatedBackground from '@/components/atoms/AnimatedBackground';
import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { useDispatch } from 'react-redux';
import { userActions } from '@/redux/reducers/users';
import { UserAuth } from '@/redux/reducers/users/types';

const SignInAdmin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleOnFinish = async (values: any) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setLoading(false);

    if (error) return message.error(error?.message ?? 'No se pudo iniciar sesión.');

    if (data) {
      message.success('¡Bienvenido!');
      await dispatch(userActions.setUserAuth(data as UserAuth));
      navigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path, { replace: true });
    }
  };

  return (
    <LayoutContent>
      <AnimatedBackground />
      <FormContainer className="form-container">
        <Form form={form} name="basic" autoComplete="off" layout="vertical" requiredMark={false} onFinish={handleOnFinish}>
          <Typography.Title level={2}>Panel de administración</Typography.Title>
          <Form.Item label="Correo" name="email" rules={[{ required: true, message: 'Por favor ingresa un correo válido' }]}>
            <Input size="large" placeholder="email@ejemplo.com" />
          </Form.Item>
          <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Ingresa una contraseña válida' }]}>
            <Input.Password size="large" placeholder="contraseña" />
          </Form.Item>
          <Button type="link">Recuperar contraseña</Button>
          <Form.Item style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>
    </LayoutContent>
  );
};

export default SignInAdmin;

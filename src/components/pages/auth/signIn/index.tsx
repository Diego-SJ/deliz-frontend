import { APP_ROUTES } from '@/routes/routes';
import { GoogleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FormContainer, FormFigure, FormFigureImg, LayoutContent } from './styles';
import AnimatedBackground from '@/components/atoms/AnimatedBackground';

const SignIn = () => {
  const navigate = useNavigate();

  const handleOnFinish = () => {
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path);
  };

  return (
    <Layout>
      <LayoutContent>
        <AnimatedBackground />
        <FormContainer className="form-container">
          <Form
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
            onFinish={handleOnFinish}
          >
            <Typography.Title level={2}>Bienvenido a Ecommerce</Typography.Title>
            <Form.Item>
              <Button size="large" icon={<GoogleOutlined rev={{}} />}>
                Inicia con Google
              </Button>
            </Form.Item>
            <Typography.Paragraph type="secondary" className="caption">
              o inicia con tu correo
            </Typography.Paragraph>
            <Form.Item label="Correo" name="email" rules={[{ required: true, message: 'Por favor ingresa un correo válido' }]}>
              <Input size="large" placeholder="email@ejemplo.com" />
            </Form.Item>
            <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Ingresa una contraseña válida' }]}>
              <Input.Password size="large" placeholder="contraseña" />
            </Form.Item>
            <Button type="link">Recuperar contraseña</Button>
            <Form.Item style={{ marginTop: 10 }}>
              <Button type="primary" htmlType="submit" size="large">
                Ingresar
              </Button>
            </Form.Item>
            <Typography.Paragraph type="secondary" className="caption">
              ¿No tienes una cuenta?{' '}
              <Button type="link" href={APP_ROUTES.AUTH.SIGN_UP.path}>
                Registrate
              </Button>
            </Typography.Paragraph>
          </Form>

          <FormFigure>
            <FormFigureImg src="src/assets/img/svg/ecommerce-web.svg" alt="ecoomerce web" />
          </FormFigure>
        </FormContainer>
      </LayoutContent>
    </Layout>
  );
};

export default SignIn;

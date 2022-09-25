import { APP_ROUTES } from '@/constants/routes';
import { GoogleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, Typography } from 'antd';
import { FormContainer, FormFigure, FormFigureImg, LayoutContent } from './styles';

const SignUp = () => {
  return (
    <Layout>
      <LayoutContent>
        <FormContainer className="form-container">
          <Form
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Typography.Title level={2}>Bienvenido a Ecommerce</Typography.Title>
            <Form.Item>
              <Button size="large" icon={<GoogleOutlined />}>
                Registrate con Google
              </Button>
            </Form.Item>
            <Typography.Paragraph type="secondary" className="caption">
              o registrate con tu correo
            </Typography.Paragraph>
            <Form.Item
              label="Nombre(s)"
              name="name"
              rules={[{ required: true, message: 'Por favor ingresa un correo válido' }]}
            >
              <Input size="large" placeholder="Nombre(s)" />
            </Form.Item>
            <Form.Item
              label="Apellidos"
              name="lastName"
              rules={[{ required: true, message: 'Por favor ingresa un correo válido' }]}
            >
              <Input size="large" placeholder="Apellidos" />
            </Form.Item>
            <Form.Item
              label="Correo"
              name="email"
              rules={[{ required: true, message: 'Por favor ingresa un correo válido' }]}
            >
              <Input size="large" placeholder="correo@ejemplo.com" />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Ingresa una contraseña válida' }]}
            >
              <Input.Password size="large" placeholder="Contraseña" />
            </Form.Item>
            <Form.Item style={{ marginTop: 10 }}>
              <Button type="primary" htmlType="submit" size="large">
                Registrarme
              </Button>
            </Form.Item>
            <Typography.Paragraph type="secondary" className="caption">
              ¿Ya tienes una cuenta?{' '}
              <Button type="link" href={APP_ROUTES.AUTH.SIGN_IN}>
                Inicia sesión
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

export default SignUp;

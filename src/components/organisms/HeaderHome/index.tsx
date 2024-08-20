import { Avatar, Button, Col, Form, InputNumber, Modal, Row, Select, Space, Tooltip, Typography } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useState } from 'react';
import FallbackImage from '@/assets/logo-color.svg';

type CashierHeaderProps = {
  hideLogo?: boolean;
};

const CashierHeader = ({ hideLogo = false }: CashierHeaderProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onNavigate = (path: string) => {
    navigate(path);
  };

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  return (
    <HeaderRoot>
      {!hideLogo ? (
        <Space style={{ cursor: 'pointer' }} onClick={() => onNavigate(APP_ROUTES.PRIVATE.HOME.path)}>
          <Avatar size={50} src={FallbackImage} className="!p-4" style={{ marginBottom: 5 }} />
        </Space>
      ) : (
        <span />
      )}
      <HeaderActions>
        <Tooltip title="Iniciar sesión">
          <Button
            icon={<UserOutlined />}
            size="large"
            shape="circle"
            onClick={() => onNavigate(APP_ROUTES.AUTH.SIGN_IN_ADMIN.path)}
          />
        </Tooltip>
      </HeaderActions>
      <Modal
        open={open}
        onCancel={handleOpen}
        footer={
          <Row key="actions" gutter={10}>
            <Col span={12}>
              <Button key="back" block onClick={handleOpen}>
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button block type="primary" onClick={handleOpen}>
                Guardar
              </Button>
            </Col>
          </Row>
        }
      >
        <Form layout="vertical" title="Generar venta aleatoría">
          <Typography.Title level={4}>Generar venta aleatoría</Typography.Title>
          <Form.Item label="$ Cantidad" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="$ Cantidad" rules={[{ required: true }]}>
            <Select></Select>
          </Form.Item>
        </Form>
      </Modal>
    </HeaderRoot>
  );
};

export default CashierHeader;

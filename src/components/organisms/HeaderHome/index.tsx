import { Avatar, Button, Col, Divider, Form, InputNumber, Modal, Row, Select, Space, Tooltip, Typography } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import { InstagramOutlined, ShoppingCartOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useState } from 'react';
import FallbackImage from '@/assets/img/png/Logo Color.png';

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

  const openInstagram = () => window.open('https://www.instagram.com/paleteria_deliz/', '_blank');

  const openWhatsapp = () => window.open('https://api.whatsapp.com/send?phone=527711763694', '_blank');

  return (
    <HeaderRoot>
      {!hideLogo ? (
        <Space style={{ cursor: 'pointer' }} onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path)}>
          <Avatar size={50} src={FallbackImage} style={{ marginBottom: 5 }} />
        </Space>
      ) : (
        <span />
      )}
      <HeaderActions>
        <Space>
          <Tooltip title="Instagram">
            <Button icon={<InstagramOutlined rev={{}} />} type="dashed" size="large" shape="circle" onClick={openInstagram} />
          </Tooltip>
          <Tooltip title="Whatsapp">
            <Button icon={<WhatsAppOutlined rev={{}} />} type="dashed" size="large" shape="circle" onClick={openWhatsapp} />
          </Tooltip>
          <Tooltip title="Carrito">
            <Button
              icon={<ShoppingCartOutlined rev={{}} />}
              type="dashed"
              size="large"
              shape="circle"
              // onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path)}
            />
          </Tooltip>
        </Space>
        <Divider type="vertical" />
        <Tooltip title="Iniciar sesión">
          <Button
            icon={<UserOutlined rev={{}} />}
            type="primary"
            size="large"
            shape="circle"
            // onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path)}
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

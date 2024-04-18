import { Avatar, Button, Col, Divider, Form, InputNumber, Modal, Row, Select, Space, Tooltip, Typography } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import { AppstoreOutlined, HomeOutlined, ShoppingCartOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import FallbackImage from '@/assets/img/png/logo_deliz.webp';
import useMediaQuery from '@/hooks/useMediaQueries';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';

const CashierHeader = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isMobile } = useMediaQuery();
  const [open, setOpen] = useState(false);
  const { user_auth } = useAppSelector(({ users }) => users);
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const isSales = user_auth?.user?.email === 'sales@deliz.com';

  const onNavigate = (path: string) => {
    navigate(path);
  };

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  const handleSelect = (zone: number) => {
    dispatch(salesActions.updateCashRegister({ zone }));
  };

  return (
    <HeaderRoot>
      <div>
        <Space style={{ cursor: 'pointer' }} onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path)}>
          <Avatar size={50} src={FallbackImage} style={{ marginBottom: 5 }} />
          {!isMobile && (
            <Typography.Title level={5} style={{ margin: '0 0 2px 0' }}>
              Punto de venta
            </Typography.Title>
          )}
        </Space>

        <Select
          placeholder="Selecciona una zona"
          // size="large"
          style={{ width: 200, marginLeft: '3rem' }}
          value={cash_register?.zone}
          onChange={handleSelect}
          options={[
            { label: 'Zona 1', value: 1 },
            { label: 'Zona 2', value: 2 },
          ]}
        />
      </div>
      <HeaderActions>
        <Space>
          {!isSales && (
            <Tooltip title="Ventas">
              <Button
                icon={<ShoppingCartOutlined rev={{}} />}
                type="dashed"
                onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.SALES.path)}
              >
                {isMobile ? '' : 'Ventas'}
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Clientes">
            <Button
              icon={<TeamOutlined rev={{}} />}
              type="dashed"
              onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path)}
            >
              {isMobile ? '' : 'Clientes'}
            </Button>
          </Tooltip>
          {!isSales && (
            <Tooltip title="Productos">
              <Button
                icon={<AppstoreOutlined rev={{}} />}
                type="dashed"
                onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path)}
              >
                {isMobile ? '' : 'Productos'}
              </Button>
            </Tooltip>
          )}
          {/* <Tooltip title="Venta aleatoria">
            <Button icon={<InteractionOutlined rev={{}} />} type="dashed" size="large" shape="circle" onClick={handleOpen} />
          </Tooltip> */}
        </Space>
        <Divider type="vertical" />
        <Tooltip title="Ir a inicio">
          <Button
            icon={<HomeOutlined rev={{}} />}
            type="dashed"
            size="large"
            shape="circle"
            onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path)}
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

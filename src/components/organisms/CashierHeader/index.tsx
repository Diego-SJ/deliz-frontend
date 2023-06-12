import { Avatar, Button, Divider, Space, Tooltip, Typography } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import { DollarOutlined, HomeOutlined, ShoppingOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/routes';
import FallbackImage from '@/assets/img/png/Logo Color.png';
import useMediaQuery from '@/hooks/useMediaQueries';

const CashierHeader = () => {
  const navigate = useNavigate();
  const { isMobile } = useMediaQuery();

  const onNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <HeaderRoot>
      <Space style={{ cursor: 'pointer' }} onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path)}>
        <Avatar size={50} src={FallbackImage} style={{ marginBottom: 5 }} />
        {!isMobile && (
          <Typography.Title level={5} style={{ margin: '0 0 2px 0' }}>
            Punto de venta
          </Typography.Title>
        )}
      </Space>
      <HeaderActions>
        <Space>
          <Tooltip title="Ventas">
            <Button
              icon={<DollarOutlined rev={{}} />}
              type="dashed"
              size="large"
              shape="circle"
              onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.SALES.path)}
            />
          </Tooltip>
          <Tooltip title="Clientes">
            <Button
              icon={<TeamOutlined rev={{}} />}
              type="dashed"
              size="large"
              shape="circle"
              onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path)}
            />
          </Tooltip>
          <Tooltip title="Productos">
            <Button
              icon={<ShoppingOutlined rev={{}} />}
              type="dashed"
              size="large"
              shape="circle"
              onClick={() => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path)}
            />
          </Tooltip>
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
    </HeaderRoot>
  );
};

export default CashierHeader;

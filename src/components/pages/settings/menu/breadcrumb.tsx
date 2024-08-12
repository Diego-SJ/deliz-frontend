import useMediaQuery from '@/hooks/useMediaQueries';
import { APP_ROUTES } from '@/routes/routes';
import { Breadcrumb, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

type Props = {
  items?: {
    label: string;
    href?: string;
  }[];
};

const BreadcrumbSettings = ({ items = [] }: Props) => {
  const navigate = useNavigate();
  const { isTablet } = useMediaQuery();

  const handleClick = () => {
    const path = !isTablet ? APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.GENERAL.path : APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path;
    navigate(path);
  };

  const openPath = (path: string) => {
    navigate(path);
  };

  const breadcrumbItems = [
    {
      title: <span className="cursor-pointer">Configuración</span>,
      key: 'Settings',
      onClick: handleClick,
    },
    ...items.map(item => ({
      title: item.href ? <span className="cursor-pointer">{item.label}</span> : item.label,
      key: item.label,
      onClick: () => {
        if (item.href) openPath(item.href);
      },
    })),
  ];

  return (
    <Row justify="space-between" align="middle" className="mb-4">
      <Col lg={{ span: 12 }}>
        <Breadcrumb items={breadcrumbItems} />
      </Col>
    </Row>
  );
};

export default BreadcrumbSettings;

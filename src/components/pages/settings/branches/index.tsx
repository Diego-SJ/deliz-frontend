import { APP_ROUTES } from '@/routes/routes';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Result, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import BreadcrumbSettings from '../menu/breadcrumb';

const BranchesPage = () => {
  const navigate = useNavigate();

  const onAddBranch = () => {
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.ADD.path);
  };

  const onEditBranch = (branch_id: string) => {
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.EDIT.hash`${branch_id}`);
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Sucursales' }]} />

      <div className="flex flex-col mb-2 w-full">
        <Typography.Title level={4}>Sucursales</Typography.Title>
        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row gap-3">
          <Typography.Text className="text-gray-500">Administra tus sucursales aquí</Typography.Text>

          <Button icon={<PlusCircleOutlined />} onClick={onAddBranch}>
            Agregar sucursal
          </Button>
        </div>
      </div>

      <Card style={{ width: '100%' }} title="Lista de sucursales" className="shadow-md rounded-xl">
        {[].length ? (
          <Row gutter={[20, 20]}>
            <Col lg={12} xs={24}>
              <Card
                className="hover:shadow-md cursor-pointer hover:border-primary/50"
                color="primary"
                onClick={() => onEditBranch('qfefwefwejjgifjgwiejfiwe')}
              >
                <Card.Meta
                  title="Sucursal 1"
                  description="Descripción de la sucursal 1"
                  avatar={<Avatar children="S1" className="bg-primary/5  border border-primary text-primary" />}
                />
              </Card>
            </Col>
            <Col lg={12} xs={24}>
              <Card className="hover:shadow-md cursor-pointer hover:border-primary/50" color="primary">
                <Card.Meta
                  title="Sucursal 1"
                  description="Descripción de la sucursal 1"
                  avatar={<Avatar children="S1" className="bg-primary/5  border border-primary text-primary" />}
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            <Result
              className="mx-auto"
              status="404"
              title="No hay sucursales"
              subTitle="No se encontraron sucursales registradas."
              extra={
                <Button type="primary" ghost>
                  Registra tu primer sucursal
                </Button>
              }
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default BranchesPage;

import { APP_ROUTES } from '@/routes/routes';
import { PlusCircleOutlined, ShopOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Result, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import BreadcrumbSettings from '../menu/breadcrumb';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useEffect } from 'react';
import { branchesActions } from '@/redux/reducers/branches';
import CardRoot from '@/components/atoms/Card';

const BranchesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { branches } = useAppSelector(state => state.branches);

  useEffect(() => {
    dispatch(branchesActions.getBranches());
  }, [dispatch]);

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

      <CardRoot style={{ width: '100%' }} styles={{ body: { padding: 0 } }} title="Sucursales">
        {!!branches?.length ? (
          <List
            itemLayout="horizontal"
            footer={
              <div className="px-2">
                <Button type="text" icon={<PlusCircleOutlined />} className="text-primary" onClick={onAddBranch}>
                  Agregar nuevo
                </Button>
              </div>
            }
            className="px-0"
            dataSource={branches}
            renderItem={item => (
              <List.Item
                onClick={() => onEditBranch(item.branch_id)}
                styles={{ actions: { paddingRight: 15, margin: 0 } }}
                classNames={{ actions: 'flex' }}
                className="flex cursor-pointer hover:bg-gray-50"
              >
                <div className="px-4 md:pl-6 flex gap-4 justify-between w-full items-center">
                  <div className="flex gap-4 items-center">
                    <Avatar size={40} icon={<ShopOutlined className="text-primary" />} className="bg-primary/10" />
                    <Typography.Text>{item.name}</Typography.Text>
                  </div>
                  <Tag bordered={false} color={item.main_branch ? 'green' : ''}>
                    {item.main_branch ? 'Predeterminada' : 'Sucursal'}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
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
      </CardRoot>
    </div>
  );
};

export default BranchesPage;

import { APP_ROUTES } from '@/routes/routes';
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Result, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import BreadcrumbSettings from '../menu/breadcrumb';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useEffect, useRef } from 'react';
import CardRoot from '@/components/atoms/Card';
import { userActions } from '@/redux/reducers/users';
import useMediaQuery from '@/hooks/useMediaQueries';

const UsersSettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(({ users }) => users);
  const firstRender = useRef(false);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(userActions.getAllUsers());
    }
  }, [dispatch, firstRender]);

  const onAddUser = () => {
    navigate(APP_ROUTES.PRIVATE.SETTINGS.USERS.ADD.path);
  };

  const onEditUser = (profile_id: string) => {
    navigate(APP_ROUTES.PRIVATE.SETTINGS.USERS.EDIT.hash`${profile_id}`);
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Usuarios' }]} />

      <div className="flex flex-col mb-2 w-full">
        <Typography.Title level={4}>Usuarios</Typography.Title>
        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row gap-3">
          <Typography.Text className="text-gray-500">
            Administra usuarios y permisos. Puedes registrar hasta 3 usuarios.
          </Typography.Text>

          {users?.length < 3 && (
            <Button icon={<PlusCircleOutlined />} onClick={onAddUser} size={isTablet ? 'large' : 'middle'}>
              Agregar usuario
            </Button>
          )}
        </div>
      </div>

      <CardRoot style={{ width: '100%' }} styles={{ body: { padding: 0 } }} title="Usuarios">
        {!!users?.length ? (
          <List
            itemLayout="horizontal"
            footer={
              users?.length < 3 ? (
                <div className="px-2">
                  <Button type="text" icon={<PlusCircleOutlined />} className="text-primary" onClick={onAddUser}>
                    Agregar nuevo
                  </Button>
                </div>
              ) : null
            }
            className="px-0"
            dataSource={users}
            renderItem={item => (
              <List.Item
                onClick={() => onEditUser(item.profile_id)}
                styles={{ actions: { paddingRight: 15, margin: 0 } }}
                classNames={{ actions: 'flex' }}
                className="flex cursor-pointer hover:bg-gray-50"
              >
                <div className="px-4 md:pl-6 flex gap-4 justify-between w-full items-center">
                  <div className="flex gap-4 items-center">
                    <Avatar size={40} icon={<UserOutlined className="text-slate-600" />} className="bg-slate-600/10" />
                    <Typography.Text>
                      {item.first_name} {item.last_name}{' '}
                      {!!item?.is_default && <span className="text-slate-400 font-light">(Predeterminado)</span>}
                      {!!item?.is_inactive && <span className="text-red-400 font-light">(Inhabilitado)</span>}
                    </Typography.Text>
                  </div>
                  <Tag bordered={false} color={item.role === 'ADMIN' ? 'purple' : ''} className="lowercase">
                    {item.role}
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
                  Registra un usuario
                </Button>
              }
            />
          </>
        )}
      </CardRoot>
    </div>
  );
};

export default UsersSettingsPage;

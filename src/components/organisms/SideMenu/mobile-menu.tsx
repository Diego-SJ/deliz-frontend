import {
  LogoutOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  IdcardOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import LogoAppWhite from '@/assets/logo-color.svg';
import { Avatar, Button, Drawer, Modal } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import { createElement } from 'react';
import { ITEM_LIST } from '.';
import { APP_VERSION } from '@/constants/versions';
import { useMembershipAccess } from '@/routes/module-access';

type SideMobileMenuProps = {
  closeDrawer?: () => void;
  open?: boolean;
};

const SideMobileMenu = ({ closeDrawer, open }: SideMobileMenuProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasAccess } = useMembershipAccess();
  const { profile, isAdmin } = useAppSelector(({ users }) => users?.user_auth);
  const { company } = useAppSelector(({ app }) => app);

  const [modal, contextHolder] = Modal.useModal();

  const handleLogout = () => {
    modal.confirm({
      title: 'Cerrar sesión',
      icon: <ExclamationCircleOutlined />,
      content: 'Tu sesión será finalizada ¿deseas continuar?',
      okText: 'Continuar',
      cancelText: 'Cancelar',
      onOk: async () => {
        await dispatch(userActions.signOut());
      },
    });
  };

  const handlePathChange = (path: string) => {
    if (path) navigate(path);
    if (closeDrawer) closeDrawer();
  };

  const goToMembership = () => {
    navigate(APP_ROUTES.PRIVATE.MEMBERSHIP.path);
    if (closeDrawer) closeDrawer();
  };

  return (
    <Drawer
      placement="bottom"
      height={'100dvh'}
      open={open}
      closeIcon={<></>}
      extra={
        <Button
          onClick={closeDrawer}
          type="text"
          icon={<CloseOutlined className="text-slate-900 !text-2xl" />}
          size="large"
        />
      }
      onClose={closeDrawer}
      classNames={{
        body: '!bg-neutral-100 !px-5 !pt-0',
        header: '!bg-neutral-100 !border-b-transparent',
      }}
    >
      <div className="px-0">
        <div className="flex gap-4 pb-8 items-center">
          <div className="bg-white rounded-full w-20 h-20 flex justify-center items-center">
            <img
              src={company?.logo_url || LogoAppWhite}
              alt="posiffy"
              className="w-14 h-14 object-contain aspect-square"
            />
          </div>
          <div className="flex flex-col">
            <h5 className="text-xl font-semibold">
              {company?.name || 'Posiffy'}
            </h5>
            <p className="text-base text-slate-400 font-light">
              {profile?.email || '- - -'}
            </p>
          </div>
        </div>

        <div className="flex flex-col bg-white rounded-lg py-1 shadow-sm mb-6">
          <LisItem
            onClick={() => {
              handlePathChange(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path);
            }}
            label="Nueva venta"
            icon={<PlusCircleOutlined className="text-xl text-slate-900" />}
          />
        </div>

        <div className="flex flex-col bg-white rounded-lg gap-2 py-2 mb-6 shadow-sm">
          {ITEM_LIST(profile?.permissions! || {}, hasAccess).map((item) => {
            if (!item) return null;

            const { key, icon, label, path, children } = item;

            if (children?.length) {
              return children.map((subItem: any) => {
                return (
                  <LisItem
                    key={subItem.key}
                    onClick={() => {
                      if (subItem.path) handlePathChange(subItem.path);
                    }}
                    label={subItem.label}
                    icon={
                      subItem?.icon
                        ? createElement(subItem?.icon as any, {
                            className: 'text-xl text-slate-900',
                          })
                        : null
                    }
                  />
                );
              });
            }

            return (
              <LisItem
                key={key}
                onClick={() => {
                  if (path) handlePathChange(path);
                }}
                label={label}
                icon={createElement(icon as any, {
                  className: 'text-xl text-slate-900',
                })}
              />
            );
          })}
        </div>

        {isAdmin && (
          <div className="flex flex-col bg-white rounded-lg py-1 shadow-sm mb-5">
            <div
              className="w-full flex items-center gap-5 px-4 py-3"
              onClick={goToMembership}
            >
              <Avatar
                size={40}
                shape="square"
                className="bg-teal-600/10 text-teal-600 !rounded-xl flex items-center justify-center"
                icon={createElement(IdcardOutlined, {
                  className: 'text-xl text-teal-600',
                })}
              />
              <p className="text-lg font-medium text-teal-600">Mi Membersía</p>
            </div>
          </div>
        )}

        <div className="flex flex-col bg-white rounded-lg py-1 shadow-sm">
          <div
            className="w-full flex items-center gap-5 px-4 py-3"
            onClick={handleLogout}
          >
            <Avatar
              size={40}
              shape="square"
              className="bg-red-600/10 text-red-600 !rounded-xl flex items-center justify-center"
              icon={createElement(LogoutOutlined, {
                className: 'text-xl text-red-600',
              })}
            />
            <p className="text-lg font-medium text-red-600">Cerrar sesión</p>
          </div>
        </div>

        <div
          className="py-10 w-full text-center text-slate-400 text-base"
          onClick={() => {
            window.location.reload();
          }}
        >
          <p>Posiffy App</p>
          <span className="ml-1">v{APP_VERSION}</span>
        </div>
        {contextHolder}
      </div>
    </Drawer>
  );
};

type LisItemProps = {
  onClick?: (args?: any) => void;
  icon?: JSX.Element | null;
  label: string;
};

const LisItem = ({ onClick, icon, label }: LisItemProps) => {
  return (
    <div className="w-full flex items-center gap-5 px-4 py-3" onClick={onClick}>
      <Avatar
        size={35}
        shape="square"
        className="bg-slate-600/10 text-slate-600 !rounded-xl flex items-center justify-center"
        icon={icon}
      />
      <p className="text-base font-medium">{label}</p>
    </div>
  );
};

export default SideMobileMenu;

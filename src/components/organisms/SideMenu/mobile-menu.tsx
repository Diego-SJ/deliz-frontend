import { LogoutOutlined, ExclamationCircleOutlined, PlusCircleOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import LogoAppWhite from '@/assets/logo-color.svg';
import { Avatar, Modal } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import { createElement } from 'react';
import { ITEM_LIST } from '.';
import { APP_VERSION } from '@/constants/versions';

type SideMobileMenuProps = {
  onClick?: (args?: any) => void;
};

const SideMobileMenu = (props: SideMobileMenuProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
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
    if (props?.onClick) props.onClick();
  };

  const goToMembership = () => {
    navigate(APP_ROUTES.PRIVATE.MEMBERSHIP.path);
    if (props?.onClick) props.onClick();
  };

  return (
    <div className="px-0">
      <div className="flex gap-6 pb-10">
        <img src={LogoAppWhite} alt="posiffy" className="w-16 h-1/6 aspect-square" />
        <div className="flex flex-col">
          <h5 className="text-xl font-semibold">{company?.name || 'Posiffy'}</h5>
          <p className="text-lg text-slate-400 font-light">{company?.email || '- - -'}</p>
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
        {ITEM_LIST(permissions!).map(item => {
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
                  icon={subItem?.icon ? createElement(subItem?.icon as any, { className: 'text-xl text-slate-900' }) : null}
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
              icon={createElement(icon as any, { className: 'text-xl text-slate-900' })}
            />
          );
        })}
      </div>
      <div className="flex flex-col bg-white rounded-lg py-1 shadow-sm mb-5">
        <div className="w-full flex items-center gap-5 px-4 py-3" onClick={goToMembership}>
          <Avatar
            size={40}
            shape="square"
            className="bg-teal-600/10 text-teal-600 !rounded-xl flex items-center justify-center"
            icon={createElement(IdcardOutlined, { className: 'text-xl text-teal-600' })}
          />
          <p className="text-lg font-medium text-teal-600">Mi Membersía</p>
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-lg py-1 shadow-sm">
        <div className="w-full flex items-center gap-5 px-4 py-3" onClick={handleLogout}>
          <Avatar
            size={40}
            shape="square"
            className="bg-red-600/10 text-red-600 !rounded-xl flex items-center justify-center"
            icon={createElement(LogoutOutlined, { className: 'text-xl text-red-600' })}
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
        <span>v{APP_VERSION}</span>
      </div>
      {contextHolder}
    </div>
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

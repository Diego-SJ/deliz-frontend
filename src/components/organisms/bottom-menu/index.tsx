import {
  CircleDollarSign,
  House,
  Plus,
  Settings,
  ShoppingBag,
  ShoppingBasket,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useAppSelector } from '@/hooks/useStore';
import { useMembershipAccess } from '@/routes/module-access';

type BottomMenuButtomProps = {
  icon?: React.ReactNode;
  title?: string;
  onClick?: () => void;
};

const BottomMenuButton = ({ icon, title, onClick }: BottomMenuButtomProps) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col rounded-xl hover:bg-white/10 w-14 items-center cursor-pointer group hover:text-primary text-gray-400"
    >
      {icon}
      <span className="text-xs font-light  mt-1">{title}</span>
    </div>
  );
};

type Props = {
  addBottomMargin?: boolean;
};

const BottomMenu = ({ addBottomMargin = false }: Props) => {
  const navigate = useNavigate();
  const { hasAccess } = useMembershipAccess();
  const { profile } = useAppSelector(({ users }) => users?.user_auth);

  return (
    <>
      {addBottomMargin && <div className="h-[82px]" />}
      <div className="fixed bottom-0 left-0 w-full flex justify-evenly py-4 bg-white border shadow-lg">
        <BottomMenuButton
          icon={<House className="stroke-[1.5]" />}
          title="Inicio"
          onClick={() => navigate(APP_ROUTES.PRIVATE.HOME.path)}
        />
        {profile?.permissions?.sales?.view_sales?.value && (
          <BottomMenuButton
            icon={<ShoppingBag className="stroke-[1.5]" />}
            title="Ventas"
            onClick={() => navigate(APP_ROUTES.PRIVATE.SALES.path)}
          />
        )}
        {profile?.permissions?.pos?.add_sale?.value && (
          <div
            onClick={() => navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path)}
            className="flex items-center justify-center rounded-full bg-primary w-12 h-12 cursor-pointer shadow shadow-primary/50 text-white py-1 "
          >
            <Plus className="w-12 min-w-12" />
          </div>
        )}
        {hasAccess('view_expenses') ? (
          <>
            {profile?.permissions?.expenses?.view_expenses?.value && (
              <BottomMenuButton
                icon={<CircleDollarSign className="stroke-[1.5]" />}
                title="Caja"
                onClick={() =>
                  navigate(APP_ROUTES.PRIVATE.TRANSACTIONS.CURRENT_CASHIER.path)
                }
              />
            )}
          </>
        ) : (
          <>
            {profile?.permissions?.products?.view_catalog?.value && (
              <BottomMenuButton
                icon={<ShoppingBasket className="stroke-[1.5]" />}
                title="Productos"
                onClick={() => navigate(APP_ROUTES.PRIVATE.PRODUCTS.path)}
              />
            )}
          </>
        )}
        <BottomMenuButton
          icon={<Settings className="stroke-[1.5]" />}
          title="Ajustes"
          onClick={() => navigate(APP_ROUTES.PRIVATE.SETTINGS.GENERAL.path)}
        />
      </div>
    </>
  );
};

export default BottomMenu;

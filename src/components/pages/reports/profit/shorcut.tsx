import CardRoot from '@/components/atoms/Card';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { APP_ROUTES } from '@/routes/routes';
import functions from '@/utils/functions';
import { Avatar, Button, Divider } from 'antd';
import {
  ArrowDownToDotIcon,
  ArrowUpFromDotIcon,
  SquareChartGantt,
  Wallet,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useEffect, useRef } from 'react';
import { analyticsActions } from '@/redux/reducers/analytics';
import { Reports } from '../types';

const ProfitShorcutReport = ({ hideData }: Reports) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profit } = useAppSelector(({ analytics }) => analytics);
  const { profile } = useAppSelector(({ users }) => users?.user_auth);
  const firstLoad = useRef(false);
  let expenses =
    profit?.summary?.completed_expenses + profit?.summary?.pending_expenses;
  let sales = profit?.summary?.completed_sales + profit?.summary?.pending_sales;
  let profitTotal = sales - expenses;

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  useEffect(() => {
    if (
      !firstLoad.current &&
      entry?.isIntersecting &&
      profile?.permissions?.reports?.view_sales_report?.value
    ) {
      firstLoad.current = true;
      dispatch(analyticsActions.profit.getHistoriReport());
    }
  }, [entry, firstLoad.current, dispatch]);

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.PROFIT.path);
  };

  return (
    <CardRoot
      className="w-full"
      title="Resumen de ganancias"
      extra={
        <Button
          onClick={onActionClick}
          icon={<SquareChartGantt className="w-4 h-4" />}
        />
      }
    >
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <div className="flex gap-3 items-center">
          <Avatar
            icon={<ArrowDownToDotIcon className="w-6 h-6 text-blue-600" />}
            className="w-10 h-10 bg-blue-600/10 rounded-xl border-blue-600"
          />
          <div className="">
            <p className="text-sm text-gray-500 mb-1">Entradas</p>
            <p className="text-2xl font-bold mb-1">
              {functions.money(sales, { hidden: hideData })}
            </p>
            <p className="text-xs font-light text-gray-400">Ventas</p>
          </div>
        </div>
        <Divider className="block md:hidden !m-0" />

        <div className="flex gap-3 items-center">
          <Avatar
            icon={<ArrowUpFromDotIcon className="w-6 h-6 text-red-600" />}
            className="w-10 h-10 bg-red-600/10 rounded-xl border-red-600"
          />
          <div className="">
            <p className="text-sm text-gray-500 mb-1">Salidas</p>
            <p className="text-2xl font-bold mb-1">
              {functions.money(expenses, { hidden: hideData })}
            </p>
            <p className="text-xs font-light text-gray-400">Compras y gastos</p>
          </div>
        </div>
        <Divider className="block md:hidden !m-0" />
        <div className="flex gap-3 items-center">
          <Avatar
            icon={<Wallet className="w-6 h-6 text-green-600" />}
            className="w-10 h-10 bg-green-600/10 rounded-xl border-green-600"
          />
          <div className="">
            <p className="text-sm text-gray-500 mb-1">Ganancia</p>
            <p className="text-2xl font-bold mb-1">
              {functions.money(profitTotal, { hidden: hideData })}
            </p>
            <p className="text-xs font-light text-gray-400">
              Entradas - Gastos
            </p>
          </div>
        </div>
      </div>
    </CardRoot>
  );
};

export default ProfitShorcutReport;

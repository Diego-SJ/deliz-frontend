import CardRoot from '@/components/atoms/Card';
import { useAppSelector } from '@/hooks/useStore';
import { APP_ROUTES } from '@/routes/routes';
import functions from '@/utils/functions';
import { Avatar, Button, Divider } from 'antd';
import { SquareChartGantt, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const ProfitShorcutReport = () => {
  const navigate = useNavigate();
  const { profit } = useAppSelector(({ analytics }) => analytics);
  let expenses = profit?.summary?.completed_expenses + profit?.summary?.pending_expenses;
  let sales = profit?.summary?.completed_sales + profit?.summary?.pending_sales;
  let profitTotal = sales - expenses;

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.PROFIT.path);
  };

  return (
    <CardRoot
      // className="w-full bg-white rounded-xl border px-5 pb-5 pt-3"
      className="w-full"
      title="Resumen de ganancias"
      extra={<Button onClick={onActionClick} icon={<SquareChartGantt className="w-4 h-4" />} />}
    >
      {/* <div className="flex justify-between mb-2">
        <h5 className="text-base font-semibold">Resumen de ganancias</h5>

        <div>
          <Button onClick={onActionClick} icon={<SquareChartGantt className="w-4 h-4" />} />
        </div>
      </div> */}
      <div className="flex justify-between gap-5 flex-wrap">
        <div className="flex gap-3 items-center">
          <Avatar
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
            className="w-10 h-10 bg-blue-600/10 rounded-xl border-blue-600"
          />
          <div className="">
            <p className="text-sm text-gray-500 mb-1">Entradas</p>
            <p className="text-2xl font-bold mb-1">{functions.money(sales)}</p>
            <p className="text-xs text-gray-400">Ventas</p>
          </div>
        </div>
        <Divider className="block md:hidden !m-0" />

        <div className="flex gap-3 items-center">
          <Avatar
            icon={<TrendingDown className="w-6 h-6 text-red-600" />}
            className="w-10 h-10 bg-red-600/10 rounded-xl border-red-600"
          />
          <div className="">
            <p className="text-sm text-gray-500 mb-1">Gastos</p>
            <p className="text-2xl font-bold mb-1">{functions.money(expenses)}</p>
            <p className="text-xs text-gray-400">Compras y gastos</p>
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
            <p className="text-2xl font-bold mb-1">{functions.money(profitTotal)}</p>
            <p className="text-xs text-gray-400">Entradas - Gastos</p>
          </div>
        </div>
      </div>
    </CardRoot>
  );
};

export default ProfitShorcutReport;

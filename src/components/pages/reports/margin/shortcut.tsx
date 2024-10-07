import { Button, Empty, Tooltip, Typography } from 'antd';
import { LineChartMargin } from './chart';
import CardRoot from '@/components/atoms/Card';
import { formattedDateRange } from '../utils';
import { useAppSelector } from '@/hooks/useStore';
import { LineChartData } from '@/redux/reducers/analytics/types';
import functions from '@/utils/functions';
import { useMembershipAccess } from '@/routes/module-access';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { CloudDownload, SquareChartGantt } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const getTotalAmountSales = (data: LineChartData) =>
  data.reduce((acc, series) => acc + series.data.reduce((sum, point) => sum + point.total, 0), 0);

const ReportMarginShortcut = () => {
  const navigate = useNavigate();
  const { hasAccess } = useMembershipAccess();
  const { user_auth } = useAppSelector(({ users }) => users);
  const { loading, data } = useAppSelector(({ analytics }) => analytics?.sales || {});
  const totalAmountSales = getTotalAmountSales(data) || 0;
  const elementRef = useRef<any>(null);

  const handlePrint = useReactToPrint({
    content: () => elementRef.current,
  });

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.SALES.path);
  };

  return (
    <CardRoot
      loading={loading}
      title={<h5 className="!text-base m-0 font-medium">Monto total de ventas</h5>}
      extra={
        <div className="flex gap-3">
          {user_auth?.profile?.permissions?.reports?.view_sales_report?.value && hasAccess('view_sales_report') ? (
            <Tooltip title="Ver reporte completo">
              <Button onClick={onActionClick} icon={<SquareChartGantt className="w-4 h-4" />} />
            </Tooltip>
          ) : null}
          <Button onClick={handlePrint} icon={<CloudDownload className="w-4 h-4" />} />
        </div>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div className="w-full" ref={elementRef}>
        {data?.length ? (
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-2 pl-1 pr-2">
              <Typography.Title level={2} className="!text-3xl !m-0">
                {functions.money(totalAmountSales)}
              </Typography.Title>

              <Typography.Text className="!text-sm mt-2">{formattedDateRange}</Typography.Text>
            </div>
            <div className="h-64 md:h-80 w-full mt-5">
              <LineChartMargin data={data} />
            </div>
          </div>
        ) : (
          <Empty description="Registra tus primeras ventas para visualizar información" />
        )}
      </div>
    </CardRoot>
  );
};

export default ReportMarginShortcut;

import { Button, Empty, Tooltip, Typography } from 'antd';
import { LineChartSales } from './chart';
import CardRoot from '@/components/atoms/Card';
import { formattedDateRange } from '../utils';
import { useAppSelector } from '@/hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useMembershipAccess } from '@/routes/module-access';
import { CloudDownload, SquareChartGantt } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { Reports } from '../types';

const ReportSaleThumbnail = ({ hideData }: Reports) => {
  const navigate = useNavigate();
  const { hasAccess } = useMembershipAccess();
  const { total, loading, data } = useAppSelector(
    ({ analytics }) => analytics?.sales || {},
  );
  const { user_auth } = useAppSelector(({ users }) => users);
  const elementRef = useRef<any>(null);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.SALES.path);
  };

  return (
    <CardRoot
      loading={loading}
      title={<h5 className="!text-base m-0 font-medium">Ventas</h5>}
      extra={
        <div className="flex gap-3">
          {user_auth?.profile?.permissions?.reports?.view_sales_report?.value &&
          hasAccess('view_sales_report') ? (
            <Tooltip title="Ver reporte completo">
              <Button
                onClick={onActionClick}
                icon={<SquareChartGantt className="w-4 h-4" />}
              />
            </Tooltip>
          ) : null}
          <Button
            onClick={() => handlePrint()}
            icon={<CloudDownload className="w-4 h-4" />}
          />
        </div>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div className="w-full" ref={elementRef}>
        {data?.length ? (
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-2 pl-1 pr-2">
              <Typography.Title level={2} className="!text-3xl !m-0">
                {hideData ? '*****' : total || 0}
              </Typography.Title>

              <Typography.Text className="!text-sm mt-2">
                {formattedDateRange}
              </Typography.Text>
            </div>
            <div className="h-56 sm:h-64 md:h-80 w-full mt-5">
              <LineChartSales data={data} />
            </div>
          </div>
        ) : (
          <Empty description="Registra tus primeras ventas para visualizar información" />
        )}
      </div>
    </CardRoot>
  );
};

export default ReportSaleThumbnail;

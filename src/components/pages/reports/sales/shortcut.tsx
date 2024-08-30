import { Button, Empty, Typography } from 'antd';
import { LineChartSales } from './chart';
import CardRoot from '@/components/atoms/Card';
import { formattedDateRange } from '../utils';
import { useAppSelector } from '@/hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useMembershipAccess } from '@/routes/module-access';

const ReportSaleThumbnail = () => {
  const navigate = useNavigate();
  const { hasAccess } = useMembershipAccess();
  const { total, loading, data } = useAppSelector(({ analytics }) => analytics?.sales || {});
  const { user_auth } = useAppSelector(({ users }) => users);

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.SALES.path);
  };

  return (
    <CardRoot
      loading={loading}
      title={<h5 className="!text-base m-0 font-medium">Ventas</h5>}
      extra={
        user_auth?.profile?.permissions?.reports?.view_sales_report?.value && hasAccess('view_sales_report') ? (
          <Button type="text" className="!text-primary underline" onClick={onActionClick}>
            Ver reporte
          </Button>
        ) : null
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      {data?.length ? (
        <>
          <div className="flex justify-between items-center mb-2 pl-1 pr-2">
            <Typography.Title level={2} className="!text-3xl !m-0">
              {total || 0}
            </Typography.Title>

            <Typography.Text className="!text-sm mt-2">{formattedDateRange}</Typography.Text>
          </div>
          <div className="h-56 sm:h-64 md:h-80 w-full">
            <LineChartSales data={data} />
          </div>
        </>
      ) : (
        <Empty description="Registra tus primeras ventas para visualizar información" />
      )}
    </CardRoot>
  );
};

export default ReportSaleThumbnail;

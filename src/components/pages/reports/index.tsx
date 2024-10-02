import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import ReportMarginShortcut from './margin/shortcut';
import ReportSaleThumbnail from './sales/shortcut';
import { useEffect, useRef } from 'react';
import { analyticsActions } from '@/redux/reducers/analytics';
import TopProductsThumbnail from './products/shortcut';
import TopCustomersThumbnail from './customers/shortcut';
import { Button } from 'antd';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import ProfitShorcutReport from './profit/shorcut';

const ReportsHomePage = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const firstLoad = useRef(false);
  const elementRef = useRef<any>(null);

  const handlePrint = useReactToPrint({
    content: () => elementRef.current,
  });

  useEffect(() => {
    if (!firstLoad.current && !!Object.values(profile?.permissions?.reports || {}).some(Boolean)) {
      firstLoad.current = true;
      if (profile?.permissions?.reports?.view_sales_report?.value) {
        dispatch(analyticsActions.sales.getWeekReport());
        dispatch(analyticsActions.profit.getHistoriReport());
      }
      if (profile?.permissions?.reports?.view_products_report?.value) {
        dispatch(analyticsActions.getTopProducts());
      }

      if (profile?.permissions?.reports?.view_customers_report?.value) {
        dispatch(analyticsActions.getTopCustomers());
      }
    }
  }, [dispatch, profile?.permissions]);

  return (
    <div className="flex flex-col" ref={elementRef}>
      <div className="flex justify-between items-center  mb-5">
        <p className="text-sm text-gray-500">Aquí tienes un resumen de los reportes más importantes</p>
        <Button type="primary" className="print:hidden" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
          Imprimir
        </Button>
      </div>
      <div className="flex w-full mb-5">
        <ProfitShorcutReport />
      </div>
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-5">
        {profile?.permissions?.reports?.view_sales_report?.value ? <ReportSaleThumbnail /> : null}
        {profile?.permissions?.reports?.view_sales_report?.value ? <ReportMarginShortcut /> : null}
        {profile?.permissions?.reports?.view_customers_report?.value ? <TopCustomersThumbnail /> : null}
        {profile?.permissions?.reports?.view_products_report?.value ? <TopProductsThumbnail /> : null}
      </div>
    </div>
  );
};

export default ReportsHomePage;

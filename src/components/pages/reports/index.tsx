import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import ReportMarginShortcut from './margin/shortcut';
import ReportSaleThumbnail from './sales/shortcut';
import { useEffect, useRef, useState } from 'react';
import { analyticsActions } from '@/redux/reducers/analytics';
import TopProductsThumbnail from './products/shortcut';
import TopCustomersThumbnail from './customers/shortcut';
import ProfitShorcutReport from './profit/shorcut';
import ExpensesShortcutReport from '@/components/pages/reports/expenses/shortcut';
import EyeButton from '@/components/atoms/eye-button';

const ReportsHomePage = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const firstLoad = useRef(false);
  const elementRef = useRef<any>(null);
  const [hideData, setHideData] = useState(true);

  useEffect(() => {
    if (
      !firstLoad.current &&
      profile?.permissions?.reports?.view_sales_report?.value
    ) {
      firstLoad.current = true;
      dispatch(analyticsActions.sales.getWeekReport());
    }
  }, [dispatch, profile?.permissions, firstLoad.current]);

  const handleHideData = () => {
    setHideData((prev) => !prev);
  };

  return (
    <div className="flex flex-col" ref={elementRef}>
      <div className="flex justify-between items-center  mb-5">
        <p className="text-sm text-gray-500">
          Aquí tienes un resumen de los reportes más importantes
        </p>
        <EyeButton onChange={handleHideData} hideData={hideData} />
      </div>
      <div className="grid grid-cols-1 gap-5 w-full mb-5">
        <ProfitShorcutReport hideData={hideData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full mb-5">
        {profile?.permissions?.reports?.view_sales_report?.value ? (
          <ReportMarginShortcut hideData={hideData} />
        ) : null}
        <ExpensesShortcutReport />
      </div>
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-5">
        {profile?.permissions?.reports?.view_sales_report?.value ? (
          <ReportSaleThumbnail hideData={hideData} />
        ) : null}
        {profile?.permissions?.reports?.view_customers_report?.value ? (
          <TopCustomersThumbnail hideData={hideData} />
        ) : null}
        {profile?.permissions?.reports?.view_products_report?.value ? (
          <TopProductsThumbnail hideData={hideData} />
        ) : null}
      </div>
    </div>
  );
};

export default ReportsHomePage;

import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import ReportMarginShortcut from './margin/shortcut';
import ReportSaleThumbnail from './sales/shortcut';
import { useEffect, useRef } from 'react';
import { analyticsActions } from '@/redux/reducers/analytics';
import TopProductsThumbnail from './products/shortcut';
import TopCustomersThumbnail from './customers/shortcut';

const ReportsHomePage = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const firstLoad = useRef(false);

  useEffect(() => {
    if (!firstLoad.current && !!Object.values(profile?.permissions?.reports || {}).some(Boolean)) {
      firstLoad.current = true;
      if (profile?.permissions?.reports?.view_sales_report?.value) {
        dispatch(analyticsActions.getSales());
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
    <div className="grid grid-cols-1  lg:grid-cols-2 gap-5">
      {profile?.permissions?.reports?.view_sales_report?.value ? <ReportSaleThumbnail /> : null}
      {profile?.permissions?.reports?.view_sales_report?.value ? <ReportMarginShortcut /> : null}
      {profile?.permissions?.reports?.view_products_report?.value ? <TopProductsThumbnail /> : null}
      {profile?.permissions?.reports?.view_customers_report?.value ? <TopCustomersThumbnail /> : null}
    </div>
  );
};

export default ReportsHomePage;

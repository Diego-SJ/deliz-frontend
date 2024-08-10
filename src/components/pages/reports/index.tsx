import { useAppDispatch } from '@/hooks/useStore';
import ReportMarginShortcut from './margin/shortcut';
import ReportSaleThumbnail from './sales/shortcut';
import { useEffect, useRef } from 'react';
import { analyticsActions } from '@/redux/reducers/analytics';
import TopProductsThumbnail from './products/shortcut';
import TopCustomersThumbnail from './customers/shortcut';

const ReportsHomePage = () => {
  const dispatch = useAppDispatch();
  const firstLoad = useRef(false);

  useEffect(() => {
    if (!firstLoad.current) {
      firstLoad.current = true;
      dispatch(analyticsActions.getSales());
      dispatch(analyticsActions.getTopProducts());
      dispatch(analyticsActions.getTopCustomers());
    }
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1  lg:grid-cols-2 gap-5">
      <ReportSaleThumbnail />
      <ReportMarginShortcut />
      <TopProductsThumbnail />
      <TopCustomersThumbnail />
    </div>
  );
};

export default ReportsHomePage;

import { useAppDispatch } from '@/hooks/useStore';
import ReportMarginShortcut from './margin/shortcut';
import ReportSaleThumbnail from './sales/shortcut';
import { useEffect, useRef } from 'react';
import { analyticsActions } from '@/redux/reducers/analytics';
import TopProductsThumbnail from './products/shortcut';

const ReportsHomePage = () => {
  const dispatch = useAppDispatch();
  const firstLoad = useRef(false);

  useEffect(() => {
    if (!firstLoad.current) {
      firstLoad.current = true;
      dispatch(analyticsActions.getSales());
      dispatch(analyticsActions.getTopProducts());
    }
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <ReportSaleThumbnail />
      <ReportMarginShortcut />
      <TopProductsThumbnail />
    </div>
  );
};

export default ReportsHomePage;

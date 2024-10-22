import { Button, Tooltip } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useMembershipAccess } from '@/routes/module-access';
import { ArrowDown01, CloudDownload, Shuffle, SquareChartGantt } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useEffect, useRef, useState } from 'react';
import ExpensesPieChart from '@/components/pages/reports/users/shortcut/chart';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { analyticsActions } from '@/redux/reducers/analytics';
import ReportEmpty from '@/components/atoms/report-empty';
import { Reports } from '../../types';

const SalesByUserShortcutReport = ({ hideData }: Reports) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasAccess } = useMembershipAccess();
  const { loading, charts } = useAppSelector(({ analytics }) => analytics?.users || {});
  const { user_auth } = useAppSelector(({ users }) => users);
  const elementRef = useRef<any>(null);
  const firstLoad = useRef(false);
  const [sortByValue, setSortByValue] = useState(false);
  const profile = user_auth?.profile;

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  useEffect(() => {
    if (!firstLoad.current && entry?.isIntersecting && profile?.permissions?.reports?.view_sales_report?.value) {
      firstLoad.current = true;
      dispatch(analyticsActions.users.getSalesByUser());
    }
  }, [entry, firstLoad.current, dispatch]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.SALES.SALES_BY_USER.path);
  };

  const handleSort = () => {
    setSortByValue((prev) => !prev);
  };

  return (
    <CardRoot
      loading={loading}
      title="Ventas por usuario"
      extra={
        <div className="flex gap-3">
          {user_auth?.profile?.permissions?.reports?.view_sales_report?.value && hasAccess('view_sales_report') ? (
            <Tooltip title="Ver reporte completo">
              <Button onClick={onActionClick} icon={<SquareChartGantt className="w-4 h-4" />} />
            </Tooltip>
          ) : null}
          <Button onClick={() => handlePrint()} icon={<CloudDownload className="w-4 h-4" />} />
          <Button
            onClick={handleSort}
            icon={sortByValue ? <Shuffle className="w-4 h-4" /> : <ArrowDown01 className="w-4 h-4" />}
          />
        </div>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div ref={ref}>
        <div className="w-full" ref={elementRef}>
          {charts?.total_sales?.length ? (
            <>
              <div className="h-64 md:h-96">
                <ExpensesPieChart data={charts?.total_sales} sortByValue={sortByValue} hideData={hideData} />
              </div>
            </>
          ) : (
            <ReportEmpty />
          )}
        </div>
      </div>
    </CardRoot>
  );
};

export default SalesByUserShortcutReport;

import { Button, Empty, Tooltip } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useMembershipAccess } from '@/routes/module-access';
import {
  ArrowDown01,
  CloudDownload,
  Shuffle,
  SquareChartGantt,
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useEffect, useRef, useState } from 'react';
import ExpensesPieChart from '@/components/pages/reports/expenses/shortcut/chart';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { analyticsActions } from '@/redux/reducers/analytics';

const ExpensesShortcutReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasAccess } = useMembershipAccess();
  const { loading, charts } = useAppSelector(
    ({ analytics }) => analytics?.expenses || {},
  );
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
    if (
      !firstLoad.current &&
      entry?.isIntersecting &&
      profile?.permissions?.reports?.view_sales_report?.value
    ) {
      firstLoad.current = true;
      dispatch(analyticsActions.expenses.getExpensesByWeek());
    }
  }, [entry, firstLoad.current, dispatch]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.EXPENSES.path);
  };

  const handleSort = () => {
    setSortByValue((prev) => !prev);
  };

  return (
    <CardRoot
      loading={loading}
      title="Gastos por categoría"
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
          <Button
            onClick={handleSort}
            icon={
              sortByValue ? (
                <Shuffle className="w-4 h-4" />
              ) : (
                <ArrowDown01 className="w-4 h-4" />
              )
            }
          />
        </div>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div ref={ref}>
        <div className="w-full" ref={elementRef}>
          {charts?.pie?.length ? (
            <>
              <div className="h-64 md:h-96">
                <ExpensesPieChart
                  data={charts?.pie}
                  sortByValue={sortByValue}
                />
              </div>
            </>
          ) : (
            <Empty description="Registra tus primeras ventas para visualizar información" />
          )}
        </div>
      </div>
    </CardRoot>
  );
};

export default ExpensesShortcutReport;

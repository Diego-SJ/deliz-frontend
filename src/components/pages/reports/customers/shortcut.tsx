import { Button, Tooltip } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { CloudDownload, SquareChartGantt } from 'lucide-react';
import { useMembershipAccess } from '@/routes/module-access';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { analyticsActions } from '@/redux/reducers/analytics';
import { Reports } from '../types';
import CustomerList from './full-report/customer-list';

const TopCustomersThumbnail = ({ hideData }: Reports) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasAccess } = useMembershipAccess();
  const { user_auth } = useAppSelector(({ users }) => users);
  const { loading, top_customers } = useAppSelector(
    ({ analytics }) => analytics?.customers || {},
  );
  const elementRef = useRef<any>(null);
  const firstLoad = useRef(false);
  const { profile } = user_auth;

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  useEffect(() => {
    if (!firstLoad.current && entry?.isIntersecting) {
      firstLoad.current = true;
      if (profile?.permissions?.reports?.view_customers_report?.value) {
        dispatch(analyticsActions.getTopCustomers());
      }
    }
  }, [entry, firstLoad.current, dispatch]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.CUSTOMERS.path);
  };

  return (
    <CardRoot
      loading={loading}
      title={
        <h5 className="!text-base m-0 font-medium">Los 10 mejores clientes</h5>
      }
      extra={
        <div className="flex gap-3">
          {user_auth?.profile?.permissions?.reports?.view_customers_report
            ?.value && hasAccess('view_customers_report') ? (
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
      <div ref={ref}>
        <div className="w-full" ref={elementRef}>
          <CustomerList data={top_customers} hideData={hideData} />
        </div>
      </div>
    </CardRoot>
  );
};

export default TopCustomersThumbnail;

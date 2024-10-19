import { Avatar, Button, Tooltip, Typography } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';
import { FileImageOutlined } from '@ant-design/icons';
import functions from '@/utils/functions';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CloudDownload, SquareChartGantt } from 'lucide-react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { Reports } from '../types';
import ReportEmpty from '@/components/atoms/report-empty';
import { useMembershipAccess } from '@/routes/module-access';
import { APP_ROUTES } from '@/routes/routes';
import { useNavigate } from 'react-router-dom';

const TopProductsThumbnail = ({ hideData, hideViewFullReportButton = false, hidePrintButton = false }: Reports) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user_auth } = useAppSelector(({ users }) => users);
  const { hasAccess } = useMembershipAccess();
  const { loading, top_products } = useAppSelector(({ analytics }) => analytics?.products || {});
  const elementRef = useRef<HTMLDivElement>(null);
  const firstLoad = useRef(false);
  const profile = user_auth?.profile;

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  useEffect(() => {
    if (!firstLoad.current && entry?.isIntersecting && profile?.permissions?.reports?.view_products_report?.value) {
      firstLoad.current = true;
      dispatch(analyticsActions.getTopProducts());
    }
  }, [entry, firstLoad.current, dispatch]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.PRODUCTS.path);
  };

  return (
    <CardRoot
      loading={loading}
      title="Productos más vendidos"
      extra={
        <div className="flex gap-3">
          {user_auth?.profile?.permissions?.reports?.view_products_report?.value &&
          hasAccess('view_products_report') &&
          !hideViewFullReportButton ? (
            <Tooltip title="Ver reporte completo">
              <Button onClick={onActionClick} icon={<SquareChartGantt className="w-4 h-4" />} />
            </Tooltip>
          ) : null}
          {!hidePrintButton && <Button onClick={() => handlePrint()} icon={<CloudDownload className="w-4 h-4" />} />}
        </div>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div ref={ref}>
        {top_products?.length ? (
          <div ref={elementRef}>
            <div className="flex flex-col h-64 md:h-96 print:!h-auto overflow-y-scroll">
              {top_products?.map((product, index) => {
                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-2 pl-1 pr-2 gap-4 border-t ${
                      index !== 0 ? 'border-slate-100' : 'border-transparent'
                    }`}
                  >
                    <Avatar
                      src={product?.image_url}
                      icon={<FileImageOutlined className="text-slate-400" />}
                      className="!w-10 !min-w-10 !h-10 p-1 rounded-xl bg-slate-400/10"
                    />
                    <Typography.Text className="!text-sm !m-0 text-start w-full">{product.name}</Typography.Text>
                    <Typography.Text className="!text-sm !m-0 !w-fit min-w-40 text-end">
                      {functions.number(product.total_quantity, {
                        hidden: hideData,
                      })}{' '}
                      <span className="text-neutral-400 text-xs">(unidades)</span>
                    </Typography.Text>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <ReportEmpty />
        )}
      </div>
    </CardRoot>
  );
};

export default TopProductsThumbnail;

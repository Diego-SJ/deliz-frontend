import { Button } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CloudDownload } from 'lucide-react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import ProductsList from './full-report/products-list';
import { Reports } from '../types';

const StockProductsShortcut = ({ hideData }: Reports) => {
  const dispatch = useAppDispatch();
  const { user_auth } = useAppSelector(({ users }) => users);
  const { loading, products_to_replenish } = useAppSelector(({ analytics }) => analytics?.products || {});
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
      dispatch(analyticsActions.products.getProductsToReplenish());
    }
  }, [entry, firstLoad.current, dispatch]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  return (
    <CardRoot
      loading={loading}
      title="Productos por reponer"
      extra={
        <div className="flex gap-3">
          <Button onClick={() => handlePrint()} icon={<CloudDownload className="w-4 h-4" />} />
        </div>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div ref={ref}>
        <ProductsList data={products_to_replenish} hideData={hideData} />
      </div>
    </CardRoot>
  );
};

export default StockProductsShortcut;

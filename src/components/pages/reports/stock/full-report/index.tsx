import { ArrowLeft, Printer } from 'lucide-react';
import { Button, Col, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import EyeButton, { useHideData } from '@/components/atoms/eye-button';
import ProductsList from './products-list';
import ProductsReportFilters from './filters';
import { analyticsActions } from '@/redux/reducers/analytics';

const ProductsFullReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { filters } = useAppSelector(({ analytics }) => analytics.products);
  const elementRef = useRef<any>(null);
  const firstRender = useRef(false);
  const { hideData, handleHideData } = useHideData();

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(analyticsActions.products.getTopProducts());
    }
  }, [firstRender]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  return (
    <div ref={elementRef} className="print:bg-white">
      <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center mb-5">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-3 items-center">
            <Button
              className="print:hidden"
              icon={<ArrowLeft strokeWidth={1.5} className="w-4 h-4" />}
              onClick={() => navigate(APP_ROUTES.PRIVATE.REPORTS.path)}
            />
            <Typography.Title level={4} className="!m-0">
              Reporte de Productos
            </Typography.Title>
          </div>
        </div>
        <div className="flex flex-row sm:items-center gap-3 print:hidden">
          <ProductsReportFilters />
          <Space.Compact>
            <Button
              type="primary"
              className="w-fit"
              icon={<Printer strokeWidth={1.5} className="w-4 h-4" />}
              onClick={() => handlePrint()}
            >
              Imprimir
            </Button>
            <EyeButton type="primary" onChange={handleHideData} hideData={hideData} />
          </Space.Compact>
        </div>
      </div>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <ProductsList hideData={hideData} />
        </Col>
      </Row>
    </div>
  );
};

export default ProductsFullReport;

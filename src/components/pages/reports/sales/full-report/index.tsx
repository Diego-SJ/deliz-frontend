import CardRoot from '@/components/atoms/Card';
import SaleInsight from '@/components/organisms/SaleReports/sale-insight';
import {
  ArrowLeft,
  CircleDollarSign,
  Printer,
  ShoppingCart,
  PiggyBank,
  Clock9,
} from 'lucide-react';
import { Button, Col, Row, Space, Typography } from 'antd';
import SalesReportFilters from './filters';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import LastCompletedSales from './last-completed-sales';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import numeral from 'numeral';
import Pendingsales from './pending-sales';
import CompletedSalesChart from './last-completed-sales/chart';
import PendingSalesChart from './pending-sales/chart';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { analyticsActions } from '@/redux/reducers/analytics';
import EyeButton, { useHideData } from '@/components/atoms/eye-button';
import functions from '@/utils/functions';

const SalesReports = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { total_sales_amount_chart_data, last_sales } = useAppSelector(
    ({ analytics }) => analytics.sales,
  );
  const { sales_summary, total_sales_chart_data, filters } = useAppSelector(
    ({ analytics }) => analytics.sales,
  );
  const elementRef = useRef<any>(null);
  const firstRender = useRef(false);
  const { hideData, handleHideData } = useHideData();

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(analyticsActions.sales.getFullDataByFilters());
      dispatch(analyticsActions.sales.getLastCompletedSales());
      dispatch(analyticsActions.sales.getLastPendingSales());
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
              Reporte de Ventas
            </Typography.Title>
          </div>
        </div>
        <div className="flex flex-row sm:items-center gap-3 print:hidden">
          <SalesReportFilters />
          <Space.Compact>
            <Button
              type="primary"
              className="w-fit"
              icon={<Printer strokeWidth={1.5} className="w-4 h-4" />}
              onClick={() => handlePrint()}
            >
              Imprimir
            </Button>
            <EyeButton
              type="primary"
              onChange={handleHideData}
              hideData={hideData}
            />
          </Space.Compact>
        </div>
      </div>
      <Row className="" gutter={[10, 10]}>
        <Col xs={24} md={12} lg={6}>
          <SaleInsight
            icon={<ShoppingCart className="text-indigo-600" />}
            title="ventas realizadas"
            value={functions.number(sales_summary?.completed_sales, {
              hidden: hideData,
            })}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <SaleInsight
            icon={<CircleDollarSign className="text-indigo-600" />}
            title="$ ventas completadas"
            value={functions.money(sales_summary?.completed_sales_amount, {
              hidden: hideData,
            })}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <SaleInsight
            icon={<Clock9 className="text-indigo-600" />}
            title="ventas pendientes"
            value={functions.number(sales_summary?.pending_sales, {
              hidden: hideData,
            })}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <SaleInsight
            icon={<PiggyBank className="text-indigo-600" />}
            title="$ ventas pendientes"
            value={functions.money(sales_summary?.pending_sales_amount, {
              hidden: hideData,
            })}
          />
        </Col>
        <Col xs={24} md={12} lg={12}>
          <CardRoot classNames={{ body: '!px-2' }} title="Ventas">
            <div className="h-[390px] w-full">
              <CompletedSalesChart
                data={total_sales_chart_data || []}
                range={filters?.date_range}
              />
            </div>
          </CardRoot>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <CardRoot classNames={{ body: '!px-2' }} title="Monto de las ventas">
            <div className="h-[390px] w-full">
              <PendingSalesChart
                range={filters?.date_range}
                data={total_sales_amount_chart_data || []}
              />
            </div>
          </CardRoot>
        </Col>

        <Col xs={24} md={12} lg={12}>
          <LastCompletedSales data={last_sales?.completed || []} />
        </Col>
        <Col xs={24} md={12} lg={12}>
          <Pendingsales data={last_sales?.pending || []} />
        </Col>
      </Row>
    </div>
  );
};

export default SalesReports;

import ProfitInsight from '@/components/organisms/SaleReports/profit-insight';
import functions from '@/utils/functions';
import { Badge, Col, Row, Typography } from 'antd';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { getTotalAmounts } from './total-profits';
import { useAppSelector } from '@/hooks/useStore';
import ProfitReportFilters from './filters';

const StatisticBody = ({ completed, pending }: { completed?: number; pending?: number }) => {
  return (
    <div className="flex justify-between mt-2 border-t pt-3">
      <p className="text-sm text-gray-600">
        <Badge status="success" /> Completado: {functions.money(completed || 0)}
      </p>
      <p className="text-sm text-gray-600">
        <Badge status="warning" /> Pendiente: {functions.money(pending || 0)}
      </p>
    </div>
  );
};

const ProfitsByRange = () => {
  const { profit } = useAppSelector(({ analytics }) => analytics);
  const [expensesTotalByRange, incomesTotalByRange, profitTotalByRange] = getTotalAmounts(profit?.summary_by_range);

  console.log(profit.summary_by_range);

  return (
    <>
      <div className="flex gap-5 w-full justify-between items-center mb-5">
        <Typography.Title level={5} className="!mb-0">
          Resumen por intervalo
        </Typography.Title>
        <ProfitReportFilters />
      </div>
      <Row className="mb-5" gutter={[10, 10]}>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<TrendingUp className="text-indigo-600 w-4" />}
            title="Entradas"
            size="small"
            value={incomesTotalByRange}
            showArrow
          >
            <StatisticBody
              completed={profit?.summary_by_range?.completed_sales}
              pending={profit?.summary_by_range?.pending_sales}
            />
          </ProfitInsight>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<TrendingDown className="text-indigo-600 w-4" />}
            title="Gastos"
            size="small"
            value={expensesTotalByRange}
            showArrow
          >
            <StatisticBody
              completed={profit?.summary_by_range?.completed_expenses}
              pending={profit?.summary_by_range?.pending_expenses}
            />
          </ProfitInsight>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<Wallet className="text-indigo-600 w-4" />}
            title="Ganancias"
            size="small"
            value={profitTotalByRange}
            showArrow
          >
            <div className="flex justify-between mt-2 border-t pt-3">
              <p className="text-sm text-gray-600">
                <Badge status="success" /> Completado:{' '}
                {functions.money(
                  (profit?.summary_by_range?.completed_sales || 0) - (profit?.summary_by_range?.completed_expenses || 0),
                )}
              </p>
              <p className="text-sm text-gray-600">
                <Badge status="warning" /> Pendiente:{' '}
                {functions.money(
                  (profit?.summary_by_range?.pending_sales || 0) - (profit?.summary_by_range?.pending_expenses || 0),
                )}
              </p>
            </div>
          </ProfitInsight>
        </Col>
      </Row>
    </>
  );
};

export default ProfitsByRange;

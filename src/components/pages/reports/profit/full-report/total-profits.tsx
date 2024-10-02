import { useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { Col, Row, Typography } from 'antd';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { ProfitSummary } from '@/redux/reducers/analytics/types';
import ProfitInsight from '@/components/organisms/SaleReports/profit-insight';

export const getTotalAmounts = (summary: ProfitSummary) => {
  let expensesTotal = (summary?.completed_expenses || 0) + (summary?.pending_expenses || 0);
  let incomesTotal = (summary?.completed_sales || 0) + (summary?.pending_sales || 0);
  let profitTotal = incomesTotal - expensesTotal;

  return [expensesTotal, incomesTotal, profitTotal];
};

const ProfitShorcutReport = () => {
  const { profit } = useAppSelector(({ analytics }) => analytics);
  const [expensesTotal, incomesTotal, profitTotal] = getTotalAmounts(profit?.summary);

  return (
    <>
      <Typography.Title level={5} className="mb-3">
        Histórico
      </Typography.Title>
      <Row className="mb-5" gutter={[10, 10]}>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<TrendingUp className="text-indigo-600 w-4" />}
            title="Entradas"
            size="small"
            value={incomesTotal}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<TrendingDown className="text-indigo-600 w-4" />}
            title="Gastos"
            size="small"
            value={expensesTotal}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight icon={<Wallet className="text-indigo-600 w-4" />} title="Ganancias" value={profitTotal} size="small" />
        </Col>
      </Row>
    </>
  );
};

export default ProfitShorcutReport;

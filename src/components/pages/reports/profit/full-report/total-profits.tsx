import { useAppSelector } from '@/hooks/useStore';
import { Col, Row, Typography } from 'antd';
import { ArrowDownToDotIcon, ArrowUpFromDotIcon, Wallet } from 'lucide-react';
import { ProfitSummary } from '@/redux/reducers/analytics/types';
import ProfitInsight from '@/components/organisms/SaleReports/profit-insight';
import { Reports } from '../../types';

export const getTotalAmounts = (summary: ProfitSummary) => {
  let expensesTotal =
    (summary?.completed_expenses || 0) + (summary?.pending_expenses || 0);
  let incomesTotal =
    (summary?.completed_sales || 0) + (summary?.pending_sales || 0);
  let profitTotal = incomesTotal - expensesTotal;

  return [expensesTotal, incomesTotal, profitTotal];
};

const ProfitShorcutReport = ({ hideData }: Reports) => {
  const { profit } = useAppSelector(({ analytics }) => analytics);
  const [expensesTotal, incomesTotal, profitTotal] = getTotalAmounts(
    profit?.summary,
  );

  return (
    <>
      <Typography.Title level={5} className="mb-3">
        Histórico
      </Typography.Title>
      <Row className="mb-5" gutter={[10, 10]}>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<ArrowDownToDotIcon className="text-indigo-600 w-4" />}
            title="Entradas"
            size="small"
            value={incomesTotal}
            discrete={hideData}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<ArrowUpFromDotIcon className="text-indigo-600 w-4" />}
            title="Salidas"
            size="small"
            value={expensesTotal}
            discrete={hideData}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<Wallet className="text-indigo-600 w-4" />}
            title="Ganancias"
            value={profitTotal}
            size="small"
            discrete={hideData}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProfitShorcutReport;

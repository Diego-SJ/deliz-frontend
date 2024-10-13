import ProfitInsight from '@/components/organisms/SaleReports/profit-insight';
import functions from '@/utils/functions';
import { Badge, Col, Row, Typography } from 'antd';
import { ArrowDownToDotIcon, ArrowUpFromDotIcon, Wallet } from 'lucide-react';
import { getTotalAmounts } from './total-profits';
import { useAppSelector } from '@/hooks/useStore';
import ProfitReportFilters from './filters';
import { Reports } from '../../types';

const StatisticBody = ({
  completed,
  pending,
  discrete = false,
}: {
  completed?: number;
  pending?: number;
  discrete?: boolean;
}) => {
  return (
    <div className="flex justify-between mt-2 border-t pt-3">
      <p className="text-sm text-gray-600">
        <Badge status="success" /> Completado:{' '}
        {functions.money(completed || 0, { hidden: discrete })}
      </p>
      <p className="text-sm text-gray-600">
        <Badge status="warning" /> Pendiente:{' '}
        {functions.money(pending || 0, { hidden: discrete })}
      </p>
    </div>
  );
};

const ProfitsByRange = ({ hideData }: Reports) => {
  const { profit } = useAppSelector(({ analytics }) => analytics);
  const [expensesTotalByRange, incomesTotalByRange, profitTotalByRange] =
    getTotalAmounts(profit?.summary_by_range);

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
            icon={<ArrowDownToDotIcon className="text-indigo-600 w-4" />}
            title="Entradas"
            size="small"
            value={incomesTotalByRange}
            showArrow
            discrete={hideData}
          >
            <StatisticBody
              completed={profit?.summary_by_range?.completed_sales}
              pending={profit?.summary_by_range?.pending_sales}
              discrete={hideData}
            />
          </ProfitInsight>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<ArrowUpFromDotIcon className="text-indigo-600 w-4" />}
            title="Salidas"
            size="small"
            value={expensesTotalByRange}
            showArrow
            discrete={hideData}
          >
            <StatisticBody
              completed={profit?.summary_by_range?.completed_expenses}
              pending={profit?.summary_by_range?.pending_expenses}
              discrete={hideData}
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
            discrete={hideData}
          >
            <div className="flex justify-between mt-2 border-t pt-3">
              <p className="text-sm text-gray-600">
                <Badge status="success" /> Completado:{' '}
                {functions.money(
                  (profit?.summary_by_range?.completed_sales || 0) -
                    (profit?.summary_by_range?.completed_expenses || 0),
                  { hidden: hideData },
                )}
              </p>
              <p className="text-sm text-gray-600">
                <Badge status="warning" /> Pendiente:{' '}
                {functions.money(
                  (profit?.summary_by_range?.pending_sales || 0) -
                    (profit?.summary_by_range?.pending_expenses || 0),
                  { hidden: hideData },
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

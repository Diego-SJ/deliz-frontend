import ProfitInsight from '@/components/organisms/SaleReports/profit-insight';
import { Col, Row } from 'antd';
import { ArrowDownToDotIcon } from 'lucide-react';
import { useAppSelector } from '@/hooks/useStore';

const ProfitsByRange = () => {
  const { expenses } = useAppSelector(({ analytics }) => analytics);

  return (
    <>
      <Row className="mb-0" gutter={[10, 10]}>
        <Col xs={24} md={12} lg={8}>
          <ProfitInsight
            icon={<ArrowDownToDotIcon className="text-indigo-600 w-4" />}
            title="Gastos"
            size="small"
            value={expenses?.charts?.totalAmount || 0}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProfitsByRange;

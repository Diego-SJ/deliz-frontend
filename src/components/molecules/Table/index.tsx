import functions from '@/utils/functions';
import { ReloadOutlined } from '@ant-design/icons';
import { Table as TableRoot, TableProps, Row, Col, Tooltip, Button } from 'antd';
import React from 'react';

type Props = {
  onRefresh?: () => void;
  totalItems?: number;
  totalAmount?: number;
} & TableProps<any>;

const Table: React.FC<Props> = ({ onRefresh, totalItems, ...props }) => {
  return (
    <div style={{ position: 'relative' }}>
      <TableRoot {...props} />

      <Row gutter={[20, 20]} style={{ position: 'absolute', bottom: props?.dataSource?.length ? '15px' : '-30px' }}>
        <Col>
          <Tooltip title="Recargar">
            <Button size="small" type="text" icon={<ReloadOutlined rev={{}} />} onClick={onRefresh}>
              Recargar
            </Button>
          </Tooltip>
        </Col>

        <Col style={{ padding: '3px 0 3px 10px' }}>
          <span>{props?.dataSource?.length || 0} elementos</span>
        </Col>

        {Number(props?.totalAmount) >= 0 && (
          <Col style={{ padding: '3px 0 3px 10px' }}>
            <span>{functions.money(props?.totalAmount || 0)}</span>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Table;

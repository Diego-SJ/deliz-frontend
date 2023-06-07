import { Table as TableRoot } from 'antd';
import { RefTable } from 'antd/es/table/interface';
import React from 'react';

const Table: React.FC<RefTable> = ({ ...props }) => {
  return <TableRoot {...props} />;
};

export default Table;

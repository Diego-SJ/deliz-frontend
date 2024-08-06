import { List, ListProps as ListPropsAnt } from 'antd';
import styled from 'styled-components';

interface CustomListProps<T> extends ListPropsAnt<T> {
  $bodyHeight?: string;
}

const StyledList = styled(List)<CustomListProps<any>>`
  &.ant-list {
    .ant-list-items {
      max-height: ${props => props.$bodyHeight || '100%'} !important;
      min-height: ${props => props.$bodyHeight || '100%'} !important;
      overflow-y: auto;
    }

    .ant-list-pagination {
      margin: 0;
      padding: 8px 0;
      border-top: 1px solid #f0f0f0;
    }
  }
`;

const PaginatedList = <T,>(props: CustomListProps<T>) => {
  const { $bodyHeight, className, ...restProps } = props;

  return (
    <StyledList
      {...(restProps as any)}
      $bodyHeight={$bodyHeight}
      pagination={restProps.pagination ?? { position: 'bottom', align: 'center' }}
      className={`${className || ''} bg-white rounded-lg shadow-lg`}
    />
  );
};

export default PaginatedList;

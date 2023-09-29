import { Table, TableProps } from 'antd';
import styled from 'styled-components';

export const ProductName = styled.span`
  font-size: 12px;
  font-weight: 600;
  display: block;
  margin-bottom: -5px;
`;

export const ProductCategory = styled.span`
  font-size: 12px;
  font-weight: 400;
  display: block;
  color: gray;
`;

export const ProductCell = styled.span`
  font-size: 12px;
  font-weight: 400;
  display: block;
`;

export const ImageLogo = styled.img`
  min-width: 80px;
  max-width: 80px;
  min-height: 80px;
  max-height: 80px;
  margin-top: -10px;
`;

export const CustomTable = styled(Table)`
  &.ant-table-wrapper {
    table {
      thead.ant-table-thead {
        th.ant-table-cell {
          font-size: 12px !important;
        }
      }

      tbody.ant-table-tbody {
        tr.ant-table-row {
          td.ant-table-cell {
            padding: 4px 10px !important;
          }
        }
      }
    }
  }
`;

export const FooterReceipt = styled.div`
  padding: 10px 5px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const DrawerBody = styled.div`
  width: 100%;
  background-color: #ffffff;
  padding: 25px 0 20px;
`;

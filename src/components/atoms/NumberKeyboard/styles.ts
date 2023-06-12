import { Col } from 'antd';
import styled from 'styled-components';

export const CardBtn = styled(Col)`
  &.ant-col {
    display: flex;
    justify-content: center;
    .ant-btn {
      height: 60px;
      font-size: 20px;
      font-weight: 600;

      &.expand {
        transform: scale(1.3);
      }
    }
  }
`;

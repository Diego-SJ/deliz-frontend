import { Header } from 'antd/lib/layout/layout';
import styled from 'styled-components';

export const HeaderRoot = styled(Header)`
  padding: 0 20px 0 16px;
  background: transparent;

  display: flex;
  align-items: center;
  justify-content: space-between;

  .ant-typography {
    margin: 0;
  }
`;

export const HeaderActions = styled.div`
  height: 100%;
  display: flex;
  align-items: center;

  .ant-divider {
    height: 54%;
    margin: 0 25px;
    border-left: 1px solid ${({ theme }) => theme.colors.tertiary};
  }

  .anticon {
    cursor: pointer;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`;

import { Header } from 'antd/lib/layout/layout';
import styled from 'styled-components';

export const HeaderRoot = styled(Header)`
  padding: 0 20px 0 16px;
  background: ${({ theme }) => theme.colors.background.primary};

  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 9px -5px rgba(0, 0, 0, 0.6);
  z-index: 3;

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
    margin: 0 15px;
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

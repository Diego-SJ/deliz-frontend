import { Header } from 'antd/lib/layout/layout';
import styled from 'styled-components';

export const HeaderRoot = styled(Header)`
  height: 60px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.background.primary};

  display: flex;
  align-items: center;
  justify-content: space-between;
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

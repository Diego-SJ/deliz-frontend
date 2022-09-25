import Layout from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import styled from 'styled-components';

export const LayoutRoot = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.secondary};
`;

export const LayoutSider = styled(Sider)`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  min-height: 100vh;
  max-height: 100vh;
  overflow: auto;
  background: ${({ theme }) => theme.colors.background.primary};
`;

export const LayoutContainer = styled(Layout)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

export const LayoutContent = styled(Layout)`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

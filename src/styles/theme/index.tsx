import React from 'react';
import { ThemeProvider as AppStyledTheme } from 'styled-components';
import { ConfigProvider } from 'antd';
import GlobalStyles from '@/styles/global';
import { theme } from './config';

interface Props {
  children: React.ReactNode;
}

ConfigProvider.config({
  theme: {
    primaryColor: '#1890FF',
  },
});

const AppThemeProvider = ({ children }: Props) => {
  return (
    <AppStyledTheme theme={theme}>
      <GlobalStyles theme={theme} />
      <>{children}</>
    </AppStyledTheme>
  );
};

export default AppThemeProvider;

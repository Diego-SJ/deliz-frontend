import React from 'react';
import { ThemeProvider as AppStyledTheme } from 'styled-components';
import { ConfigProvider } from 'antd';
import GlobalStyles from '@/styles/global';
import { theme } from './config';

interface Props {
  children: React.ReactNode;
}

const AppThemeProvider = ({ children }: Props) => {
  return (
    <AppStyledTheme theme={theme}>
      <GlobalStyles theme={theme} />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme.colors.primary,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AppStyledTheme>
  );
};

export default AppThemeProvider;

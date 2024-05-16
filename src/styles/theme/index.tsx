import React from 'react';
import { ThemeProvider as AppStyledTheme } from 'styled-components';
import { ConfigProvider, App } from 'antd';
import GlobalStyles from '@/styles/global';
import { theme } from './config';
import '../index.css';

interface Props {
  children: React.ReactNode;
}

const AppThemeProvider = ({ children }: Props) => {
  return (
    <AppStyledTheme theme={theme}>
      <GlobalStyles theme={theme} />
      <App>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: theme.colors.primary,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </App>
    </AppStyledTheme>
  );
};

export default AppThemeProvider;

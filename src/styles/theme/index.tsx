import React from 'react';
import { ThemeProvider as AppStyledTheme } from 'styled-components';
import { ConfigProvider, App } from 'antd';
import GlobalStyles from '@/styles/global';
import { theme } from './config';
import locale from 'antd/locale/es_ES';
import dayjs from 'dayjs';

import '../index.css';

dayjs.locale('es-mx');

interface Props {
  children: React.ReactNode;
}

const AppThemeProvider = ({ children }: Props) => {
  return (
    <AppStyledTheme theme={theme}>
      <GlobalStyles theme={theme} />
      <App>
        <ConfigProvider
          locale={locale}
          theme={{
            token: {
              colorPrimary: theme.colors.primary,
              colorLink: theme.colors.secondary,
            },
            components: {
              Tag: {
                borderRadius: 5,
              },
              Table: {
                colorText: 'rgba(0, 0, 0, 0.45)',
              },
              Drawer: {
                motion: false,
                motionBase: 0.1,
                motionDurationMid: '0.1s',
                motionEaseInBack: 'unset',
              },
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

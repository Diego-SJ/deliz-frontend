// PageTitleContext.tsx
import { APP_ROUTES } from '@/routes/routes';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTitleContextProps {
  title: string;
}

const PageTitleContext = createContext<PageTitleContextProps | undefined>(undefined);

interface PageTitleProviderProps {
  children: ReactNode;
}

export const PageTitleProvider: React.FC<PageTitleProviderProps> = ({ children }) => {
  const [title, setTitle] = useState<string>('Home');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path)) {
      setTitle(APP_ROUTES.PRIVATE.DASHBOARD.HOME.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path)) {
      setTitle(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path)) {
      setTitle(APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.DASHBOARD.SALES.path)) {
      setTitle(APP_ROUTES.PRIVATE.DASHBOARD.SALES.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CURRENT_CASHIER.path)) {
      setTitle(APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CURRENT_CASHIER.title);
    }

    if (location.pathname.includes(APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path)) {
      setTitle(APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path)) {
      setTitle(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.DASHBOARD.PURCHASES_EXPENSES.path)) {
      setTitle(APP_ROUTES.PRIVATE.DASHBOARD.PURCHASES_EXPENSES.title);
    }
  }, [location.pathname]);

  return <PageTitleContext.Provider value={{ title }}>{children}</PageTitleContext.Provider>;
};

export const usePageTitle = (): PageTitleContextProps => {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
};

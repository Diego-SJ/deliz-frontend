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
    if (location.pathname.includes(APP_ROUTES.PRIVATE.HOME.path)) {
      setTitle(APP_ROUTES.PRIVATE.HOME.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.PRODUCTS.path)) {
      setTitle(APP_ROUTES.PRIVATE.PRODUCTS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.CUSTOMERS.path)) {
      setTitle(APP_ROUTES.PRIVATE.CUSTOMERS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.SALES.path)) {
      setTitle(APP_ROUTES.PRIVATE.SALES.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.TRANSACTIONS.CURRENT_CASHIER.path)) {
      setTitle(APP_ROUTES.PRIVATE.TRANSACTIONS.CURRENT_CASHIER.title);
    }

    if (location.pathname.includes(APP_ROUTES.PRIVATE.TRANSACTIONS.CASHIERS.path)) {
      setTitle(APP_ROUTES.PRIVATE.TRANSACTIONS.CASHIERS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.SETTINGS.path)) {
      setTitle(APP_ROUTES.PRIVATE.SETTINGS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.path)) {
      setTitle(APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.REPORTS.path)) {
      setTitle(APP_ROUTES.PRIVATE.REPORTS.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.MEMBERSHIP.path)) {
      setTitle(APP_ROUTES.PRIVATE.MEMBERSHIP.title);
    }
    if (location.pathname.includes(APP_ROUTES.PRIVATE.ONLINE_STORE.path)) {
      setTitle(APP_ROUTES.PRIVATE.ONLINE_STORE.title);
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

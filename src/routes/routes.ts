export const APP_ROUTES = {
  PUBLIC: {
    PRODUCTS: { path: '/products' },
  },
  AUTH: {
    MAIN: {
      path: '/',
      title: 'E-commerce',
    },
    SIGN_IN: { path: '/login', title: 'Inicio de sesión' },
    SIGN_IN_ADMIN: { path: '/admin', title: 'Inicio de sesión' },
    SIGN_UP: { path: '/sign-up', title: 'Registro' },
  },
  PRIVATE: {
    MAIN: '/app',
    CASH_REGISTER: {
      MAIN: { path: '/cash-register', title: 'Caja registradora' },
    },
    DASHBOARD: {
      HOME: { path: '/app/home', title: 'Inicio' },
      PRODUCTS: {
        path: '/app/products',
        title: 'Productos',
        CATEGORIES: { path: '/app/products/categories' },
        SIZES: { path: '/app/products/sizes' },
        UNITS: { path: '/app/products/units' },
      },
      PRODUCT_EDITOR: {
        path: '/app/products/:action',
        hash: (_: TemplateStringsArray, action: 'edit' | 'add') => `/app/products/${action}`,
        title: 'Editar producto',
      },
      PRODUCTS_ID: { path: (_: TemplateStringsArray, id: number) => `/app/products/${id}`, title: 'Productos' },
      CUSTOMERS: { path: '/app/customers', title: 'Clientes' },
      SALES: { path: '/app/sales', title: 'Ventas' },
      SALE_DETAIL: {
        path: '/app/sales/detail/:sale_id',
        hash: (_: TemplateStringsArray, id: number) => `/app/sales/detail/${id}`,
        title: 'Editar producto',
      },
      TRANSACTIONS: {
        path: '/app/transactions',
        title: 'Cierre de ventas',
        OPERATING_EXPENSES: { path: '/app/transactions/operating-expenses' },
        CASHIERS: { path: '/app/transactions/cashiers' },
      },
      ORDERS: {
        path: '/app/orders',
        title: 'Pedidos',
        OPERATING_EXPENSES: { path: '/app/transactions/operating-expenses' },
        CASHIERS: { path: '/app/transactions/cashiers' },
      },
      DEBTORS: { path: '/app/debtor-clients', title: 'Clientes deudores' },
      REPORTS: { path: '/app/reports', title: 'Reportes', PRODUCTS: { path: '/app/reports/products' } },
      SETTINGS: { path: '/app/settings', title: 'Configuración' },
    },
  },
};

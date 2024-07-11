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
        CASHIER_DETAIL: {
          path: '/app/transactions/cashiers/:cashier_id',
          hash: (_: TemplateStringsArray, cashier_id: number) => `/app/transactions/cashiers/${cashier_id}`,
        },
        CURRENT_CASHIER: { path: '/app/transactions/current-cashier' },
      },
      ORDERS: {
        path: '/app/orders',
        title: 'Pedidos',
        OPERATING_EXPENSES: { path: '/app/transactions/operating-expenses' },
        CASHIERS: { path: '/app/transactions/cashiers' },
      },
      DEBTORS: { path: '/app/debtor-clients', title: 'Clientes deudores' },
      REPORTS: { path: '/app/reports', title: 'Reportes', PRODUCTS: { path: '/app/reports/products' } },
      SETTINGS: {
        path: '/app/settings',
        title: 'Configuración',
        USERS: { path: '/app/settings/users' },
        GENERAL: { path: '/app/settings/general' },
        BRANCHES: {
          path: '/app/settings/branches',
          ADD: {
            path: '/app/settings/branches/add',
          },
          EDIT: {
            path: '/app/settings/branches/edit/:branch_id',
            hash: (_: TemplateStringsArray, branch_id: string) => `/app/settings/branches/edit/${branch_id}`,
          },
        },
        PRICES_LIST: { path: '/app/settings/prices-list' },
        CATEGORIES: { path: '/app/settings/categories' },
        SIZES: {
          path: '/app/settings/sizes',
        },
        UNITS: {
          path: '/app/settings/units',
        },
      },
    },
  },
};

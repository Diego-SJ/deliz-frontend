export const APP_ROUTES = {
  PUBLIC: {
    PRODUCTS: { path: '/products' },
    TERMS_AND_CONDITIONS: { path: '/terms-and-conditions' },
    PRIVACY_POLICY: { path: '/privacy-policy' },
  },
  AUTH: {
    MAIN: {
      path: '/',
      title: 'E-commerce',
    },
    SIGN_IN: { path: '/login-deprecated', title: 'Inicio de sesión' },
    SIGN_IN_ADMIN: { path: '/login', title: 'Inicio de sesión' },
    SIGN_UP: {
      path: '/sign-up',
      title: 'Registro',

      ONBOARDING: {
        path: '/sign-up/onboarding',
        hash: (_: TemplateStringsArray, step: number) => `/sign-up/step/${step}`,
        title: 'Registro',
      },
    },
  },
  PRIVATE: {
    MAIN: '/app',
    CASH_REGISTER: {
      MAIN: { path: '/cash-register', title: 'Caja registradora' },
    },
    AI_CHAT: {
      path: '/app/ai-chat',
      title: 'Asistente IA',
    },
    HOME: { path: '/app/home', title: 'Inicio' },
    PRODUCTS: {
      path: '/app/products',
      title: 'Productos',
      CATEGORIES: { path: '/app/products/categories' },
      SIZES: { path: '/app/products/sizes' },
      UNITS: { path: '/app/products/units' },
    },
    PRODUCT_EDITOR: {
      path: '/app/products/:action/:product_id',
      hash: (_: TemplateStringsArray, action: 'edit' | 'add', product_id?: number) =>
        `/app/products/${action}/${product_id || 'new'}`,
      title: 'Editar producto',
    },
    PRODUCTS_ID: {
      path: (_: TemplateStringsArray, id: number) => `/app/products/${id}`,
      title: 'Productos',
    },
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
      CASHIERS: { path: '/app/transactions/cashiers', title: 'Cortes de caja' },
      CASHIER_DETAIL: {
        path: '/app/transactions/cashiers/:cash_cut_id',
        hash: (_: TemplateStringsArray, cash_cut_id: string) => `/app/transactions/cashiers/${cash_cut_id}`,
      },
      CURRENT_CASHIER: {
        path: '/app/transactions/current-cashier',
        title: 'Caja registradora',
      },
    },
    ORDERS: {
      path: '/app/orders',
      title: 'Pedidos',
      OPERATING_EXPENSES: { path: '/app/transactions/operating-expenses' },
      CASHIERS: { path: '/app/transactions/cashiers' },
    },
    PURCHASES_EXPENSES: {
      path: '/app/purchases-expenses',
      title: 'Gastos',
      ADD_NEW: {
        path: '/app/purchases-expenses/:action/:operation_type',
        title: 'Agregar operación',
        hash: (_: TemplateStringsArray, operation_type: 'expense' | 'purchase') =>
          `/app/purchases-expenses/add/${operation_type}`,
      },
      EDIT: {
        path: '/app/purchases-expenses/:action/:operation_type/:operating_cost_id',
        title: 'Editar operación',
        hash: (_: TemplateStringsArray, operation_type: string, id: string) =>
          `/app/purchases-expenses/edit/${operation_type}/${id}`,
      },
    },
    DEBTORS: { path: '/app/debtor-clients', title: 'Clientes deudores' },
    REPORTS: {
      path: '/app/reports',
      title: 'Reportes',
      PRODUCTS: {
        path: '/app/reports/products',
        title: 'Reporte de productos',
      },
      STOCK: {
        path: '/app/reports/stock',
        title: 'Reporte de stock',
      },
      SALES: {
        path: '/app/reports/sales',
        title: 'Reporte de ventas',
        SALES_BY_USER: {
          path: '/app/reports/sales-by-user',
          title: 'Ventas por usuario',
        },
      },
      PROFIT: {
        path: '/app/reports/profit',
        title: 'Reporte de ganancias',
      },
      EXPENSES: {
        path: '/app/reports/expenses',
        title: 'Reporte de gastos',
      },
      CUSTOMERS: {
        path: '/app/reports/customers',
        title: 'Reporte de clientes',
      },
    },
    ONLINE_STORE: { path: '/app/online-store', title: 'Catálogo en linea' },
    SETTINGS: {
      path: '/app/settings',
      title: 'Configuración',
      USERS: {
        path: '/app/settings/users',
        ADD: { path: '/app/settings/users/add' },
        EDIT: {
          path: '/app/settings/users/edit/:profile_id',
          hash: (_: TemplateStringsArray, user_id: string) => `/app/settings/users/edit/${user_id}`,
        },
      },
      GENERAL: { path: '/app/settings' },
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
      CASH_REGISTERS: {
        path: '/app/settings/cash-registers',
      },
      PRICES_LIST: { path: '/app/settings/prices-list' },
      CATEGORIES: { path: '/app/settings/categories' },
      SIZES: {
        path: '/app/settings/sizes',
      },
      UNITS: {
        path: '/app/settings/units',
      },
      PRINTER: {
        path: '/app/settings/printer',
      },
    },
    MEMBERSHIP: {
      path: '/app/membership',
      title: 'Membresía',
    },
  },
};

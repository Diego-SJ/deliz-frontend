export const APP_ROUTES = {
  AUTH: {
    MAIN: {
      path: '/',
      title: 'E-commerce',
    },
    SIGN_IN: { path: '/login', title: 'Inicio de sesión' },
    SIGN_UP: { path: '/sign-up', title: 'Registro' },
  },
  PRIVATE: {
    MAIN: '/app',
    DASHBOARD: {
      HOME: { path: '/app/home', title: 'Inicio' },
      PRODUCTS: { path: '/app/products', title: 'Productos' },
      PRODUCTS_ID: { path: (_: TemplateStringsArray, id: number) => `/app/products/${id}`, title: 'Productos' },
      CUSTOMERS: { path: '/app/customers', title: 'Clientes' },
      ORDERS: { path: '/app/orders', title: 'Ordenes' },
      REPORTS: { path: '/app/reports', title: 'Reportes' },
      SETTINGS: { path: '/app/settings', title: 'Configuración' },
    },
  },
};

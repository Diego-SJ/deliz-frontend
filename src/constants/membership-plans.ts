export const PLANS_IDS = {
  BASIC: 1,
  ESSENTIAL: 2,
  ADVANCED: 3,
  PRO: 4,
};

export const PLANS_NAMES = {
  [PLANS_IDS.BASIC]: 'Básico',
  [PLANS_IDS.ESSENTIAL]: 'Esencial',
  [PLANS_IDS.ADVANCED]: 'Avanzado',
  [PLANS_IDS.PRO]: 'Pro',
};

export const PLANS_PRICES = [
  {
    id: PLANS_IDS.BASIC,
    title: 'Plan Básico',
    price: {
      monthly: 99,
      annualy: 79,
    },
    items: [
      { label: '1 usuario', tooltip: null },
      { label: '1 sucursal', tooltip: null },
      {
        label: '100 productos',
        tooltip: 'Podrás registrar hasta 100 productos en tu catálogo',
      },
      { label: 'Ventas ilimitadas', tooltip: null },
    ],
    planItems: [
      { label: 'Punto de venta', tooltip: null },
      { label: 'Gestión de clientes', tooltip: null },
      { label: 'Actualizaciones gratuitas', tooltip: null },
    ],
    buttonText: 'Elegir plan',
  },
  {
    id: PLANS_IDS.ESSENTIAL,
    title: 'Plan Esencial',
    price: {
      monthly: 149,
      annualy: 119,
    },
    items: [
      { label: '2 usuarios', tooltip: null },
      { label: '1 sucursal', tooltip: null },
      { label: 'Productos ilimitados', tooltip: null },
      { label: 'Ventas ilimitadas', tooltip: null },
    ],
    subTitle: 'Incluye Plan Inicial, Más',
    planItems: [
      { label: 'Cortes de caja', tooltip: null },
      { label: 'Gastos', tooltip: null },
      { label: 'Catálogo en línea', tooltip: null },
    ],
    buttonText: 'Elegir plan',
  },
  {
    id: PLANS_IDS.ADVANCED,
    title: 'Plan Avanzado',
    price: {
      monthly: 299,
      annualy: 239,
    },
    isPopular: true,
    items: [
      { label: '3 usuarios por sucursal', tooltip: null },
      {
        label: '+2 sucursales',
        tooltip:
          'Tendrás 2 sucursales incluidas. Agrega nuevas sucursales por $100 MXN al mes por cada una.',
      },
      { label: 'Productos ilimitados', tooltip: null },
      { label: 'Ventas ilimitadas', tooltip: null },
    ],
    subTitle: 'Incluye Plan Esencial, Más',
    planItems: [
      { label: 'Permisos personalizados', tooltip: null },
      { label: 'Pedidos por Whatsapp', tooltip: null },
      { label: 'Reportes', tooltip: null },
      { label: 'Soporte prioritario', tooltip: null },
    ],
    buttonText: 'Elegir plan',
  },
  {
    id: PLANS_IDS.PRO,
    title: 'Plan Pro',
    price: {
      monthly: 499,
      annualy: 399,
    },
    items: [
      { label: 'Usuarios ilimitados', tooltip: null },
      {
        label: '+3 sucursales',
        tooltip:
          'Tendrás 3 sucursales incluidas. Agrega nuevas sucursales por $100 MXN al mes por cada una.',
      },
      { label: 'Productos ilimitados', tooltip: null },
      { label: 'Ventas ilimitadas', tooltip: null },
    ],
    subTitle: 'Incluye Plan Avanzado, Más',
    planItems: [
      { label: 'Soporte personalizado', tooltip: null },
      { label: 'Reportes avanzados', tooltip: null },
      { label: 'Landing page', tooltip: null },
      {
        label: 'Almacenamiento ilimitado',
        tooltip:
          'Agrega evidencias a tus gastos e imagenes a tus productos de forma ilimitada.',
      },
    ],
    buttonText: 'Elegir plan',
  },
];

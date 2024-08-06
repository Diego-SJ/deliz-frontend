export const STATUS_DATA = {
  ACTIVE: {
    id: 1,
    name: 'Activo',
    color: '#87d068',
    scopes: {
      sales: true,
      products: true,
    },
  },
  HIDDEN: {
    id: 2,
    name: 'Oculto',
    color: '#e7bc6c',
    scopes: {
      sales: true,
      products: false,
    },
  },
  DELETED: {
    id: 3,
    name: 'Eliminado',
    color: '#f50',
    scopes: {
      sales: true,
      products: true,
    },
  },
  COMPLETED: {
    id: 4,
    name: 'Pagado',
    color: '#87d068',
    scopes: {
      sales: true,
      products: false,
    },
  },
  PENDING: {
    id: 5,
    name: 'Pendiente',
    color: '#e7bc6c',
    scopes: {
      sales: true,
      products: false,
    },
  },
  CANCELED: {
    id: 6,
    name: 'Cancelado',
    color: '#f50',
    scopes: {
      sales: true,
      products: false,
    },
  },
  ORDER: {
    id: 7,
    name: 'Pedido',
    color: '#e7bc6c',
    scopes: {
      sales: true,
      products: false,
    },
  },
};

export const STATUS_OBJ: { [key: number]: { name: string; color: string } } = {
  1: { name: 'Activo', color: 'green' },
  2: { name: 'Oculto', color: 'gold' },
  3: { name: 'Eliminado', color: 'volcano' },
  4: { name: 'Pagada', color: 'green' },
  5: { name: 'Pendiente', color: 'gold' },
  6: { name: 'Cancelada', color: 'orange' },
  7: { name: 'Pedido', color: 'geekblue' },
};

export const STATUS = [
  { id: 1, name: 'Activo', color: '#2db7f5' },
  { id: 2, name: 'Oculto', color: '#e7bc6c' },
  { id: 3, name: 'Eliminado', color: '#f50' },
  { id: 4, name: 'Completado', color: '#87d068' },
  { id: 5, name: 'Pendiente', color: '#e7bc6c' },
  { id: 6, name: 'Cancelado', color: '#f50' },
  { id: 7, name: 'Pedido', color: '#e7bc6c' },
];

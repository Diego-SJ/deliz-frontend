export const STATUS_DATA = {
  ACTIVE: { id: 1, name: 'Activo', color: '#87d068' },
  HIDDEN: { id: 2, name: 'Oculto', color: '#e7bc6c' },
  DELETED: { id: 3, name: 'Eliminado', color: '#f50' },
  COMPLETED: { id: 4, name: 'Completado', color: '#87d068' },
  PENDING: { id: 5, name: 'Pendiente', color: '#e7bc6c' },
  CANCELED: { id: 6, name: 'Cancelado', color: '#f50' },
};

export const STATUS_OBJ: { [key: number]: { name: string; color: string } } = {
  1: { name: 'Activo', color: '#2db7f5' },
  2: { name: 'Oculto', color: '#e7bc6c' },
  3: { name: 'Eliminado', color: '#f50' },
  4: { name: 'Pagada', color: '#87d068' },
  5: { name: 'Pendiente', color: '#e7bc6c' },
  6: { name: 'Cancelada', color: '#f50' },
};

export const STATUS = [
  { id: 1, name: 'Activo', color: '#2db7f5' },
  { id: 2, name: 'Oculto', color: '#e7bc6c' },
  { id: 3, name: 'Eliminado', color: '#f50' },
  { id: 4, name: 'Completado', color: '#87d068' },
  { id: 5, name: 'Pendiente', color: '#e7bc6c' },
  { id: 6, name: 'Cancelado', color: '#f50' },
];

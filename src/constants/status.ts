export const STATUS_DATA = {
  ACTIVE: { id: 1, name: 'Activo', color: 'green' },
  HIDDEN: { id: 2, name: 'Oculto', color: 'gold' },
  DELETED: { id: 3, name: 'Eliminado', color: 'volcano' },
  COMPLETED: { id: 4, name: 'Completado', color: 'green' },
  PENDING: { id: 5, name: 'Pendiente', color: 'gold' },
  CANCELED: { id: 6, name: 'Cancelado', color: 'volcano' },
};

export const STATUS_OBJ: { [key: number]: { name: string; color: string } } = {
  1: { name: 'Activo', color: 'lime' },
  2: { name: 'Oculto', color: 'gold' },
  3: { name: 'Eliminado', color: 'volcano' },
  4: { name: 'Pagada', color: 'green' },
  5: { name: 'Pendiente', color: 'gold' },
  6: { name: 'Cancelada', color: 'voclano' },
};

export const STATUS = [
  { id: 1, name: 'Activo', color: 'lime' },
  { id: 2, name: 'Oculto', color: 'gold' },
  { id: 3, name: 'Eliminado', color: 'volcano' },
  { id: 4, name: 'Completado', color: 'green' },
  { id: 5, name: 'Pendiente', color: 'gold' },
  { id: 6, name: 'Cancelado', color: 'volcano' },
];

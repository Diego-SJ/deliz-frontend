export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'CC', label: 'Tarjeta de crédito' },
  { value: 'DC', label: 'Tarjeta de débito' },
  { value: 'TRANSFER', label: 'Transferencia' },
];

export const PAYMENT_METHODS_KEYS = {
  CASH: 'CASH',
  CC: 'CC',
  DC: 'DC',
  TRANSFER: 'TRANSFER',
};

export const PAYMENT_METHOD_NAME: { [key: string]: string } = {
  CASH: 'en efectivo',
  CC: 'con tarjeta',
  DC: 'con tarjeta',
  CARD: 'con tarjeta',
  TRANSFER: 'por transferencia',
};

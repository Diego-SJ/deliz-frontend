import { subDays, subHours, subMinutes } from 'date-fns';

export const PROFILE_PIC =
  'https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/278867049_142817548262554_3752571792204667428_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=Yhmx5Xb6E8UAX_O2m3I&_nc_ht=scontent-qro1-1.xx&oh=00_AT-bXfb13aFhNMnql_3CJVvWBkpDYysDTs4rZfn70TYWNg&oe=6332EA0C';

export const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Nuevo cliente',
    message: '5 clientes nuevos en la última hora',
    date: subDays(new Date(), 3),
    type: 'NEW_CLIENT', //  NEW_CLIENT, NEW_ORDER, EMPTY_STOCK, NEW_SCHEDULE, ORDER_CANCELLED, SCHEDULE_CANCELLED
  },
  {
    id: '2',
    title: 'Nuevo pedido',
    message: '5 clientes nuevos en la última hora',
    date: subHours(new Date(), 1),
    type: 'NEW_ORDER', //  NEW_CLIENT, NEW_ORDER, EMPTY_STOCK, NEW_SCHEDULE, ORDER_CANCELLED, SCHEDULE_CANCELLED
  },
  {
    id: '3',
    title: 'Stock vácio',
    message: '5 clientes nuevos en la última hora',
    date: subMinutes(new Date(), 3),
    type: 'EMPTY_STOCK', //  NEW_CLIENT, NEW_ORDER, EMPTY_STOCK, NEW_SCHEDULE, ORDER_CANCELLED, SCHEDULE_CANCELLED
  },
];

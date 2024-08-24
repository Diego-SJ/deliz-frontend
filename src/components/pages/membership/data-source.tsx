import {
  BadgeDollarSign,
  ChartSpline,
  Check,
  Minus,
  MonitorCog,
  PiggyBank,
  ShoppingBasket,
  ShoppingCart,
  UserRoundCog,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const TABLE_HEADER = [
  {
    id: uuidv4(),
  },
  {
    id: uuidv4(),
    title: 'Básico',
    code: 'basic',
    price: {
      monthly: 149,
      annual: 119,
    },
  },
  {
    id: uuidv4(),
    title: 'Esencial',
    code: 'essential',
    price: {
      monthly: 299,
      annual: 239,
    },
  },
  {
    id: uuidv4(),
    title: 'Avanzado',
    code: 'advanced',
    price: {
      monthly: 499,
      annual: 399,
    },
  },
  {
    id: uuidv4(),
    title: 'Premium',
    code: 'premium',
    price: {
      monthly: 699,
      annual: 559,
    },
  },
];

const CheckIcon = () => (
  <span className="bg-primary rounded-full w-4 h-4 flex justify-center items-center">
    <Check className="text-white w-3 h-3" strokeWidth={3.5} />
  </span>
);

const NoneIcon = () => (
  <span className="bg-gray-200 rounded-full w-4 h-4 flex justify-center items-center">
    <Minus className="text-gray-600 w-3 h-3" strokeWidth={3.5} />
  </span>
);

export const TABLE_BODY = [
  // General
  {
    rowType: 'header',
    id: uuidv4(),
    cols: [
      { icon: MonitorCog, title: 'General' },
      { icon: null, title: '' },
      { icon: null, title: '' },
      { icon: null, title: '' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Usuarios' },
      { title: '1 usuario' },
      { title: '2 usuarios' },
      { title: '3 usuarios por sucursal' },
      { title: 'Usuarios ilimitados' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Sucursales' },
      { title: '1 sucursal' },
      { title: '1 sucursal' },
      {
        title: '2 sucursales',
        tooltip: 'Tendrás 2 sucursales incluidas. Agrega nuevas sucursales por $100 MXN al mes por cada una.',
      },
      {
        title: '3 sucursales',
        tooltip: 'Tendrás 3 sucursales incluidas. Agrega nuevas sucursales por $100 MXN al mes por cada una.',
      },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Productos' },
      { title: '100 productos', tooltip: 'Podrás registrar hasta 200 productos en tu catálogo.' },
      { title: 'Productos ilimitados' },
      { title: 'Productos ilimitados' },
      { title: 'Productos ilimitados' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Ventas' },
      { title: 'Ventas ilimitadas' },
      { title: 'Ventas ilimitadas' },
      { title: 'Ventas ilimitadas' },
      { title: 'Ventas ilimitadas' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Cajas registradoras' },
      { title: '1' },
      { title: '1' },
      { title: '2 por sucursal' },
      { title: 'Ilimitadas' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Chat IA' },
      { title: <NoneIcon /> },
      { title: <NoneIcon /> },
      { title: '1000 tokens al mes' },
      { title: 'Tokens ilimitados' },
    ],
  },
  // Products
  {
    rowType: 'header',
    id: uuidv4(),
    cols: [
      { icon: ShoppingBasket, title: 'Productos' },
      { icon: null, title: '' },
      { icon: null, title: '' },
      { icon: null, title: '' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Gestión de inventario' },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Tamaños y unidades' },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Escaneo de código de barras' },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Agregar foto a productos' },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  // Sales
  {
    rowType: 'header',
    id: uuidv4(),
    cols: [
      { icon: BadgeDollarSign, title: 'Ventas' },
      { icon: null, title: '' },
      { icon: null, title: '' },
      { icon: null, title: '' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Punto de venta' },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Aplicar descuentos' },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Administra clientes' },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Agregar cargo por envio' },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      {
        title: 'Precios personalizados',
        tooltip:
          'Establece un precio personalizado para tu producto al momento de realizar una venta, sin depender de los precios predefinidos.',
      },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Editar venta', tooltip: 'Agrega, edita o elimina productos de una venta completada.' },
      { title: <NoneIcon /> },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Imprimir ticket de compra' },
      { title: <NoneIcon /> },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  // Online Store
  {
    rowType: 'header',
    id: uuidv4(),
    cols: [
      { icon: ShoppingCart, title: 'Catálogo en linea' },
      { icon: null, title: '' },
      { icon: null, title: '' },
      { icon: null, title: '' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Catálogo en linea', tooltip: 'Comparte con tus clientes tu catálogo de productos a través de un enlace.' },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Recibe pedidos por WhatsApp' },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Landing page', tooltip: 'Comparte con tus clientes una pagina con la información de tu negocio.' },
      { title: <NoneIcon /> },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  // Expenses
  {
    rowType: 'header',
    id: uuidv4(),
    cols: [
      { icon: PiggyBank, title: 'Cajas y gastos' },
      { icon: null, title: '' },
      { icon: null, title: '' },
      { icon: null, title: '' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Cortes de caja' },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Gestión de gastos' },
      { title: <NoneIcon /> },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  // Reports
  {
    rowType: 'header',
    id: uuidv4(),
    cols: [
      { icon: ChartSpline, title: 'Reportes' },
      { icon: null, title: '' },
      { icon: null, title: '' },
      { icon: null, title: '' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Reportes de ventas' },
      { title: <NoneIcon /> },
      { title: 'Semanal' },
      { title: 'Completo' },
      { title: 'Completo' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Reporte de productos' },
      { title: <NoneIcon /> },
      { title: 'Semanal' },
      { title: 'Completo' },
      { title: 'Completo' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Reporte de clientes' },
      { title: <NoneIcon /> },
      { title: 'Semanal' },
      { title: 'Completo' },
      { title: 'Completo' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Reportes avanzados', tooltip: 'Reportes  de utilidades, ventas por producto, ventas por cliente, etc.' },
      { title: <NoneIcon /> },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  // Users and permissions
  {
    rowType: 'header',
    id: uuidv4(),
    cols: [
      { icon: UserRoundCog, title: 'Usuarios y permisos' },
      { icon: null, title: '' },
      { icon: null, title: '' },
      { icon: null, title: '' },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Permisos básicos' },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
  {
    rowType: 'body',
    id: uuidv4(),
    cols: [
      { title: 'Permisos avanzados' },
      { title: <NoneIcon /> },
      { title: <NoneIcon /> },
      { title: <CheckIcon /> },
      { title: <CheckIcon /> },
    ],
  },
];

import { COLORS } from './colors';

export const CATEGORIES = [
  {
    id: 1,
    name: 'Paleta de agua',
    public: true,
    gradient: {
      radial: COLORS.blue.light,
    },
  },
  {
    id: 2,
    name: 'Paleta de crema',
    public: true,
    gradient: {
      radial: COLORS.pink.light,
    },
  },
  {
    id: 3,
    name: 'Cubierta de chocolate',
    public: true,
    gradient: {
      radial: COLORS.lime.light,
    },
  },
  {
    id: 4,
    name: 'Helado',
    public: true,
    gradient: {
      radial: COLORS.navy.light,
    },
  },
  {
    id: 5,
    name: 'Nieve',
    public: true,
    gradient: {
      radial: COLORS.red.light,
    },
  },
  {
    id: 6,
    name: 'Sandwich',
    public: true,
    gradient: {
      radial: COLORS.gold.light,
    },
  },
  {
    id: 7,
    name: 'Bolis',
    public: true,
    gradient: {
      radial: COLORS.purple.light,
    },
  },
  {
    id: 8,
    name: 'Materia prima',
    public: false,
    gradient: {
      radial: COLORS.blue.light,
    },
  },
  {
    id: 9,
    name: 'Paleta mini agua',
    gradient: {
      radial: COLORS.yellow.light,
    },
  },
  {
    id: 10,
    name: 'Paleta mini crema',
    gradient: {
      radial: COLORS.violet.light,
    },
  },
  {
    id: 11,
    name: 'Pastes',
    gradient: {
      radial: COLORS.orange.light,
    },
  },
];

export const EXPENSE_CATEGORIES = [
  {
    value: 1,
    label: 'Alquiler/Renta',
    description: 'Gastos relacionados con el alquiler de espacios comerciales o residenciales.',
  },
  { value: 2, label: 'Servicios Públicos', description: 'Luz, agua, gas, teléfono, internet, etc.' },
  { value: 3, label: 'Salarios', description: 'Pagos a empleados o colaboradores.' },
  { value: 4, label: 'Materia Prima', description: 'Gastos en insumos o materiales necesarios para la producción.' },
  {
    value: 5,
    label: 'Mantenimiento y Reparaciones',
    description: 'Costos de reparación y mantenimiento de equipos o instalaciones.',
  },
  {
    value: 6,
    label: 'Marketing y Publicidad',
    description: 'Inversiones en campañas publicitarias, promociones o marketing digital.',
  },
  {
    value: 7,
    label: 'Impuestos y Tarifas',
    description: 'Pagos al gobierno, como impuestos sobre ingresos, licencias y permisos.',
  },
  {
    value: 8,
    label: 'Transporte y Envíos',
    description: 'Gastos relacionados con la logística, el transporte de mercancías o viajes de negocios.',
  },
  { value: 9, label: 'Seguros', description: 'Pólizas de seguro, como seguros de salud, de vehículos o de locales.' },
  {
    value: 10,
    label: 'Gastos Administrativos',
    description: 'Artículos de oficina, software, y otros recursos necesarios para el funcionamiento diario.',
  },
  {
    value: 11,
    label: 'Capacitación y Desarrollo',
    description: 'Cursos, talleres o entrenamientos para empleados, clave para mejorar habilidades.',
  },
  {
    value: 12,
    label: 'Equipamiento y Tecnología',
    description: 'Inversión en maquinaria, equipos tecnológicos o herramientas especializadas necesarias para la operación.',
  },
  {
    value: 13,
    label: 'Gastos Financieros',
    description: 'Incluyen intereses de préstamos, comisiones bancarias, y otros costos relacionados con financiamiento.',
  },
  {
    value: 14,
    label: 'Viáticos',
    description: 'Viajes de negocio, incluyendo alojamiento, alimentación, transporte, entre otros.',
  },
  // {
  //   value: 15,
  //   label: 'Publicidad en redes sociales y Google Ads',
  //   description: 'Costos de anuncios en plataformas digitales para atraer nuevos clientes.',
  // },
  // {
  //   value: 16,
  //   label: 'Investigación y Desarrollo (I+D)',
  //   description: 'Inversión en la creación de nuevos productos o en mejorar los existentes, vital para la innovación.',
  // },
  // {
  //   value: 17,
  //   label: 'Beneficios y Prestaciones',
  //   description: 'Gastos relacionados con prestaciones adicionales para empleados, como seguro médico, bonos o aguinaldos.',
  // },
  // {
  //   value: 18,
  //   label: 'Licencias y Suscripciones',
  //   description: 'Pago de software, aplicaciones, plataformas en línea o membresías necesarias para el negocio.',
  // },
  // {
  //   value: 19,
  //   label: 'Seguridad',
  //   description: 'Inversión en la protección del negocio, como sistemas de vigilancia o seguros de responsabilidad civil.',
  // },
  // {
  //   value: 20,
  //   label: 'Devoluciones y Garantías',
  //   description:
  //     'Costos asociados con devoluciones de productos o el cumplimiento de garantías, que pueden impactar los márgenes.',
  // },
];

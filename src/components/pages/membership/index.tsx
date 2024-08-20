import PriceCard from './card';
import { useState } from 'react';

const PRICES = [
  {
    title: 'Plan Básico',
    price: {
      monthly: 149,
      annualy: 119,
    },
    items: [
      { label: '1 usuario', tooltip: null },
      { label: '1 sucursal', tooltip: null },
      { label: '200 productos', tooltip: 'Podrás registrar hasta 200 productos en tu catálogo' },
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
    title: 'Plan Esencial',
    price: {
      monthly: 299,
      annualy: 239,
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
    title: 'Plan Avanzado',
    price: {
      monthly: 499,
      annualy: 399,
    },
    isPopular: true,
    items: [
      { label: '3 usuarios por sucursal', tooltip: null },
      {
        label: '+2 sucursales',
        tooltip: 'Tendrás 2 sucursales incluidas. Agrega nuevas sucursales por $100 MXN al mes por cada una.',
      },
      { label: 'Productos ilimitados', tooltip: null },
      { label: 'Ventas ilimitadas', tooltip: null },
    ],
    subTitle: 'Incluye Plan Esencial, Más',
    planItems: [
      { label: 'Permisos personalizados', tooltip: null },
      { label: 'Landing page', tooltip: null },
      { label: 'Reportes', tooltip: null },
      { label: 'Soporte prioritario', tooltip: null },
    ],
    buttonText: 'Elegir plan',
  },
  {
    title: 'Plan Pro',
    price: {
      monthly: 699,
      annualy: 559,
    },
    items: [
      { label: 'Usuarios ilimitados', tooltip: null },
      {
        label: '+3 sucursales',
        tooltip: 'Tendrás 3 sucursales incluidas. Agrega nuevas sucursales por $100 MXN al mes por cada una.',
      },
      { label: 'Productos ilimitados', tooltip: null },
      { label: 'Ventas ilimitadas', tooltip: null },
    ],
    subTitle: 'Incluye Plan Avanzado, Más',
    planItems: [
      { label: 'Soporte personalizado', tooltip: null },
      { label: 'Reportes avanzados', tooltip: null },
      { label: 'Pago a proveedores', tooltip: null },
      { label: 'Chat IA', tooltip: null },
    ],
    buttonText: 'Elegir plan',
  },
];

const MembershipPage = () => {
  const [period, setPeriod] = useState<'monthly' | 'annualy'>('monthly');

  return (
    <div className="p-5 pt-5 md:pt-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-10 flex-col sm:flex-row gap-4 sm:gap-0">
          <div className="flex flex-col text-center sm:text-start">
            <h5 className="text-3xl font-semibold mb-2 md:mb-0">Conoce Nuestros Planes</h5>
            <p className="text-base text-gray-400 font-light">30 días de prueba gratis. Sin contrato ni plazos forsozos.</p>
          </div>

          <div className="flex gap-2">
            <button
              className={`h-8 px-4 py-1 rounded-lg border ${
                period === 'monthly'
                  ? 'text-white bg-primary border-primary hover:bg-primary/80'
                  : 'text-primary bg-white border-white hover:border-primary'
              }`}
              onClick={() => setPeriod('monthly')}
            >
              Mensual
            </button>
            <button
              className={`h-8 px-4 py-1 rounded-lg border ${
                period === 'annualy'
                  ? 'text-white bg-primary border-primary hover:bg-primary/80'
                  : 'text-primary bg-white border-white hover:border-primary'
              }`}
              onClick={() => setPeriod('annualy')}
            >
              Anual (-20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-3 mb-5">
          {PRICES.map((price, index) => (
            <PriceCard
              key={index}
              title={price.title}
              price={period === 'monthly' ? price.price.monthly : price.price.annualy}
              isPopular={price.isPopular}
              planItems={price.planItems}
              buttonText={price.buttonText}
              items={price.items}
              subTitle={price.subTitle}
            />
          ))}
        </div>

        <div className="w-full flex justify-center">
          <button className="w-40 bg-primary text-white h-10 my-5 rounded-lg hover:bg-primary/80">Comparar Planes</button>
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-gray-400 font-light">* Precios en pesos mexicanos. Todos los precios incluyen IVA.</p>
          <p className="text-sm text-gray-400 font-light">
            Para más información sobre los planes, contactate vía WhasApp al{' '}
            <a
              href="https://api.whatsapp.com/send?phone=7714152997"
              className="text-primary hover:underline cursor-pointer"
              target="_blank"
            >
              771 415 2997
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;

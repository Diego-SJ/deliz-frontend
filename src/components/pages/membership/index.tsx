import { Button } from 'antd';
import PriceCard from './card';
import { useState } from 'react';
import PricingTableMobile from './pricing-table-mobile';
import PricingTable from './pricing-table';
import { CloseOutlined } from '@ant-design/icons';
import { PLANS_PRICES } from '@/constants/membership-plans';
import CurrentCompanyPlan from './current-company-plan';
import { useAppSelector } from '@/hooks/useStore';

const MembershipPage = () => {
  const [period, setPeriod] = useState<'monthly' | 'annualy'>('monthly');
  const [openDrawer, setOpenDrawer] = useState(false);
  const { company } = useAppSelector(({ app }) => app);
  const { user_auth } = useAppSelector(({ users }) => users);

  const handleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <div className="p-5 pt-5">
      <CurrentCompanyPlan />
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
                  : 'bg-white border hover:border-primary'
              }`}
              onClick={() => setPeriod('monthly')}
            >
              Mensual
            </button>
            <button
              className={`h-8 px-4 py-1 rounded-lg border ${
                period === 'annualy'
                  ? 'text-white bg-primary border-primary hover:bg-primary/80'
                  : 'bg-white border hover:border-primary'
              }`}
              onClick={() => setPeriod('annualy')}
            >
              Anual (-20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-3 mb-5">
          {PLANS_PRICES.map(price => (
            <PriceCard
              key={price.id}
              title={price.title}
              price={period === 'monthly' ? price.price.monthly : price.price.annualy}
              isPopular={price.isPopular}
              planItems={price.planItems}
              buttonText={user_auth?.authenticated && company?.membership_id === price.id ? 'Plan actual' : 'Elegir plan'}
              items={price.items}
              subTitle={price.subTitle}
            />
          ))}
        </div>

        <div className="w-full flex justify-center">
          <button className="w-40 bg-primary text-white h-10 my-5 rounded-lg hover:bg-primary/80" onClick={handleDrawer}>
            Comparar Planes
          </button>
        </div>

        {openDrawer && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleDrawer}></div>
            <div className="fixed w-[95dvw] h-[95dvh] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 bg-white rounded-xl border shadow-sm overflow-scroll">
              <div className="px-5 h-[60px] border-b w-full flex justify-between sticky top-0 items-center bg-white">
                <h5 className="text-xl font-semibold">Comparar Planes</h5>
                <Button onClick={handleDrawer} icon={<CloseOutlined />} />
              </div>
              <PricingTable />
              <PricingTableMobile />
            </div>
          </>
        )}

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

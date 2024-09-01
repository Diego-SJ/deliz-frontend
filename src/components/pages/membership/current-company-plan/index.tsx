import { PLANS_NAMES } from '@/constants/membership-plans';
import { useAppSelector } from '@/hooks/useStore';
import { Star } from 'lucide-react';

const CurrentCompanyPlan = () => {
  const { company } = useAppSelector(({ app }) => app);
  return (
    <div className="w-full rounded-xl bg-white p-5 flex-col shadow-sm border mb-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="bg-primary rounded-lg p-2 flex justify-center items-center w-10 h-10">
          <Star className="w-5 h-5 text-white" />
        </span>
        <h2 className="text-3xl font-bold">Plan {PLANS_NAMES[company.membership_id || 1]}</h2>
      </div>
      <p className="text-gray-400">
        Tu membresía actual es el plan {PLANS_NAMES[company.membership_id || 1]}, si deseas cambiar de plan puedes hacerlo desde
        aquí.
      </p>
    </div>
  );
};

export default CurrentCompanyPlan;

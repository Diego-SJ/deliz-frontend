import { Tooltip } from 'antd';

const ItemList = ({ label = '', tooltip = '' }: { label: string; tooltip?: string | null }) => {
  return (
    <li className="w-full">
      <Tooltip title={tooltip}>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-primary/10 rounded-full grid place-content-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-check text-primary w-3 h-3"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className={`text-gray-400 ${!!tooltip ? 'underline decoration-dashed cursor-pointer' : ''}`}>{label}</span>
        </div>
      </Tooltip>
    </li>
  );
};

const PlanItemList = ({ label = '', tooltip = '' }: { label: string; tooltip?: string | null }) => {
  return (
    <li className="w-full">
      <Tooltip title={tooltip}>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-slate-600/5 rounded-full grid place-content-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-check text-slate-600 w-3 h-3"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {/* <Check className="text-primary w-3 h-3" strokeWidth={4} /> */}
          </span>
          <span className={`text-gray-400 ${!!tooltip ? 'underline decoration-dashed cursor-pointer' : ''}`}>{label}</span>
        </div>
      </Tooltip>
    </li>
  );
};

type Props = {
  title: string;
  price: number;
  items: { label: string; tooltip?: string | null }[];
  planItems?: { label: string; tooltip?: string | null }[];
  buttonText?: string;
  isPopular?: boolean;
  onClick?: () => void;
  periodicity?: 'monthly' | 'annual';
  subTitle?: string;
};

const PriceCard = ({
  title,
  price,
  items,
  isPopular,
  onClick,
  periodicity = 'monthly',
  planItems = [],
  buttonText,
  subTitle = '',
}: Props) => {
  return (
    <div className={`w-full relative rounded-xl px-5 py-5 bg-white shadow-md border ${!isPopular ? '' : 'border-primary'}`}>
      {isPopular && (
        <span className="absolute text-white h-5 bg-primary text-sm -top-2 left-1/2 -translate-x-1/2 px-2 rounded-full">
          Más popular
        </span>
      )}
      <span className="block  text-primary text-base font-semibold mb-7">{title || '- - -'}</span>
      <div className="flex items-center">
        <span className="text-4xl font-semibold">${price}</span>
        <span className="text-base ml-2 text-slate-400 font-light">MXN /{periodicity === 'monthly' ? 'mes' : 'año'}</span>
      </div>
      <button onClick={onClick} className="w-full bg-primary text-white h-10 my-5 rounded-lg hover:bg-primary/80">
        {buttonText || 'Comenzar'}
      </button>

      <ul className="list-none space-y-2 min-h-32 flex flex-col justify-start">
        {items.map((item, index) => (
          <ItemList key={index} label={item.label} tooltip={item.tooltip} />
        ))}
      </ul>

      <h5 className="text-sm font-medium mb-4">{subTitle || 'Incluye'}</h5>
      <ul className="list-none space-y-2">
        {planItems.map((item, index) => (
          <PlanItemList key={index} label={item.label} tooltip={item?.tooltip} />
        ))}
      </ul>
    </div>
  );
};

export default PriceCard;

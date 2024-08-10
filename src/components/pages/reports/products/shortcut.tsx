import { Avatar, Button, Typography } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { formattedDateRange } from '../utils';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';
import { FileImageOutlined } from '@ant-design/icons';
import functions from '@/utils/functions';

const TopProductsThumbnail = () => {
  const dispatch = useAppDispatch();
  const { loading, top_products } = useAppSelector(({ analytics }) => analytics?.products || {});

  return (
    <CardRoot
      loading={loading}
      title={<h5 className="!text-base m-0 font-medium">Productos más vendidos</h5>}
      extra={
        <Button type="text" className="!text-primary underline" onClick={() => dispatch(analyticsActions.getTopProducts())}>
          Actualizar
        </Button>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div className="flex justify-between items-center mb-2 pl-1 pr-2">
        <Typography.Title level={2} className="!text-3xl !m-0">
          {top_products?.length || 0}
        </Typography.Title>

        <Typography.Text className="!text-sm mt-2">{formattedDateRange}</Typography.Text>
      </div>
      <div className="flex flex-col max-h-[20rem] overflow-y-auto over">
        {top_products?.map((product, index) => {
          return (
            <div
              key={index}
              className={`flex justify-between items-center py-2 pl-1 pr-2 gap-4 border-t ${
                index !== 0 ? 'border-slate-100' : 'border-transparent'
              }`}
            >
              <Avatar
                src={product?.image_url}
                icon={<FileImageOutlined className="text-slate-400" />}
                className="!w-10 !min-w-10 !h-10 p-1 rounded-xl bg-slate-600/10"
              />
              <Typography.Text className="!text-sm !m-0 text-start w-full">{product.name}</Typography.Text>
              <Typography.Text className="!text-sm !m-0 !w-fit min-w-40 text-end">
                {functions.number(product.total_quantity)} <span className="text-neutral-400 text-xs">(unidades)</span>
              </Typography.Text>
            </div>
          );
        })}
      </div>
    </CardRoot>
  );
};

export default TopProductsThumbnail;

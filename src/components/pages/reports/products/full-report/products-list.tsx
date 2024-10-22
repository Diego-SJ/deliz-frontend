import CardRoot from '@/components/atoms/Card';
import ReportEmpty from '@/components/atoms/report-empty';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { FileImageOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Typography } from 'antd';
import { Reports } from '../../types';
import { analyticsActions } from '@/redux/reducers/analytics';
import functions from '@/utils/functions';
import { ProductAnalytics } from '@/redux/reducers/analytics/types';

const ProductsList = ({ hideData = false }: Reports) => {
  const dispatch = useAppDispatch();
  const { loading, top_products, filters } = useAppSelector(({ analytics }) => analytics?.products || {});

  const refetchData = () => {
    dispatch(analyticsActions.products.getTopProducts());
  };

  const changeLimit = async (limit: number) => {
    dispatch(analyticsActions.setProductsFilters({ limit }));
    await functions.sleep(100);
    refetchData();
  };

  const changeOrder = async (order: 'asc' | 'desc') => {
    dispatch(analyticsActions.setProductsFilters({ order }));
    await functions.sleep(100);
    refetchData();
  };

  return (
    <>
      <div className="flex mb-4 justify-end gap-3">
        <Dropdown
          menu={{
            selectedKeys: [filters?.order || 'desc'],
            items: [
              { key: 'desc', label: 'Más vendidos' },
              { key: 'asc', label: 'Menos vendidos' },
            ],
            selectable: true,
            onClick: async ({ key }) => changeOrder(key as ProductAnalytics['filters']['order']),
          }}
        >
          <Button>{filters?.order === 'desc' ? 'más vendidos' : 'menos vendidos'}</Button>
        </Dropdown>
        <Dropdown
          menu={{
            items: [
              { key: 3, label: 'Mostrar 3 elementos' },
              { key: 10, label: 'Mostrar 10 elementos' },
              { key: 20, label: 'Mostrar 20 elementos' },
              { key: 50, label: 'Mostrar 50 elementos' },
            ],
            selectable: true,
            onClick: async ({ key }) => changeLimit(+key),
          }}
        >
          <Button>{filters?.limit} elementos</Button>
        </Dropdown>
      </div>
      <CardRoot loading={loading} title="Productos" classNames={{ body: '!px-4 !pt-2' }}>
        {top_products?.length ? (
          <div>
            <div className="flex flex-col h-[80dvh] sm:h-96 print:!h-auto overflow-y-scroll">
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
                      className="!w-10 !min-w-10 !h-10 p-1 rounded-xl bg-slate-400/10"
                    />
                    <Typography.Text className="!text-sm !m-0 text-start w-full">{product.name}</Typography.Text>
                    <Typography.Text className="!text-sm !m-0 !w-fit min-w-40 text-end">
                      {functions.number(product.total_quantity, {
                        hidden: hideData,
                      })}{' '}
                      <span className="text-neutral-400 text-xs">(unidades)</span>
                    </Typography.Text>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <ReportEmpty />
        )}
      </CardRoot>
    </>
  );
};

export default ProductsList;

import PaginatedList from '@/components/organisms/PaginatedList';
import TableEmpty from '@/components/atoms/table-empty';
import { Avatar, Typography } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { Reports } from '../../types';
import functions from '@/utils/functions';
import { ProductToReplenish } from '@/redux/reducers/analytics/types';

type Props = {
  data?: ProductToReplenish[];
} & Reports;

const ProductsList = ({ data, hideData }: Props) => {
  return (
    <PaginatedList
      dataSource={data}
      className="!border-none"
      pagination={
        (data?.length || 0) > 5
          ? {
              pageSize: 5,
            }
          : false
      }
      locale={{
        emptyText: <TableEmpty margin="small" />,
      }}
      renderItem={(item) => {
        return (
          <div
            key={item.product_id}
            className="grid grid-cols-[3fr_1fr_1fr] gap-2 py-2 pl-0 pr-4 border-b border-gray-100 items-center"
          >
            <div className="flex items-center gap-2">
              <Avatar
                src={item.image_url}
                icon={<FileImageOutlined className="text-slate-400 text-xl" />}
                className={`bg-slate-400/10 p-1 w-10 min-w-10 h-10 min-h-10 !rounded-xl`}
                size="large"
                shape="square"
              />
              <Typography.Paragraph className="!mb-0">{item.name}</Typography.Paragraph>
            </div>
            <div className="flex flex-col text-center">
              <span className="font-medium">{functions.number(item?.min_stock || 0, { hidden: hideData })}</span>
              <span className="font-light text-xs text-gray-400">stock min.</span>
            </div>
            <div className="flex flex-col justify-center text-center">
              <span className={`font-medium`}>{functions.number(item?.total_stock, { hidden: hideData })}</span>
              <span className={`font-light text-xs ${item?.total_stock > 0 ? 'text-amber-600' : 'text-red-400'}`}>
                {item?.total_stock > 0 ? 'stock actual' : 'sin stock'}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
};

export default ProductsList;

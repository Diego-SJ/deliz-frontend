import { Avatar, Tag, Typography } from 'antd';
import { FileImageOutlined, StarFilled, StarOutlined } from '@ant-design/icons';

type ItemProductMobileProps = {
  title?: string;
  imageSrc?: string | null;
  category?: string;
  size?: string;
  price?: any;
  onClick?: () => void;
  focuseable?: boolean;
  isFavorite?: boolean;
  onFavorite?: () => void;
};

export const ItemProductMobile = (props: ItemProductMobileProps) => {
  let category = props?.category || 'Sin categoría';

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };
  return (
    <>
      <div className="box-border flex py-3 justify-between border-b border-slate-100 items-center cursor-pointer hover:bg-slate-50/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 cursor-pointer group" onClick={props.onFavorite}>
          {props.isFavorite ? (
            <StarFilled className="text-primary text-2xl hover:text-primary/40" />
          ) : (
            <StarOutlined className="text-slate-300 text-2xl group-hover:text-slate-400" />
          )}
        </div>
        <div className="flex gap-4 pr-14 w-[88%]" onClick={handleClick}>
          <Avatar
            className="w-16 h-16 min-w-16 aspect-square bg-slate-100 p-1 my-auto select-none"
            src={props?.imageSrc}
            shape="square"
            icon={<FileImageOutlined className="text-2xl text-slate-400" />}
          />
          <div className="flex flex-col text-center items-start justify-center gap-1">
            <Typography.Paragraph
              ellipsis={{ rows: 2, tooltip: props.title }}
              className="text-start font-medium !m-0 w-full leading-5 !mb-2 select-none"
            >
              {props?.title ?? 'Producto sin nombre'}
            </Typography.Paragraph>
            <Tag className="select-none border !border-gray-300 !bg-transparent text-gray-400">{category}</Tag>
          </div>
        </div>
      </div>
    </>
  );
};

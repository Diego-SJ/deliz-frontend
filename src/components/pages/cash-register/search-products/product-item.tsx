import { Avatar, Tag, Typography } from 'antd';
import { FileImageOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { useState } from 'react';

type ItemProductsProps = {
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

export const ItemProduct = (props: ItemProductsProps) => {
  const [hoveredButton, setHoveredButton] = useState(false);
  let category = props?.category || 'Sin categoría';

  const handleClick = () => {
    if (props.onClick && !hoveredButton) {
      props.onClick();
    }
  };
  return (
    <>
      <div
        onClick={handleClick}
        className="bg-white !min-h-[6.2rem] rounded-lg box-border flex p-3 justify-between border border-gray-300 items-center cursor-pointer hover:border-gray-400 relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 p-3 cursor-pointer group"
          onClick={props.onFavorite}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
        >
          {props.isFavorite ? (
            <StarFilled className="text-amber-200 text-xl hover:text-amber-200/40" />
          ) : (
            <StarOutlined className="text-slate-300 text-xl group-hover:text-slate-400" />
          )}
        </div>
        <div className="flex gap-4 pr-14">
          <Avatar
            className="w-16 h-16 min-w-16 aspect-square bg-slate-400/10 p-1 my-auto select-none"
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

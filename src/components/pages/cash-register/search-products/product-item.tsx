import { Avatar, Button, Tag, Typography } from 'antd';
import { FileImageOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import functions from '@/utils/functions';
import { useIntersectionObserver } from '@uidotdev/usehooks';

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

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  const handleClick = () => {
    if (props.onClick && !hoveredButton) {
      props.onClick();
    }
  };
  return (
    <>
      <div
        ref={ref}
        onClick={handleClick}
        className="bg-white !min-h-[6.2rem] rounded-lg box-border flex p-3 justify-between border border-gray-300 items-center cursor-pointer hover:border-gray-400 relative overflow-hidden active:bg-primary/10 transition-all duration-300"
      >
        {entry?.isIntersecting && (
          <>
            <div className="flex items-center gap-4 w-full">
              <Avatar
                className="w-16 h-16 min-h-16 min-w-16 aspect-square bg-slate-400/10 p-1 select-none"
                src={props?.imageSrc}
                shape="square"
                icon={<FileImageOutlined className="text-2xl text-slate-400" />}
              />
              <div className="flex flex-col text-center items-start justify-center gap-1">
                <Typography.Paragraph
                  ellipsis={{ rows: 2, tooltip: props.title }}
                  className="text-start font-medium !m-0 w-full leading-5 !mb-2 select-none"
                >
                  {props?.title || 'Producto sin nombre'}
                </Typography.Paragraph>
                <div className="flex gap-2 w-full items-center flex-wrap">
                  <Tag className="select-none border !border-gray-300 !bg-transparent text-gray-400 max-h-fit">
                    {category}
                  </Tag>
                  <Typography.Text className="text-gray-400 font-light min-w-fit !m-0 !text-sm max-h-fit select-none">
                    {functions.money(props.price)}
                  </Typography.Text>
                </div>
              </div>
            </div>
            <div className="w-auto ml-2">
              <Button
                onClick={props.onFavorite}
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
                icon={
                  props?.isFavorite ? (
                    <StarFilled className="text-primary text-2xl hover:text-primary/40" />
                  ) : (
                    <StarOutlined />
                  )
                }
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

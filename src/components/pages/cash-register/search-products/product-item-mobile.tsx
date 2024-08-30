import { Avatar, Button, Tag, Typography } from 'antd';
import { CalculatorOutlined, FileImageOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import functions from '@/utils/functions';
import { useIntersectionObserver } from '@uidotdev/usehooks';

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
  onCalculatorClick?: () => void;
};

export const ItemProductMobile = (props: ItemProductMobileProps) => {
  let category = props?.category || 'Sin categoría';

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <>
      <div
        ref={ref}
        className="box-border min-h-[89px] max-h-[89px] flex justify-between border-b border-slate-100 items-center  hover:bg-slate-50/10 relative overflow-hidden"
      >
        {entry?.isIntersecting && (
          <>
            <div className="flex gap-4 py-3 w-full cursor-pointer" onClick={handleClick}>
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
                <div className="flex gap-4 items-center">
                  <Typography.Text className="text-gray-400 font-light !m-0 !text-sm">
                    {functions.money(props?.price)}
                  </Typography.Text>
                  <Tag className="select-none border !border-gray-300 !bg-transparent text-gray-400">{category}</Tag>
                </div>
              </div>
            </div>
            <div className="w-auto flex gap-4 ml-2">
              <Button onClick={props.onCalculatorClick} size="large" icon={<CalculatorOutlined />} />
              <Button
                onClick={props.onFavorite}
                size="large"
                icon={
                  props?.isFavorite ? <StarFilled className="text-primary text-2xl hover:text-primary/40" /> : <StarOutlined />
                }
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

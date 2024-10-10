import { Card, CardProps } from 'antd';

const CardRoot = (props: CardProps) => {
  return (
    <Card
      {...props}
      className={` ${props.className || ''} !border border-gray-200 shadow-sm`}
    />
  );
};

export default CardRoot;

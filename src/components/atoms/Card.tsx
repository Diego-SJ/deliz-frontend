import { Card, CardProps } from 'antd';

const CardRoot = (props: CardProps) => {
  return <Card {...props} className={`shadow-md rounded-xl ${props.className || ''}`} />;
};

export default CardRoot;

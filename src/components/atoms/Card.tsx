import { Card, CardProps } from 'antd';

const CardRoot = (props: CardProps) => {
  return <Card {...props} className={`rounded-xl ${props.className || ''} !border border-slate-200`} />;
};

export default CardRoot;

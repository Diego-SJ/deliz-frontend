import { usePageTitle } from '@/contexts/page-title-context';
import { Typography } from 'antd';

const HeaderTitlte = () => {
  const { title } = usePageTitle();
  return (
    <Typography.Title level={4} className="!ml-3">
      {title}
    </Typography.Title>
  );
};

export default HeaderTitlte;

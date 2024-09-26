import useMediaQuery from '@/hooks/useMediaQueries';
import { APP_ROUTES } from '@/routes/routes';
import { IdcardOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

type Props = {
  collapsed: boolean;
};

const MyMembershipCard = ({ collapsed }: Props) => {
  const navigate = useNavigate();

  const goToMembership = () => {
    navigate(APP_ROUTES.PRIVATE.MEMBERSHIP.path);
  };

  return (
    <Tooltip title={collapsed ? 'Mi membresía' : ''}>
      <Button className="w-full" onClick={goToMembership} icon={<IdcardOutlined />}>
        {collapsed ? '' : 'Mi membresía'}
      </Button>
    </Tooltip>
  );
};

export default MyMembershipCard;

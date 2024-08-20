import useMediaQuery from '@/hooks/useMediaQueries';
import { APP_ROUTES } from '@/routes/routes';
import { IdcardOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

const MyMembershipCard = () => {
  const navigate = useNavigate();
  const { isPhablet } = useMediaQuery();

  const goToMembership = () => {
    navigate(APP_ROUTES.PRIVATE.MEMBERSHIP.path);
  };

  return (
    <Tooltip title={isPhablet ? 'Mi membresía' : ''}>
      <Button className="w-full" onClick={goToMembership} icon={<IdcardOutlined />}>
        {isPhablet ? '' : 'Mi membresía'}
      </Button>
    </Tooltip>
  );
};

export default MyMembershipCard;

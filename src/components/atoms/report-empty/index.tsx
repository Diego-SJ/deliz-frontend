import { APP_ROUTES } from '@/routes/routes';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

type ReportEmptyProps = {
  title?: string;
  onAddNew?: () => void;
  hideButton?: boolean;
  // margin?: 'small' | 'medium' | 'large';
};

const ReportEmpty = ({ title, hideButton }: ReportEmptyProps) => {
  const navigate = useNavigate();

  const goToPOS = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path);
  };
  return (
    <div className="w-full h-full flex justify-center items-center pt-10 md:pt-12 pb-16">
      <Empty description={title || 'Empieza a registrar ventas para poder ver información'}>
        {!hideButton && (
          <Button onClick={goToPOS} icon={<PlusCircleOutlined />}>
            Regitrar ventas
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default ReportEmpty;

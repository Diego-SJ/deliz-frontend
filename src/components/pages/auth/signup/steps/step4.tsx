import { Avatar, Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

const StepFour = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(({ app }) => app);
  const { width, height } = useWindowSize();

  const handleOnFinish = async () => {
    await dispatch(appActions.finishOnboarding());
  };

  return (
    <>
      <Confetti width={width} height={height} gravity={0.2} numberOfPieces={100} />
      <div className="flex flex-col px-6 min-h-[calc(100dvh-148px)] max-h-[calc(100dvh-148px)] overflow-y-scroll py-8 justify-center items-center z-50">
        <Avatar
          icon={<CheckCircleOutlined className="text-green-600 text-3xl" />}
          shape="square"
          className="bg-green-600/10 !rounded-2xl min-h-14 w-14"
        />
        <Typography.Title level={3} className="!mb-1 !mt-2">
          ¡Todo listo!
        </Typography.Title>
        <Typography.Text type="secondary" className="mb-5 text-center">
          Ya puedes empezar a disfrutar de todas las funcionalidades de Posiffy
        </Typography.Text>
        <Button size="large" type="primary" onClick={handleOnFinish} loading={loading}>
          Ir al dashboard
        </Button>
      </div>
    </>
  );
};

export default StepFour;

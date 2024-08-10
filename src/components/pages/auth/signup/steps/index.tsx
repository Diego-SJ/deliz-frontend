import FallbackImage from '@/assets/logo-color.svg';
import { Progress } from 'antd';
import './styles.css';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';
import StepOne from './step1';
import StepTwo from './step2';
import StepThree from './step3';
import StepFour from './step4';
import { ONBOARDING_STEPS } from '@/constants/onboarding';

const SignUpSteps = () => {
  const dispatch = useAppDispatch();
  const { step = 1 } = useAppSelector(({ app }) => app.onboarding);

  const handlePreviousStep = () => {
    dispatch(appActions.setOnboarding({ step: step - 1 }));
  };

  return (
    <div className="bg-white min-h-[100dvh] max-h-[100dvh]">
      <header className="flex justify-between px-6 h-[56px] items-center">
        <div className="flex items-center">
          <img src={FallbackImage} alt="Logo" className="h-8 w-8 aspect-square mt-3" />
          <h3 className="font-black -ml-[0.2rem] text-2xl">
            <span className="text-primary">OS</span>IFFY
          </h3>
        </div>
      </header>

      {step !== 4 && (
        <div className="flex justify-center px-6 text-center self-center w-full min-w-[300px]" onClick={handlePreviousStep}>
          <Progress
            percent={(100 / 3) * step}
            className="w-full max-w-[400px] mx-auto after:!bg-primary inline-flex"
            showInfo={false}
          />
        </div>
      )}
      {step === ONBOARDING_STEPS.ONE && <StepOne />}
      {step === ONBOARDING_STEPS.TWO && <StepTwo />}
      {step === ONBOARDING_STEPS.THREE && <StepThree />}
      {step === ONBOARDING_STEPS.FOUR && <StepFour />}
    </div>
  );
};

export default SignUpSteps;

import { Button, ButtonProps } from 'antd';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type Props = {
  hideData: boolean;
  onChange: () => void;
  type?: ButtonProps['type'];
};

const EyeButton = ({ hideData, onChange, type = 'default' }: Props) => {
  return (
    <Button
      type={type}
      onClick={onChange}
      icon={hideData ? <Eye className="w-4 " /> : <EyeOff className="w-4 " />}
    />
  );
};

export const useHideData = () => {
  const [hideData, setHideData] = useState(false);

  const handleHideData = () => {
    setHideData((prev) => !prev);
  };

  return { hideData, handleHideData };
};

export default EyeButton;

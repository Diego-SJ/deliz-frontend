import { Button, ButtonProps, Row } from 'antd';
import { CardBtn } from './styles';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';

const buttonProps: ButtonProps = {
  type: 'text',
  size: 'large',
  block: true,
};

type NumberKeyboardProps = {
  onChange?: (value: number) => void;
  withDot?: boolean;
  value?: number;
};

const NumberKeyboard = ({ onChange, withDot = false, value = 0 }: NumberKeyboardProps) => {
  const [currentNumber, setCurrentNumber] = useState<string[]>([]);

  useEffect(() => {
    console.log(value);
    setCurrentNumber(`${value || 0}`.split(''));
  }, [value]);

  const handleChange = useCallback(
    (value: string[]) => {
      if (typeof onChange === 'function') {
        console.log(value, 'value');
        console.log('first', Number(value.join()?.replaceAll(',', '') || 0));
        onChange(Number(value.join()?.replaceAll(',', '') || 0));
      }
    },
    [onChange],
  );

  const onClick = (number: string) => {
    let currentArray = currentNumber;
    currentArray.push(number);
    setCurrentNumber(currentArray);
    handleChange(currentArray);
  };

  const onDelete = () => {
    let currentArray = currentNumber;
    currentArray.pop();
    setCurrentNumber(currentArray);
    handleChange(currentArray);
  };

  return (
    <Row>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('1')}>
          1
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('2')}>
          2
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('3')}>
          3
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('4')}>
          4
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('5')}>
          5
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('6')}>
          6
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('7')}>
          7
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('8')}>
          8
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('9')}>
          9
        </Button>
      </CardBtn>
      {withDot && (
        <CardBtn span={8}>
          <Button {...buttonProps} onClick={() => onClick('.')}>
            .
          </Button>
        </CardBtn>
      )}
      <CardBtn span={8} offset={withDot ? 0 : 8}>
        <Button {...buttonProps} onClick={() => onClick('0')}>
          0
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} block onClick={onDelete} className="expand" icon={<DoubleLeftOutlined rev={{}} />} />
      </CardBtn>
    </Row>
  );
};

export default NumberKeyboard;

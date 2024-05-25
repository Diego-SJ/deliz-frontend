import { Button, ButtonProps, Row } from 'antd';
import { CardBtn } from './styles';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';

const buttonProps: ButtonProps = {
  type: 'text',
  size: 'small',
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
    setCurrentNumber(`${value || 0}`.split(''));
  }, [value]);

  const handleChange = useCallback(
    (value: string[]) => {
      if (typeof onChange === 'function') {
        let _number = value.join()?.replaceAll(',', '');
        onChange(Number(_number));
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
    if (!currentArray.length) {
      currentArray = ['0'];
    }
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

      <CardBtn span={8} className={!withDot ? 'dot' : ''}>
        <Button {...buttonProps} onClick={() => onClick('.')} disabled={!withDot}>
          .
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={() => onClick('0')}>
          0
        </Button>
      </CardBtn>
      <CardBtn span={8}>
        <Button {...buttonProps} onClick={onDelete} icon={<DoubleLeftOutlined rev={{}} />} />
      </CardBtn>
    </Row>
  );
};

export default NumberKeyboard;

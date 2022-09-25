import { Popover } from 'antd';
import styled from 'styled-components';

export const PopoverAntd = styled(Popover)``;

export const PopoverBody = styled.div`
  position: relative;
  top: -12px;
  left: -16px;
  width: calc(100% + 32px);
  height: calc(100% + 24px);
  display: flex;
  flex-direction: column;
`;

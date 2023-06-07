import styled from 'styled-components';
import { SpaceProps } from './types';

export const SpaceRoot = styled.span<SpaceProps>`
  width: ${({ width = '100%' }) => width};
  margin: ${({ margin = '0' }) => margin};
  background-color: ${({ color = 'transparent' }) => color};
  height: ${({ height = '0' }) => height};
  min-height: ${({ height = '0' }) => height};
  max-height: ${({ height = '0' }) => height};
  display: inline-block;
`;

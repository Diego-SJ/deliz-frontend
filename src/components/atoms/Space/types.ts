import { StyleHTMLAttributes } from 'react';

export interface SpaceProps {
  height?: string | undefined;
  width?: string | undefined;
  margin?: string | undefined;
  sx?: StyleHTMLAttributes<HTMLSpanElement> | undefined;
  className?: string | undefined;
  color?: string;
}

import React from 'react';
import { SpaceRoot } from './styles';
import { SpaceProps } from './types';

const Space: React.FC<SpaceProps> = ({ ...props }) => {
  return <SpaceRoot {...props} className={`${props?.className ?? ''}`} style={props.sx ?? {}} />;
};

export default Space;

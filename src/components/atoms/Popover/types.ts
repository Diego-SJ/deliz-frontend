import { PopoverProps as PopoverPropsAntd } from 'antd';
import { RenderFunction } from 'antd/lib/_util/getRenderPropValue';
import React from 'react';

export type PopoverProps = {
  triggerComponent?: React.ReactNode;
  children?: React.ReactNode | RenderFunction;
  nopadding?: boolean;
} & PopoverPropsAntd;

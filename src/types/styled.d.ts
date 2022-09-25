import 'styled-components';
import { theme } from '@/styles/theme/config';

export type StyledComponentsType = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends StyledComponentsType {}
}

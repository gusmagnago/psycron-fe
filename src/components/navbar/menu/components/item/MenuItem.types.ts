import type { ReactElement } from 'react';

export interface IMenuItem {
  closeMenu?: () => void;
  icon: ReactElement;
  isFooterIcon?: boolean;
  isFullList?: boolean,
  name: string;
  onClick?: () => void,
  path: string;
}

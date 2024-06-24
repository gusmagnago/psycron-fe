import type { ReactElement } from 'react';

export interface IMenuItem {
  closeMenu?: () => void;
  icon: ReactElement;
  isFooterIcon?: boolean;
  name: string;
  path: string;
}

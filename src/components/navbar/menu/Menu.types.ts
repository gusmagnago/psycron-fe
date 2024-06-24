import type { IMenuItem } from './components/item/MenuItem.types';

export interface IMenuItems {
  closeMenu?: () => void,
  isFooterIcon?: boolean,
  items: IMenuItem[];
}

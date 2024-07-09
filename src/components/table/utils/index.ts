import { ITableCellProps } from '../components/table-cell/TableCell.types';

export const tableBones = (action?: boolean, index?: number, isSmall?: boolean) => {
  if (action) return 0.5;
  if (index === 0 && !isSmall) return 1.5;
  return 1;
};

export const filterItems = (
  items: ITableCellProps[],
  isTablet: boolean,
  isMobile: boolean,
  hideTablet: string[],
  hideMobile: string[]
): ITableCellProps[] => {
  const combinedHideMobile = [...hideTablet, ...hideMobile];
  return items.filter(
    (item) =>
      !(isTablet && hideTablet.includes(item.id)) &&
      !(isMobile && combinedHideMobile.includes(item.id))
  );
};

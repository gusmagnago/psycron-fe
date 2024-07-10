import type { ITableCellProps } from '../table-cell/TableCell.types';

export interface ITableHeadProps {
  headItems: ITableCellProps[];
	onSort?: (id: string) => void;
	onHover: (id: string | null) => void;
}

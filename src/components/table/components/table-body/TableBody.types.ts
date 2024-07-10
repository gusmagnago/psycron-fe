import type { ITableCellProps } from '../table-cell/TableCell.types';

export interface ITableBodyProps {
  bodyItems: ITableCellProps[][];
	hoveredColumn?: string | null
}

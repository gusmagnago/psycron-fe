import type { ITableBodyProps } from './components/table-body/TableBody.types';
import type { ITableHeadProps } from './components/table-head/TableHead.types';

export type ITableProps = {
  columnsToHideMobile: string[];
  columnsToHideTablet: string[];
} & ITableHeadProps &
  ITableBodyProps;

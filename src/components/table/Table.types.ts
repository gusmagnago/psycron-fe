import type { ITableBodyProps } from './components/table-body/TableBody.types';
import type { ITableHeadProps } from './components/table-head/TableHead.types';

export type ITableProps = {
  columnsToHideTablet: string[];
  columnsToHideMobile: string[];
} & ITableHeadProps &
  ITableBodyProps;

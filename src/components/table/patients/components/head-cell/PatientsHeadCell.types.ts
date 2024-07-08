import type { IPatientsTableData } from '../../PatientsTable.types';

export interface IHeadCell {
    icon: boolean;
    id: keyof IPatientsTableData;
    label: string;
    numeric: boolean;
}

export interface IPatientsHeadCellProps {
    items: readonly IHeadCell[];
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof IPatientsTableData,
    ) => void;
    order: Order;
    orderBy: string;
}

export type Order = 'asc' | 'desc';

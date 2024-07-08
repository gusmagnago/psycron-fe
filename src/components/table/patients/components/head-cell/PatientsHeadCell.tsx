import { Divider, TableHead, TableSortLabel } from '@mui/material';

import type { IPatientsTableData } from '../../PatientsTable.types';

import {
	CellContentWrapper,
	StyledTableCell,
	StyledTableHeadRow,
} from './PatientsHeadCell.styles';
import type {
	IHeadCell,
	IPatientsHeadCellProps,
} from './PatientsHeadCell.types';

export const PatientsHeadCell = ({
	items,
	onRequestSort,
	order,
	orderBy,
}: IPatientsHeadCellProps) => {
	const createSortHandler =
        (property: keyof IPatientsTableData) =>
        	(event: React.MouseEvent<unknown>) => {
        		onRequestSort(event, property);
        	};

	const align = (headCell: IHeadCell) => {
		const { icon, numeric } = headCell;
		if (icon) return 'center';
		if (numeric) return 'right';
		return 'left';
	};

	return (
		<TableHead>
			<StyledTableHeadRow>
				{items.map((headCell, index) => (
					<>
						<StyledTableCell
							key={headCell.id}
							align={align(headCell)}
							sortDirection={
								orderBy === headCell.id ? order : false
							}
						>
							<CellContentWrapper>
								<TableSortLabel
									active={orderBy === headCell.id}
									direction={
										orderBy === headCell.id ? order : 'asc'
									}
									onClick={createSortHandler(headCell.id)}
								>
									{headCell.label}
								</TableSortLabel>
								{index !== items.length - 1 ? (
									<Divider />
								) : null}
							</CellContentWrapper>
						</StyledTableCell>
					</>
				))}
			</StyledTableHeadRow>
		</TableHead>
	);
};

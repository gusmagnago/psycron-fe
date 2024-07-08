import { Box, Divider } from '@mui/material';

import { tableBones } from '../../utils';
import { TableCell } from '../table-cell/TableCell';
import type { ITableCellProps } from '../table-cell/TableCell.types';

import {
	TableBodyRow,
	TableBodyRowItem,
	TableBodyWrapper,
} from './TableBody.styles';

export interface ITableBodyProps {
    bodyItems: ITableCellProps[][];
}

export const TableBody = ({ bodyItems }: ITableBodyProps) => {
	return (
		<Box my={5}>
			{bodyItems.map((row, rowIndex) => (
				<TableBodyWrapper
					container
					columns={row.length}
					key={`table-row-${rowIndex}`}
				>
					{row.map(
						(
							{ icon, numeric, label, action, isPatients, id },
							index,
						) => (
							<TableBodyRowItem
								key={`table-cell-${rowIndex}-${index}`}
								item
								xs={tableBones(action, index)}
							>
								<TableBodyRow>
									<TableCell
										icon={icon}
										label={label}
										numeric={numeric}
										action={action}
										isPatients={isPatients}
										id={id}
									/>
									{index !== row.length - 1 ? (
										<Divider />
									) : null}
								</TableBodyRow>
							</TableBodyRowItem>
						),
					)}
				</TableBodyWrapper>
			))}
		</Box>
	);
};

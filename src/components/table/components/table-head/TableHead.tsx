import { Box } from '@mui/material';

import { tableBones } from '../../utils';
import { TableCell } from '../table-cell/TableCell';

import { StyledTableHeadGrid, TabledHeadRowItem } from './TableHead.styles';
import type { ITableHeadProps } from './TableHead.types';

export const TableHead = ({ headItems, onSort, onHover }: ITableHeadProps) => {
	return (
		<Box mb={5}>
			<StyledTableHeadGrid container columns={headItems.length}>
				{headItems.map(
					({ icon, numeric, label, action, isPatients, id }, index) => (
						<TabledHeadRowItem
							item
							key={`table-head-cell-${id}-pos-${index}`}
							xs={tableBones(action, index)}
							onClick={() => onSort?.(id)}
							onMouseEnter={() => onHover?.(id)}
							onMouseLeave={() => onHover?.(null)}
						>
							<TableCell
								icon={icon}
								label={label}
								numeric={numeric}
								action={action}
								isPatients={isPatients}
								id={id}
								isHead
							/>
						</TabledHeadRowItem>
					)
				)}
			</StyledTableHeadGrid>
		</Box>
	);
};

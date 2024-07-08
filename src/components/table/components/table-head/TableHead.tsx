import { Box, Grid } from '@mui/material';

import { tableBones } from '../../utils';
import { TableCell } from '../table-cell/TableCell';

import { TabledHeadRow } from './TableHead.styles';
import type { ITableHeadProps } from './TableHead.types';

export const TableHead = ({ headItems }: ITableHeadProps) => {
	return (
		<Box mb={5}>
			<Grid container columns={headItems.length}>
				{headItems.map(
					(
						{ icon, numeric, label, action, isPatients, id },
						index,
					) => (
						<TabledHeadRow
							item
							key={`table-head-cell-${id}-pos-${index}`}
							xs={tableBones(action, index)}
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
						</TabledHeadRow>
					),
				)}
			</Grid>
		</Box>
	);
};

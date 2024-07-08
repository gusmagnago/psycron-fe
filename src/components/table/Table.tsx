import { Box, Divider, Paper } from '@mui/material';

import type { ITableBodydProps } from './components/table-body/TableBody';
import { TableBody } from './components/table-body/TableBody';
import { TableHead } from './components/table-head/TableHead';
import type { ITableHeadProps } from './components/table-head/TableHead.types';

export interface ITableProps {}

export const Table = ({
	headItems,
	bodyItems,
}: ITableHeadProps & ITableBodydProps) => {
	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', p: '24px', borderRadius: '40px' }}>
				<TableHead headItems={headItems} />
				<Divider />
				<TableBody bodyItems={bodyItems} />
			</Paper>
		</Box>
	);
};

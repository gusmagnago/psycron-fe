import { useState } from 'react';
import { Box, Divider } from '@mui/material';

import { Pagination } from './components/pagination/Pagination';
import { TableBody } from './components/table-body/TableBody';
import { TableHead } from './components/table-head/TableHead';
import { StyledPaper } from './Table.styles';
import type { ITableProps } from './Table.types';

export const Table = ({ headItems, bodyItems }: ITableProps) => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const rowsPerPage = 5;
	const totalPages = Math.ceil(bodyItems.length / rowsPerPage);

	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		page: number
	) => {
		event.preventDefault();
		setCurrentPage(page);
	};

	const displayedItems = bodyItems.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	return (
		<Box width='100%'>
			<StyledPaper>
				<TableHead headItems={headItems} />
				<Divider />
				<TableBody bodyItems={displayedItems} />
				<Pagination
					totalPages={totalPages}
					currentPage={currentPage}
					onPageChange={handlePageChange}
				/>
			</StyledPaper>
		</Box>
	);
};

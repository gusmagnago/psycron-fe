import { useMemo, useState } from 'react';
import {
	Box,
	Divider,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
} from '@mui/material';
import { EditUser } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import { getComparator, stableSort } from '../sorting/sortingFunctions';

import { PatientsHeadCell } from './components/head-cell/PatientsHeadCell';
import type {
	IHeadCell,
	Order,
} from './components/head-cell/PatientsHeadCell.types';
import { patientsTablerowsData } from './components/row/rows';
import {
	StyledTable,
	StyledTableBody,
	StyledTableBodyCell,
	StyledTableBodyRow,
} from './PatientsTable.styles';
import type { IPatientsTableData } from './PatientsTable.types';

export const PatientsTable = () => {
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] =
        useState<keyof IPatientsTableData>('nextSession');

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof IPatientsTableData,
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleClick = (event: React.MouseEvent<unknown>) => {};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
        rowsPerPage -
        Math.min(
        	rowsPerPage,
        	patientsTablerowsData.length - page * rowsPerPage,
        );

	const visibleRows = useMemo(
		() =>
			stableSort(
				patientsTablerowsData,
				getComparator(order, orderBy),
			).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage],
	);

	const headCells: readonly IHeadCell[] = [
		{
			id: 'fullName',
			numeric: false,
			icon: false,
			label: 'Patient Name',
		},
		{
			id: 'nextSession',
			numeric: false,
			icon: false,
			label: 'Next Session',
		},
		{
			id: 'paymentStatus',
			numeric: false,
			icon: true,
			label: 'Payment Status',
		},
		{
			id: 'sessionsPerMonth',
			numeric: true,
			icon: false,
			label: 'Sessions Per Month',
		},
		{
			id: 'sessionVal',
			numeric: false,
			icon: false,
			label: 'Value Per Session',
		},
		{
			id: 'hasDiscount',
			numeric: false,
			icon: true,
			label: 'Discount?',
		},
		{
			id: 'discountVal',
			numeric: true,
			icon: false,
			label: 'Discount value',
		},
		{
			id: 'fullAmount',
			numeric: true,
			icon: false,
			label: 'Full amount',
		},
		{
			id: 'currency',
			numeric: true,
			icon: false,
			label: 'Currency',
		},
		{
			id: 'latestPayment',
			numeric: true,
			icon: false,
			label: 'Latest Payment',
		},
		{
			id: 'actions',
			numeric: false,
			icon: true,
			label: '',
		},
	];

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', p: '24px', borderRadius: '40px' }}>
				<TableContainer>
					<StyledTable stickyHeader>
						<PatientsHeadCell
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							items={headCells}
						/>
						<StyledTableBody>
							{visibleRows.map(
								({
									currency,
									discountVal,
									fullAmount,
									fullName,
									hasDiscount,
									latestPayment,
									nextSession,
									paymentStatus,
									sessionsPerMonth,
									sessionVal,
									id,
								}) => {
									return (
										<StyledTableBodyRow
											hover
											key={id}
											onClick={(event) =>
												handleClick(event)
											}
											tabIndex={-1}
										>
											<StyledTableBodyCell>
												{fullName}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{nextSession}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{paymentStatus}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{sessionVal}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{sessionsPerMonth}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{hasDiscount}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{discountVal}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{fullAmount}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{currency}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='right'>
												{latestPayment}
											</StyledTableBodyCell>
											<StyledTableBodyCell align='center'>
												<Tooltip title='manage patient'>
													<IconButton>
														<EditUser />
													</IconButton>
												</Tooltip>
											</StyledTableBodyCell>
										</StyledTableBodyRow>
									);
								},
							)}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 53 * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</StyledTableBody>
					</StyledTable>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={patientsTablerowsData.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
};

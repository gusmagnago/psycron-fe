import { useMemo } from 'react';

import type { ITableCellProps } from './components/table/components/table-cell/TableCell.types';
import {
	patientsTablerowsData,
	transformPatientsData,
} from './components/table/patients/components/row/rows';
import { Table } from './components/table/Table';

function App() {
	const headCells: ITableCellProps[] = [
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
			action: true,
			label: '',
		},
	];

	const transformedRows = useMemo(
		() => transformPatientsData(patientsTablerowsData),
		[],
	);
	console.log('🚀 ~ App ~ transformedRows:', transformedRows);

	return (
		<>
			{/* <PatientsTable /> */}
			<Table headItems={headCells} bodyItems={transformedRows} />
		</>
	);
}

export default App;

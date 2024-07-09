import type { IPatientsTableData } from '../patients/PatientsTable.types';

// export const descendingComparator = (
// 	a: IPatientsTableData,
// 	b: IPatientsTableData,
// 	orderBy: keyof IPatientsTableData,
// ): number => {
// 	if (b[orderBy] < a[orderBy]) return -1;
// 	if (b[orderBy] > a[orderBy]) return 1;
// 	return 0;
// };

// export const getComparator = (
// 	order: 'asc' | 'desc',
// 	orderBy: keyof IPatientsTableData,
// ): ((a: IPatientsTableData, b: IPatientsTableData) => number) => {
// 	return order === 'desc'
// 		? (a, b) => descendingComparator(a, b, orderBy)
// 		: (a, b) => -descendingComparator(a, b, orderBy);
// };

// export const stableSort = (
// 	array: readonly IPatientsTableData[],
// 	comparator: (a: IPatientsTableData, b: IPatientsTableData) => number,
// ): IPatientsTableData[] => {
// 	const stabilizedThis = array.map(
// 		(el, index) => [el, index] as [IPatientsTableData, number],
// 	);
// 	stabilizedThis.sort((a, b) => {
// 		const order = comparator(a[0], b[0]);
// 		if (order !== 0) return order;
// 		return a[1] - b[1];
// 	});
// 	return stabilizedThis.map((el) => el[0]);
// };

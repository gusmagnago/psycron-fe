import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type {
	PatientWorkspaceColumn,
	PatientWorkspaceColumnFilterOption,
	PatientWorkspaceFilterableColumn,
	PatientWorkspaceRow,
} from '../PatientsPage.types';
import { getPatientColumnFilterOption } from '../PatientsPage.utils';

const FILTERABLE_COLUMNS: PatientWorkspaceFilterableColumn[] = [
	'patient',
	'contact',
	'next-action',
	'next-session',
	'billing',
];

interface UseWorkspaceRowsOptions {
	columnFilters: Partial<Record<PatientWorkspaceFilterableColumn, string>>;
	filterColumn: PatientWorkspaceFilterableColumn | null;
	patients: PatientWorkspaceRow[];
	/**
	 * Only on-screen columns may filter. A hidden column's filter has no header
	 * left to clear it from, so honouring it would exclude rows invisibly.
	 */
	visibleColumnSet: Set<PatientWorkspaceColumn>;
}

interface UseWorkspaceRowsResult {
	columnFilterOptions: PatientWorkspaceColumnFilterOption[];
	rows: PatientWorkspaceRow[];
}

/**
 * Applies the active column filters to the loaded patient rows and derives the
 * distinct-value options for the open column filter. Memoized so drawer/control
 * toggles don't re-run the filter+localeCompare work on every render.
 *
 * Row *order* is never touched here: every column maps to a server sort key
 * (see COLUMN_SORT_FIELDS in PatientListPage), so the query returns globally
 * correct order and a client re-sort would only scramble the loaded window.
 *
 * Filtering, by contrast, still refines the currently-loaded pages only.
 */
export const useWorkspaceRows = ({
	columnFilters,
	filterColumn,
	patients,
	visibleColumnSet,
}: UseWorkspaceRowsOptions): UseWorkspaceRowsResult => {
	const { i18n, t } = useTranslation();
	const { language } = i18n;

	const rows = useMemo(
		() =>
			patients.filter((patient) =>
				FILTERABLE_COLUMNS.every((column) => {
					const selectedValue = columnFilters[column];
					return (
						!selectedValue ||
						!visibleColumnSet.has(column) ||
						getPatientColumnFilterOption(patient, column, language, t).value ===
							selectedValue
					);
				})
			),
		[columnFilters, language, patients, t, visibleColumnSet]
	);

	const columnFilterOptions = useMemo<PatientWorkspaceColumnFilterOption[]>(
		() =>
			filterColumn
				? Array.from(
						new Map(
							patients.map((patient) => {
								const option = getPatientColumnFilterOption(
									patient,
									filterColumn,
									language,
									t
								);
								return [option.value, option] as const;
							})
						).values()
					).sort((firstOption, secondOption) =>
						firstOption.label.localeCompare(secondOption.label, language, {
							numeric: true,
							sensitivity: 'base',
						})
					)
				: [],
		[filterColumn, language, patients, t]
	);

	return { columnFilterOptions, rows };
};

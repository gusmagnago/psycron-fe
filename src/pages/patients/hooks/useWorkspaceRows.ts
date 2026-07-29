import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type {
	PatientWorkspaceColumnFilterOption,
	PatientWorkspaceFilterableColumn,
	PatientWorkspaceRow,
	PatientWorkspaceSortState,
} from '../PatientsPage.types';
import {
	getPatientColumnFilterOption,
	getPatientColumnSortValue,
} from '../PatientsPage.utils';

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
	/**
	 * When the active sort column is server-authoritative, the query already
	 * returns globally-correct order — skip the client re-sort so the loaded
	 * window isn't reordered out of sync with the server.
	 */
	isServerSorted: boolean;
	patients: PatientWorkspaceRow[];
	workspaceSort: PatientWorkspaceSortState;
}

interface UseWorkspaceRowsResult {
	columnFilterOptions: PatientWorkspaceColumnFilterOption[];
	rows: PatientWorkspaceRow[];
}

/**
 * Applies the active column filters and client-side sort to the loaded patient
 * rows, and derives the distinct-value options for the open column filter.
 * Memoized so drawer/control toggles don't re-run the filter+sort+localeCompare
 * work on every render.
 *
 * Note: this refines the currently-loaded pages. Global ordering/membership is
 * server-authoritative (see the patient workspace sort/filter decision); server
 * sort keys are wired separately in PatientListPage.
 */
export const useWorkspaceRows = ({
	columnFilters,
	filterColumn,
	isServerSorted,
	patients,
	workspaceSort,
}: UseWorkspaceRowsOptions): UseWorkspaceRowsResult => {
	const { i18n, t } = useTranslation();
	const { language } = i18n;

	const rows = useMemo(() => {
		const filtered = patients.filter((patient) =>
			FILTERABLE_COLUMNS.every((column) => {
				const selectedValue = columnFilters[column];
				return (
					!selectedValue ||
					getPatientColumnFilterOption(patient, column, language, t).value ===
						selectedValue
				);
			})
		);

		// Server order is authoritative for server-sortable columns; only the
		// loaded-window-only columns still get a client sort.
		if (isServerSorted) return filtered;

		return filtered.sort((firstPatient, secondPatient) => {
			const firstValue = getPatientColumnSortValue(
				firstPatient,
				workspaceSort.column,
				language,
				t
			);
			const secondValue = getPatientColumnSortValue(
				secondPatient,
				workspaceSort.column,
				language,
				t
			);
			const comparison =
				typeof firstValue === 'number' && typeof secondValue === 'number'
					? firstValue - secondValue
					: String(firstValue).localeCompare(String(secondValue), language, {
							numeric: true,
							sensitivity: 'base',
						});
			return workspaceSort.direction === 'asc' ? comparison : -comparison;
		});
	}, [columnFilters, isServerSorted, language, patients, t, workspaceSort]);

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

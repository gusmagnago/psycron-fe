import { useEffect, useState } from 'react';

import type { PatientWorkspaceColumn } from '../PatientsPage.types';

const PATIENT_COLUMNS_STORAGE_KEY = '_psy_pc_v1';

export const DEFAULT_VISIBLE_COLUMNS: PatientWorkspaceColumn[] = [
	'patient',
	'contact',
	'next-action',
	'next-session',
	'billing',
	'sessions',
];

export const OPTIONAL_COLUMNS: Exclude<PatientWorkspaceColumn, 'patient'>[] = [
	'contact',
	'next-action',
	'next-session',
	'billing',
	'sessions',
];

const getInitialVisibleColumns = (): PatientWorkspaceColumn[] => {
	try {
		const storedValue = localStorage.getItem(PATIENT_COLUMNS_STORAGE_KEY);
		if (!storedValue) return DEFAULT_VISIBLE_COLUMNS;

		const parsedValue: unknown = JSON.parse(storedValue);
		if (!Array.isArray(parsedValue)) return DEFAULT_VISIBLE_COLUMNS;

		const validColumns = parsedValue.filter(
			(value): value is PatientWorkspaceColumn =>
				typeof value === 'string' &&
				DEFAULT_VISIBLE_COLUMNS.includes(value as PatientWorkspaceColumn)
		);

		return ['patient', ...validColumns.filter((value) => value !== 'patient')];
	} catch {
		return DEFAULT_VISIBLE_COLUMNS;
	}
};

interface UsePatientWorkspaceColumnsResult {
	toggleColumn: (column: PatientWorkspaceColumn) => void;
	visibleColumnSet: Set<PatientWorkspaceColumn>;
	visibleColumns: PatientWorkspaceColumn[];
}

/**
 * Owns the patient workspace's visible-column selection and its versioned,
 * non-PHI local persistence (the column keys only — never patient data).
 */
export const usePatientWorkspaceColumns =
	(): UsePatientWorkspaceColumnsResult => {
		const [visibleColumns, setVisibleColumns] = useState<
			PatientWorkspaceColumn[]
		>(getInitialVisibleColumns);

		useEffect(() => {
			try {
				localStorage.setItem(
					PATIENT_COLUMNS_STORAGE_KEY,
					JSON.stringify(visibleColumns)
				);
			} catch {
				// Column visibility stays functional when storage is unavailable.
			}
		}, [visibleColumns]);

		const toggleColumn = (column: PatientWorkspaceColumn): void => {
			setVisibleColumns((current) =>
				current.includes(column)
					? current.filter((value) => value !== column)
					: [...current, column]
			);
		};

		return {
			toggleColumn,
			visibleColumnSet: new Set(visibleColumns),
			visibleColumns,
		};
	};

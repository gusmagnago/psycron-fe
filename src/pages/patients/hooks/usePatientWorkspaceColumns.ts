import { useEffect, useMemo, useState } from 'react';

import type { PatientWorkspaceColumn } from '../PatientsPage.types';
import {
	readPatientWorkspacePreferences,
	writePatientWorkspacePreferences,
} from '../patientWorkspaceStorage';

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
	const { columns } = readPatientWorkspacePreferences();
	if (!Array.isArray(columns)) return DEFAULT_VISIBLE_COLUMNS;

	const validColumns = columns.filter(
		(value): value is PatientWorkspaceColumn =>
			typeof value === 'string' &&
			DEFAULT_VISIBLE_COLUMNS.includes(value as PatientWorkspaceColumn)
	);

	// 'patient' is not optional — always lead with it.
	return ['patient', ...validColumns.filter((value) => value !== 'patient')];
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
			writePatientWorkspacePreferences({ columns: visibleColumns });
		}, [visibleColumns]);

		const visibleColumnSet = useMemo(
		() => new Set(visibleColumns),
		[visibleColumns]
	);

	const toggleColumn = (column: PatientWorkspaceColumn): void => {
			setVisibleColumns((current) =>
				current.includes(column)
					? current.filter((value) => value !== column)
					: [...current, column]
			);
		};

		return {
			toggleColumn,
			// Memoized: a fresh Set every render would bust every downstream
			// useMemo that takes it as a dependency.
			visibleColumnSet,
			visibleColumns,
		};
	};

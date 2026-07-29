import { useEffect, useState } from 'react';

import type {
	PatientListUiPreferences,
	UsePatientListUiPreferencesOptions,
	UsePatientListUiPreferencesResult,
} from './usePatientListUiPreferences.types';

const PATIENT_LIST_UI_PREFERENCES_STORAGE_KEY = '_psy_patients_ui_v1';

const getDefaultPreferences = (
	isDesktopTable: boolean
): PatientListUiPreferences => ({
	isWorkspaceControlsExpanded: isDesktopTable,
	isWorkQueuesExpanded: true,
});

const isPatientListUiPreferences = (
	value: unknown
): value is PatientListUiPreferences => {
	if (!value || typeof value !== 'object') return false;

	const preferences = value as Record<string, unknown>;
	return (
		typeof preferences.isWorkspaceControlsExpanded === 'boolean' &&
		typeof preferences.isWorkQueuesExpanded === 'boolean'
	);
};

const getInitialPreferences = (
	isDesktopTable: boolean
): PatientListUiPreferences => {
	const defaults = getDefaultPreferences(isDesktopTable);

	try {
		const storedPreferences = localStorage.getItem(
			PATIENT_LIST_UI_PREFERENCES_STORAGE_KEY
		);
		if (!storedPreferences) return defaults;

		const parsedPreferences: unknown = JSON.parse(storedPreferences);
		return isPatientListUiPreferences(parsedPreferences)
			? parsedPreferences
			: defaults;
	} catch {
		return defaults;
	}
};

export const usePatientListUiPreferences = ({
	isDesktopTable,
}: UsePatientListUiPreferencesOptions): UsePatientListUiPreferencesResult => {
	const [initialPreferences] = useState(() =>
		getInitialPreferences(isDesktopTable)
	);
	const [isWorkspaceControlsExpanded, setIsWorkspaceControlsExpanded] =
		useState(initialPreferences.isWorkspaceControlsExpanded);
	const [isWorkQueuesExpanded, setIsWorkQueuesExpanded] = useState(
		initialPreferences.isWorkQueuesExpanded
	);

	useEffect(() => {
		try {
			const preferences: PatientListUiPreferences = {
				isWorkspaceControlsExpanded,
				isWorkQueuesExpanded,
			};
			localStorage.setItem(
				PATIENT_LIST_UI_PREFERENCES_STORAGE_KEY,
				JSON.stringify(preferences)
			);
		} catch {
			// UI preferences remain functional when storage is unavailable.
		}
	}, [isWorkspaceControlsExpanded, isWorkQueuesExpanded]);

	return {
		isWorkspaceControlsExpanded,
		isWorkQueuesExpanded,
		setIsWorkspaceControlsExpanded,
		setIsWorkQueuesExpanded,
	};
};

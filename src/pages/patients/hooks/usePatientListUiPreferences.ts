import { useEffect, useState } from 'react';

import {
	readPatientWorkspacePreferences,
	writePatientWorkspacePreferences,
} from '../patientWorkspaceStorage';

import type {
	PatientListUiPreferences,
	UsePatientListUiPreferencesOptions,
	UsePatientListUiPreferencesResult,
} from './usePatientListUiPreferences.types';

const getDefaultPreferences = (
	isDesktopTable: boolean
): PatientListUiPreferences => ({
	isWorkspaceControlsExpanded: isDesktopTable,
	isWorkQueuesExpanded: true,
});

const getInitialPreferences = (
	isDesktopTable: boolean
): PatientListUiPreferences => {
	const defaults = getDefaultPreferences(isDesktopTable);
	const stored = readPatientWorkspacePreferences();

	return {
		isWorkspaceControlsExpanded:
			typeof stored.isWorkspaceControlsExpanded === 'boolean'
				? stored.isWorkspaceControlsExpanded
				: defaults.isWorkspaceControlsExpanded,
		isWorkQueuesExpanded:
			typeof stored.isWorkQueuesExpanded === 'boolean'
				? stored.isWorkQueuesExpanded
				: defaults.isWorkQueuesExpanded,
	};
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
		writePatientWorkspacePreferences({
			isWorkspaceControlsExpanded,
			isWorkQueuesExpanded,
		});
	}, [isWorkspaceControlsExpanded, isWorkQueuesExpanded]);

	return {
		isWorkspaceControlsExpanded,
		isWorkQueuesExpanded,
		setIsWorkspaceControlsExpanded,
		setIsWorkQueuesExpanded,
	};
};

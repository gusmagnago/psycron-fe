import type { Dispatch, SetStateAction } from 'react';

export interface PatientListUiPreferences {
	isWorkQueuesExpanded: boolean;
	isWorkspaceControlsExpanded: boolean;
}

export interface UsePatientListUiPreferencesOptions {
	isDesktopTable: boolean;
}

export interface UsePatientListUiPreferencesResult
	extends PatientListUiPreferences {
	setIsWorkQueuesExpanded: Dispatch<SetStateAction<boolean>>;
	setIsWorkspaceControlsExpanded: Dispatch<SetStateAction<boolean>>;
}

import type {
	ConflictStatus,
	PatientMergeFieldSelections,
} from '@psycron/api/user/conflicts/index.types';

export interface UpdateConflictInput {
	actionTaken?: string;
	conflictId: string;
	fieldSelections?: PatientMergeFieldSelections;
	primaryPatientId?: string;
	secondaryPatientId?: string;
	status: Extract<ConflictStatus, 'DISMISSED' | 'RESOLVED'>;
}

export interface UseConflictsPageStateParams {
	t: (key: string) => string;
}

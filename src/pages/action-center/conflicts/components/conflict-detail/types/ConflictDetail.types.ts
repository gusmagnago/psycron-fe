import type {
	IBookingConflictMetadata,
	IConflict,
	IPatientDuplicateConflictMetadata,
	ISlotReplicationConflictMetadata,
	PatientMergeFieldSelections,
} from '@psycron/api/user/conflicts/index.types';

import type { UpdateConflictInput } from '../../../hooks/useConflictsPageState';

export interface ConflictDetailProps {
	conflict: IConflict | null;
	isUpdating: boolean;
	onUpdateConflict: (input: UpdateConflictInput) => void;
}

export interface PatientDuplicateConflictDetailProps {
	metadata: IPatientDuplicateConflictMetadata;
	shouldFetchCandidates?: boolean;
	t: (key: string) => string;
}

export interface PatientDuplicateMergeReviewProps {
	metadata: IPatientDuplicateConflictMetadata;
	onCancel: () => void;
	onConfirm: (input: {
		fieldSelections: PatientMergeFieldSelections;
		primaryPatientId: string;
		secondaryPatientId: string;
	}) => void;
}

export interface ConflictResolutionSummaryProps {
	conflict: IConflict;
}

export interface SlotReplicationConflictDetailProps {
	metadata: ISlotReplicationConflictMetadata;
	t: (key: string) => string;
}

export interface DayBlockConflictDetailProps {
	metadata: IBookingConflictMetadata;
	t: (key: string) => string;
}

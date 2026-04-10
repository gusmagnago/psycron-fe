import type {
	IConflict,
	IPatientDuplicateConflictMetadata,
	ISlotReplicationConflictMetadata,
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

export interface SlotReplicationConflictDetailProps {
	metadata: ISlotReplicationConflictMetadata;
	t: (key: string) => string;
}

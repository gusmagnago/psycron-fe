import type {
	ConflictStatus,
	IConflict,
} from '@psycron/api/user/conflicts/index.types';

export interface ConflictDetailProps {
	conflict: IConflict | null;
	isUpdating: boolean;
	onUpdateConflict: (input: {
		actionTaken?: string;
		conflictId: string;
		status: Extract<ConflictStatus, 'DISMISSED' | 'RESOLVED'>;
	}) => void;
}

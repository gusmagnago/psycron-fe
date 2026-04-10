import type { IConflict } from '@psycron/api/user/conflicts/index.types';

import type { UpdateConflictInput } from '../../hooks/useConflictsPageState';

export interface ConflictDetailProps {
	conflict: IConflict | null;
	isUpdating: boolean;
	onUpdateConflict: (input: UpdateConflictInput) => void;
}

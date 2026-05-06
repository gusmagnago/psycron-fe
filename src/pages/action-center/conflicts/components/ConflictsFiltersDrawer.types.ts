import type { ConflictStatus, ConflictType } from '@psycron/api/user/conflicts/index.types';

export interface ConflictsFiltersDrawerProps {
	activeFilterCount: number;
	isOpen: boolean;
	onClose: () => void;
	onSetStatusFilter: (value: ConflictStatus | undefined) => void;
	onSetTypeFilter: (value: ConflictType | undefined) => void;
	statusFilter: ConflictStatus | undefined;
	typeFilter: ConflictType | undefined;
}

import type {
	PatientListStatusFilter,
	PatientWorkspaceColumn,
} from '../PatientsPage.types';

export interface WorkspaceControlsProps {
	columnsOpen: boolean;
	isWorkspaceControlsExpanded: boolean;
	onSearchChange: (value: string) => void;
	onSortChange: (value: string) => void;
	onStatusChange: (value: PatientListStatusFilter) => void;
	onToggleColumn: (column: PatientWorkspaceColumn) => void;
	onToggleColumns: () => void;
	onToggleControls: () => void;
	searchQuery: string;
	sortValue: string;
	statusFilter: PatientListStatusFilter;
	visibleColumnSet: Set<PatientWorkspaceColumn>;
}

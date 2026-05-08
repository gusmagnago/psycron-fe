export type PendingTaskType = 'invoices' | 'messages' | 'session-notes';

export interface PendingTask {
	count: number;
	label: string;
	onClick?: () => void;
	type: PendingTaskType;
}

export interface PendingTasksWidgetProps {
	isLoading?: boolean;
	tasks: PendingTask[];
}

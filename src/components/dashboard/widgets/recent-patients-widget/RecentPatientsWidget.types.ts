export interface RecentPatient {
	firstName: string;
	id: string;
	lastName: string;
	lastNoteLabel: string;
	onMessage?: () => void;
	onOpen?: () => void;
}

export interface RecentPatientsWidgetProps {
	isLoading?: boolean;
	onViewAll?: () => void;
	patients: RecentPatient[];
}

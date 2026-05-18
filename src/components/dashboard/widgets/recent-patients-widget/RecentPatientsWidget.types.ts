import type { DashboardRecentPatientActivityType, DashboardTier } from '@psycron/api/dashboard/index.types';

export interface RecentPatient {
	firstName: string;
	id: string;
	lastActivityAt: string | null;
	lastActivityType: DashboardRecentPatientActivityType;
	lastName: string;
	onMessage?: () => void;
	onOpen?: () => void;
	tier: DashboardTier;
}

export interface RecentPatientsWidgetProps {
	colSpan?: number;
	isLoading?: boolean;
	onViewAll?: () => void;
	patients: RecentPatient[];
}

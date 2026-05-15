export type DashboardTier = 'active' | 'growing' | 'onboarding';

export type DashboardQuickActionId =
	| 'add-patient'
	| 'availability-settings'
	| 'fix-reminders'
	| 'follow-up-cancellations'
	| 'patients'
	| 'setup-availability'
	| 'view-week';

export type DashboardActionTarget =
	| { type: 'add-patient' }
	| { type: 'availability-settings' }
	| { date?: string; type: 'availability-week' }
	| { type: 'availability-wizard' }
	| { type: 'notification-settings' }
	| { type: 'patients' };

export interface DashboardQuickAction {
	id: DashboardQuickActionId;
	labelKey: string;
	rank: number;
	target: DashboardActionTarget;
}

export type DashboardPendingTaskType =
	| 'cancellation-followups'
	| 'missing-billing'
	| 'missing-contact'
	| 'reminder-delivery'
	| 'setup-availability';

export interface DashboardPendingTask {
	count: number;
	labelKey: string;
	rank: number;
	target: DashboardActionTarget;
	type: DashboardPendingTaskType;
}

export type DashboardRecentPatientActivityType =
	| 'cancelled'
	| 'created'
	| 'session'
	| 'updated';

export interface DashboardRecentPatient {
	firstName: string;
	hasMessageContact: boolean;
	id: string;
	lastActivityAt: string | null;
	lastActivityType: DashboardRecentPatientActivityType;
	lastName: string;
}

export interface DashboardWeekSeriesDay {
	blocked: number;
	booked: number;
	cancelled: number;
	completed: number;
	date: string;
	isToday: boolean;
	label: string;
	upcoming: number;
}

export interface DashboardBillingReadiness {
	configuredCount: number;
	missingCount: number;
	percentage: number;
	status: 'empty' | 'partial' | 'ready';
	totalCount: number;
}

export interface DashboardWeekMetrics {
	adminBlockedMinutes: number;
	adminBlockedSlots: number;
	bookedCount: number;
	cancelledCount: number;
	completedCount: number;
	end: string;
	start: string;
	todayBookedCount: number;
	upcomingCount: number;
}

export interface DashboardSummaryResponse {
	activePatients: {
		count: number;
	};
	billingReadiness: DashboardBillingReadiness;
	locale: 'en' | 'pt';
	nudges: Array<{
		id: string;
		text: string;
		type: 'billing' | 'operations' | 'schedule' | 'setup';
	}>;
	pendingTasks: DashboardPendingTask[];
	quickActions: DashboardQuickAction[];
	recentPatients: DashboardRecentPatient[];
	setup: {
		hasAvailability: boolean;
		hasJupiterConfig: boolean;
		remindersEnabled: boolean;
	};
	tier: DashboardTier;
	week: DashboardWeekMetrics;
	weeklySeries: DashboardWeekSeriesDay[];
}

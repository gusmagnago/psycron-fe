import type { NotificationStatus } from '@psycron/api/notifications/index.types';

export type DashboardTier = 'active' | 'growing' | 'onboarding';

export type DashboardWidgetInfoId =
	| 'action-center'
	| 'billing-readiness'
	| 'jupiter-insights'
	| 'latest-patients'
	| 'notifications'
	| 'pending-tasks'
	| 'quick-actions'
	| 'recent-patients'
	| 'revenue'
	| 'schedule'
	| 'session-analytics';

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
	| { tab?: 'conflicts' | 'recovery'; type: 'action-center' }
	| { type: 'availability-settings' }
	| { date?: string; type: 'availability-week' }
	| { type: 'availability-wizard' }
	| { status?: NotificationStatus; type: 'notifications' }
	| { type: 'notification-settings' }
	| { type: 'patients' };

export interface DashboardQuickAction {
	descriptionKey?: string;
	descriptionValues?: Record<string, number | string>;
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
	descriptionKey?: string;
	descriptionValues?: Record<string, number | string>;
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

export type DashboardNotificationChannel = 'EMAIL' | 'ICALENDAR' | 'SMS' | 'WHATSAPP';

export interface DashboardNotifications24h {
	channels: Record<DashboardNotificationChannel, number>;
	failed: number;
	queued: number;
	sent: number;
	windowHours: 24;
}

export interface DashboardRevenueEstimate {
	amount: number;
	bookedSessionCount: number;
	completedSessionCount: number;
	configuredBillingCount: number;
	currency: string;
	deltaPercent: number | null;
	isEstimated: true;
	missingBillingCount: number;
	monthLabel: string;
	previousAmount: number;
}

export type DashboardActionCenterItemType =
	| 'notification-failed'
	| 'patient-duplicate'
	| 'recovery-needed'
	| 'schedule-conflict';

export interface DashboardActionCenterItem {
	count: number;
	labelKey: string;
	rank: number;
	target: DashboardActionTarget;
	tone: 'danger' | 'info' | 'today' | 'warning';
	type: DashboardActionCenterItemType;
}

export interface DashboardActionCenterSummary {
	items: DashboardActionCenterItem[];
	total: number;
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

export interface DashboardLatestPatient {
	createdAt: string;
	firstName: string;
	id: string;
	lastName: string;
}

export interface DashboardSummaryResponse {
	actionCenter: DashboardActionCenterSummary;
	activePatients: {
		count: number;
	};
	billingReadiness: DashboardBillingReadiness;
	latestPatients: DashboardLatestPatient[];
	locale: 'en' | 'pt';
	month: DashboardWeekMetrics;
	monthlySeries: DashboardWeekSeriesDay[];
	notifications24h: DashboardNotifications24h;
	nudges: Array<{
		id: string;
		text: string;
		type: 'billing' | 'operations' | 'schedule' | 'setup';
	}>;
	pendingTasks: DashboardPendingTask[];
	quickActions: DashboardQuickAction[];
	recentPatients: DashboardRecentPatient[];
	revenueEstimate: DashboardRevenueEstimate;
	setup: {
		hasAvailability: boolean;
		hasJupiterConfig: boolean;
		remindersEnabled: boolean;
	};
	tier: DashboardTier;
	week: DashboardWeekMetrics;
	weeklySeries: DashboardWeekSeriesDay[];
}

export interface SubmitDashboardWidgetFeedbackPayload {
	feedback: string;
	tier?: DashboardTier;
	widgetId: DashboardWidgetInfoId;
}

export interface SubmitDashboardWidgetFeedbackResponse {
	createdAt: string;
	id: string;
	success: true;
}

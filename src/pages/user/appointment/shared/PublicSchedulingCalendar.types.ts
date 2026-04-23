import type { ReactNode } from 'react';

export type DayTone = 'error' | 'info' | 'neutral' | 'success';
export type PublicSchedulingViewMode = 'month' | 'week';

export interface PublicSchedulingDayMeta {
	countLabel?: string;
	disabled?: boolean;
	highlighted?: boolean;
	indicatorCount?: number;
	tone?: DayTone;
}

export interface PublicSchedulingCalendarProps {
	compactPrimaryActions?: boolean;
	detailBody: ReactNode;
	detailSubtitle?: string | null;
	detailTitle: string;
	getDayMeta: (date: Date) => PublicSchedulingDayMeta;
	greetingTitle: string;
	language: string;
	mainSubtitle?: string | null;
	mainTitle: string;
	minNavigableDate?: Date | null;
	month: Date;
	monthLabel: string;
	onMonthChange: (date: Date) => void;
	onSelectDate: (date: Date) => void;
	onTodayClick?: () => void;
	onViewModeChange?: (viewMode: PublicSchedulingViewMode) => void;
	selectedDate: Date | null;
	sidebar: ReactNode;
	todayLabel?: string;
	topActions?: ReactNode;
	topActionsPosition?: 'below' | 'inline';
	viewMode?: PublicSchedulingViewMode;
	weekLabel: string;
}

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
	detailBody: ReactNode;
	detailSubtitle?: string | null;
	detailTitle: string;
	getDayMeta: (date: Date) => PublicSchedulingDayMeta;
	greetingTitle: string;
	language: string;
	mainSubtitle?: string | null;
	mainTitle: string;
	month: Date;
	monthLabel: string;
	onMonthChange: (date: Date) => void;
	onSelectDate: (date: Date) => void;
	onViewModeChange?: (viewMode: PublicSchedulingViewMode) => void;
	selectedDate: Date | null;
	sidebar: ReactNode;
	topActions?: ReactNode;
	viewMode?: PublicSchedulingViewMode;
	weekLabel: string;
}

import type { ReactNode } from 'react';

export interface FeaturePageLayoutColors {
	accent: string;
	accentBorder: string;
	accentHoverBorder: string;
	accentSelectedBorder: string;
	accentSoft: string;
	accentSofter: string;
	accentStrongSoft: string;
}

export interface FeaturePageTabItem<Value extends string = string> {
	disabled?: boolean;
	label: ReactNode;
	value: Value;
}

export interface FeaturePageTabs<Value extends string = string> {
	ariaLabel: string;
	items: FeaturePageTabItem<Value>[];
	onChange: (value: Value) => void;
	value: Value;
}

export interface FeaturePageLayoutProps<Value extends string = string> {
	ariaLabel?: string;
	children: ReactNode;
	colors?: FeaturePageLayoutColors;
	isLoading?: boolean;
	subTitle?: string;
	tabs?: FeaturePageTabs<Value>;
	title: string;
}

export interface FeaturePageQueueAccessibilityLabels {
	detailLabel: string;
	queueLabel: string;
}

export type FeaturePageQueueAnalyticsEventName =
	'feature_page_queue_expansion_changed';

export interface FeaturePageQueueAnalyticsEvent {
	name: FeaturePageQueueAnalyticsEventName;
	properties: {
		isExpanded: boolean;
		surface: string;
	};
}

export interface FeaturePageQueueAnalytics {
	onEvent?: (event: FeaturePageQueueAnalyticsEvent) => void;
	surface: string;
}

export interface FeaturePageQueueProps {
	accessibility: FeaturePageQueueAccessibilityLabels;
	analytics?: FeaturePageQueueAnalytics;
	children: ReactNode;
	detailTitle?: ReactNode;
	isDetailOpen?: boolean;
	isQueueExpanded: boolean;
	onDetailClose?: () => void;
	onQueueExpandedChange: (isExpanded: boolean) => void;
	queueControls?: ReactNode;
	queueList: ReactNode;
	queueSummary: ReactNode;
}

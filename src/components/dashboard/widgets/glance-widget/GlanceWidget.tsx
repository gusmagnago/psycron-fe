import { useMemo } from 'react';

import {
	GlanceCopy,
	GlanceIconBox,
	GlanceLabel,
	GlanceRoot,
	GlanceSkeleton,
	GlanceStatCard,
	GlanceValue,
} from './GlanceWidget.styles';
import type { GlanceWidgetProps } from './GlanceWidget.types';

const SKELETON_COUNT = 3;

export const GlanceWidget = ({ isLoading, stats }: GlanceWidgetProps) => {
	const skeletons = useMemo(
		() =>
			Array.from({ length: SKELETON_COUNT }, (_, index) => (
				<GlanceSkeleton
					key={`glance-skeleton-${index}`}
					variant='rectangular'
				/>
			)),
		[]
	);

	if (isLoading) {
		return <GlanceRoot>{skeletons}</GlanceRoot>;
	}

	return (
		<GlanceRoot data-testid='dashboard-glance-widget' id='dashboard-glance-widget'>
			{stats.map((stat) => (
				<GlanceStatCard
					data-testid={`dashboard-glance-stat-${stat.id}`}
					id={`dashboard-glance-stat-${stat.id}`}
					key={stat.id}
					onClick={stat.onClick}
					aria-label={stat.ariaLabel}
					type='button'
					whileTap={{ scale: 0.98 }}
				>
					<GlanceIconBox tone={stat.tone}>{stat.icon}</GlanceIconBox>
					<GlanceCopy>
						<GlanceValue>{stat.value}</GlanceValue>
						<GlanceLabel>{stat.label}</GlanceLabel>
					</GlanceCopy>
				</GlanceStatCard>
			))}
		</GlanceRoot>
	);
};

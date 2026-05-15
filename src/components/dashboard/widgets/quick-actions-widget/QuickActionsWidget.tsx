import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import type { DashboardQuickActionId } from '@psycron/api/dashboard/index.types';
import { ChevronRight } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import { WidgetHeader, WidgetTitle } from '../schedule-widget/ScheduleWidget.styles';

import {
	ActionButton,
	ActionChevron,
	ActionIconWrapper,
	ActionLabel,
	ActionsList,
	Badge,
} from './QuickActionsWidget.styles';
import type { ActionAccent, QuickActionsWidgetProps } from './QuickActionsWidget.types';

const getActionAccent = (id: DashboardQuickActionId): ActionAccent => {
	switch (id) {
		case 'add-patient':
			return { bg: palette.success.surface.light, fg: palette.success.dark };
		case 'availability-settings':
			return { bg: palette.tertiary.surface.light, fg: palette.tertiary.dark };
		case 'fix-reminders':
			return { bg: palette.alert.surface.light, fg: palette.alert.dark };
		case 'follow-up-cancellations':
			return { bg: palette.info.surface.light, fg: palette.info.dark };
		case 'patients':
			return { bg: palette.secondary.surface.light, fg: palette.secondary.dark };
		case 'setup-availability':
			return { bg: palette.tertiary.surface.light, fg: palette.tertiary.dark };
		case 'view-week':
			return { bg: palette.primary.surface.light, fg: palette.primary.dark };
	}
};

const rowVariants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.05, duration: 0.25, ease: 'easeOut' },
	}),
};

export const QuickActionsWidget = ({
	actions,
	isLoading,
}: QuickActionsWidgetProps) => {
	const { t } = useTranslation();

	if (isLoading) {
		return (
			<Box display='flex' flexDirection='column' gap={1}>
				{[...Array(4)].map((_, i) => (
					<Skeleton
						height={56}
						key={`quick-action-skeleton-${i}`}
						sx={{ borderRadius: '12px' }}
						variant='rectangular'
					/>
				))}
			</Box>
		);
	}

	return (
		<>
			<WidgetHeader>
				<WidgetTitle>{t('page.dashboard.widgets.quick-actions.title')}</WidgetTitle>
			</WidgetHeader>
			<ActionsList>
				{actions.map((action, i) => {
					const accent = getActionAccent(action.id);
					return (
						<ActionButton
							animate='visible'
							aria-label={action.ariaLabel}
							custom={i}
							hasBadge={!!action.badge}
							initial='hidden'
							key={action.id}
							onClick={action.onClick}
							variants={rowVariants}
							whileTap={{ scale: 0.98 }}
						>
							<ActionIconWrapper iconBg={accent.bg} iconFg={accent.fg}>
								{action.icon}
							</ActionIconWrapper>
							<ActionLabel>{action.label}</ActionLabel>
							{action.badge !== undefined && action.badge > 0 ? (
								<Badge aria-label={`${action.badge} pending`}>{action.badge}</Badge>
							) : null}
							<ActionChevron data-chevron='true'>
								<ChevronRight />
							</ActionChevron>
						</ActionButton>
					);
				})}
			</ActionsList>
		</>
	);
};

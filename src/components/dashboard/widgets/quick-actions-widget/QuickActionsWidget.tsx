import { useTranslation } from 'react-i18next';

import { WidgetTitle } from '../schedule-widget/ScheduleWidget.styles';
import { WidgetHeader } from '../schedule-widget/ScheduleWidget.styles';

import {
	ActionButton,
	ActionIconWrapper,
	ActionLabel,
	ActionsList,
	Badge,
} from './QuickActionsWidget.styles';
import type { QuickActionsWidgetProps } from './QuickActionsWidget.types';

const rowVariants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.05, duration: 0.25, ease: 'easeOut' },
	}),
};

export const QuickActionsWidget = ({ actions }: QuickActionsWidgetProps) => {
	const { t } = useTranslation();

	return (
		<>
			<WidgetHeader>
				<WidgetTitle>{t('page.dashboard.widgets.quick-actions.title')}</WidgetTitle>
			</WidgetHeader>
			<ActionsList>
				{actions.map((action, i) => (
					<ActionButton
						animate='visible'
						aria-label={action.ariaLabel}
						custom={i}
						hasBadge={!!action.badge}
						initial='hidden'
						key={action.id}
						onClick={action.onClick}
						variants={rowVariants}
					>
						<ActionIconWrapper>{action.icon}</ActionIconWrapper>
						<ActionLabel>{action.label}</ActionLabel>
						{action.badge !== undefined && action.badge > 0 ? (
							<Badge aria-label={`${action.badge} pending`}>{action.badge}</Badge>
						) : null}
					</ActionButton>
				))}
			</ActionsList>
		</>
	);
};

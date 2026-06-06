import { useTranslation } from 'react-i18next';
import { IconBox } from '@psycron/components/dashboard/icon-box/IconBox';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { ChevronRight } from '@psycron/components/icons';

import {
	ActionButton,
	ActionChevron,
	ActionDescription,
	ActionLabel,
	ActionSkeleton,
	ActionsList,
	ActionText,
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

export const QuickActionsWidget = ({
	actions,
	colSpan,
	isLoading,
}: QuickActionsWidgetProps) => {
	const isWide = (colSpan ?? 0) >= 6;
	const { t } = useTranslation();

	const body = isLoading ? (
		<ActionsList isWide={isWide}>
			{[...Array(4)].map((_, i) => (
				<ActionSkeleton
					height={56}
					key={`quick-action-skeleton-${i}`}
					variant='rectangular'
				/>
			))}
		</ActionsList>
	) : (
		<ActionsList isWide={isWide}>
			{actions.map((action, i) => (
				<ActionButton
					animate='visible'
					aria-label={action.ariaLabel}
					custom={i}
					initial='hidden'
					key={action.id}
					onClick={action.onClick}
					type='button'
					variants={rowVariants}
					whileTap={{ scale: 0.98 }}
				>
					<IconBox tone={action.tone}>{action.icon}</IconBox>
					<ActionText>
						<ActionLabel>{action.label}</ActionLabel>
						{action.description ? (
							<ActionDescription>{action.description}</ActionDescription>
						) : null}
					</ActionText>
					{action.badge !== undefined && action.badge > 0 ? (
						<Badge aria-label={`${action.badge} pending`}>{action.badge}</Badge>
					) : null}
					<ActionChevron data-chevron='true'>
						<ChevronRight />
					</ActionChevron>
				</ActionButton>
			))}
		</ActionsList>
	);

	return (
		<WidgetLayout
			body={body}
			title={t('page.dashboard.widgets.quick-actions.title')}
		/>
	);
};

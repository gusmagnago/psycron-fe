import { useTranslation } from 'react-i18next';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';
import { StatusChip } from '@psycron/components/dashboard/status-chip/StatusChip';
import { CheckSuccess } from '@psycron/components/icons';

import {
	EmptyTasksHeading,
	EmptyTasksIcon,
	EmptyTasksState,
	EmptyTasksSubText,
	TaskDescription,
	TaskLabel,
	TaskRow,
	TaskSkeleton,
	TasksList,
	TaskText,
} from './PendingTasksWidget.styles';
import type { PendingTasksWidgetProps } from './PendingTasksWidget.types';
import { getPendingTaskTone } from './PendingTasksWidget.utils';

const rowVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.07, duration: 0.25, ease: 'easeOut' },
	}),
};

export const PendingTasksWidget = ({
	colSpan,
	isLoading,
	tasks,
}: PendingTasksWidgetProps) => {
	const isWide = (colSpan ?? 0) >= 6;
	const { t } = useTranslation();

	useBentoTileChrome({
		title: t('page.dashboard.widgets.pending-tasks.title'),
	});

	if (isLoading) {
		return (
			<TasksList isWide={isWide}>
				{[...Array(3)].map((_, i) => (
					<TaskSkeleton
						height={52}
						key={`task-skeleton-${i}`}
						variant='rectangular'
					/>
				))}
			</TasksList>
		);
	}

	return (
		<>
			{tasks.length === 0 ? (
				<EmptyTasksState>
					<EmptyTasksIcon>
						<CheckSuccess />
					</EmptyTasksIcon>
					<EmptyTasksHeading>
						{t('page.dashboard.widgets.pending-tasks.empty-heading')}
					</EmptyTasksHeading>
					<EmptyTasksSubText>
						{t('page.dashboard.widgets.pending-tasks.empty')}
					</EmptyTasksSubText>
				</EmptyTasksState>
			) : (
				<TasksList isWide={isWide}>
					{tasks.map((task, i) => (
						<TaskRow
							animate='visible'
							aria-label={`${task.label}: ${task.count}`}
							custom={i}
							initial='hidden'
							key={task.type}
							onClick={task.onClick}
							type='button'
							variants={rowVariants}
						>
							<TaskText>
								<TaskLabel>{task.label}</TaskLabel>
								{task.description ? (
									<TaskDescription>{task.description}</TaskDescription>
								) : null}
							</TaskText>
							<StatusChip tone={getPendingTaskTone(task.type)}>
								{task.count}
							</StatusChip>
						</TaskRow>
					))}
				</TasksList>
			)}
		</>
	);
};

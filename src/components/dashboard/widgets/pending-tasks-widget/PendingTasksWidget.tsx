import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { CheckSuccess } from '@psycron/components/icons';

import {
	WidgetHeader,
	WidgetTitle,
} from '../schedule-widget/ScheduleWidget.styles';

import {
	EmptyTasksHeading,
	EmptyTasksIcon,
	EmptyTasksState,
	EmptyTasksSubText,
	TaskCount,
	TaskLabel,
	TaskRow,
	TasksList,
} from './PendingTasksWidget.styles';
import type { PendingTasksWidgetProps } from './PendingTasksWidget.types';

const rowVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.07, duration: 0.25, ease: 'easeOut' },
	}),
};

export const PendingTasksWidget = ({
	isLoading,
	tasks,
}: PendingTasksWidgetProps) => {
	const { t } = useTranslation();

	if (isLoading) {
		return (
			<Box display='flex' flexDirection='column' gap={1}>
				{[...Array(3)].map((_, i) => (
					<Skeleton
						height={52}
						key={`task-skeleton-${i}`}
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
				<WidgetTitle>
					{t('page.dashboard.widgets.pending-tasks.title')}
				</WidgetTitle>
			</WidgetHeader>
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
				<TasksList>
					{tasks.map((task, i) => (
						<TaskRow
							animate='visible'
							aria-label={`${task.label}: ${task.count}`}
							custom={i}
							initial='hidden'
							key={task.type}
							onClick={task.onClick}
							taskType={task.type}
							variants={rowVariants}
						>
							<TaskLabel>{task.label}</TaskLabel>
							<TaskCount>{task.count}</TaskCount>
						</TaskRow>
					))}
				</TasksList>
			)}
		</>
	);
};

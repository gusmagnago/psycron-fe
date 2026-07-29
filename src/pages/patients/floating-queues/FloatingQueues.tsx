import { useTranslation } from 'react-i18next';
import {
	QueueFilterChip,
	QueueFiltersDrawer,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
} from '@psycron/components/queue-panel';
import { Funnel } from 'lucide-react';

import {
	FloatingQueuesPanel,
	FloatingQueuesTrigger,
	FloatingQueuesTriggerIcon,
} from '../PatientListPage.styles';
import type {
	PatientWorkQueueCard,
	PatientWorkspaceQueue,
} from '../PatientsPage.types';

interface FloatingQueuesProps {
	activeFilterCount: number;
	activeQueueLabel: string;
	isFloatingQueuesOpen: boolean;
	isWorkQueuesVisible: boolean;
	onClose: () => void;
	onOpen: () => void;
	onSelectQueue: (queueKey: PatientWorkspaceQueue) => void;
	queue: PatientWorkspaceQueue;
	queues: PatientWorkQueueCard[];
}

export const FloatingQueues = ({
	activeFilterCount,
	activeQueueLabel,
	isFloatingQueuesOpen,
	isWorkQueuesVisible,
	onClose,
	onOpen,
	onSelectQueue,
	queue,
	queues,
}: FloatingQueuesProps) => {
	const { t } = useTranslation();

	return (
		<>
			{!isWorkQueuesVisible ? (
				<FloatingQueuesTrigger
					aria-controls='patients-work-queues-floating-panel'
					aria-expanded={isFloatingQueuesOpen}
					aria-haspopup='dialog'
					aria-label={t('patients.list.queues.floating-trigger-aria', {
						count: activeFilterCount,
					})}
					data-testid='patients-work-queues-floating-trigger'
					data-action='open-queue-filters'
					id='patients-work-queues-floating-trigger'
					onClick={onOpen}
					tertiary
					type='button'
				>
					<FloatingQueuesTriggerIcon
						data-testid='patients-work-queues-floating-trigger-icon'
						id='patients-work-queues-floating-trigger-icon'
					>
						<Funnel />
					</FloatingQueuesTriggerIcon>
				</FloatingQueuesTrigger>
			) : null}

			<QueueFiltersDrawer
				activeFilterCount={activeFilterCount}
				ariaLabel={t('patients.list.queues.floating-panel-title')}
				isOpen={isFloatingQueuesOpen}
				onClose={onClose}
				summaryActive={t('patients.list.queues.floating-panel-summary-active', {
					queue: t(activeQueueLabel),
				})}
				summaryDefault={t('patients.list.queues.floating-panel-summary-default')}
				title={t('patients.list.queues.floating-panel-title')}
			>
				<FloatingQueuesPanel
					data-testid='patients-work-queues-floating-panel'
					id='patients-work-queues-floating-panel'
				>
					<QueueFiltersSection
						data-testid='patients-work-queues-floating-current-view'
						id='patients-work-queues-floating-current-view'
					>
						<QueueFiltersLabel
							data-testid='patients-work-queues-floating-current-view-label'
							id='patients-work-queues-floating-current-view-label'
						>
							{t('patients.list.queues.floating-panel-show')}
						</QueueFiltersLabel>
						<QueueFiltersRow>
							<QueueFilterChip
								data-action='show-all-patients'
								data-testid='patients-work-queues-floating-show-all'
								id='patients-work-queues-floating-show-all'
								isActive={queue === 'all'}
								onClick={() => onSelectQueue('all')}
								type='button'
							>
								{t('patients.list.queues.floating-show-all')}
							</QueueFilterChip>
						</QueueFiltersRow>
					</QueueFiltersSection>

					<QueueFiltersSection
						data-testid='patients-work-queues-floating-options'
						id='patients-work-queues-floating-options'
					>
						<QueueFiltersLabel
							data-testid='patients-work-queues-floating-options-label'
							id='patients-work-queues-floating-options-label'
						>
							{t('patients.list.queues.floating-panel-filter')}
						</QueueFiltersLabel>
						<QueueFiltersRow>
							{queues.map((queueItem) => (
								<QueueFilterChip
									aria-label={t(
										queueItem.count === 0
											? 'patients.list.queues.all-clear-aria'
											: 'patients.list.queues.filter-by',
										{ queue: t(queueItem.labelKey) }
									)}
									data-state={queueItem.count === 0 ? 'clear' : 'actionable'}
									data-action={
										queueItem.count === 0 ? 'queue-all-clear' : 'filter-patients'
									}
									data-testid={`patients-work-queues-floating-filter-${queueItem.queue}`}
									disabled={queueItem.count === 0}
									id={`patients-work-queues-floating-filter-${queueItem.queue}`}
									isActive={queue === queueItem.queue}
									key={queueItem.queue}
									onClick={() => onSelectQueue(queueItem.queue)}
									type='button'
								>
									{t(queueItem.labelKey)} · {queueItem.count ?? '—'}
								</QueueFilterChip>
							))}
						</QueueFiltersRow>
					</QueueFiltersSection>
				</FloatingQueuesPanel>
			</QueueFiltersDrawer>
		</>
	);
};

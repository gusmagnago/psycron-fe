import type { Dispatch, RefObject, SetStateAction } from 'react';
import { cloneElement } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSuccess } from '@psycron/components/icons';
import { Minus, Plus } from 'lucide-react';

import {
	QueueCard,
	QueueCollapseContent,
	QueueCollapseRegion,
	QueueCopy,
	QueueCount,
	QueueDescription,
	QueueIcon,
	QueueSection,
	QueueTitle,
	QueueTop,
	QueueVisibilityIcon,
	QueueVisibilityToggle,
	SectionLabel,
	SectionLabelCopy,
	SectionLabelDivider,
	SectionPurpose,
	SectionTitle,
	WorkQueues,
} from '../PatientListPage.styles';
import type {
	PatientWorkQueueCard,
	PatientWorkspaceQueue,
} from '../PatientsPage.types';

interface PatientWorkQueuesProps {
	hasAuthoritativeQueues: boolean;
	isAllClear: boolean;
	isWorkQueuesExpanded: boolean;
	onToggleQueue: (queueKey: PatientWorkQueueCard['queue']) => void;
	queue: PatientWorkspaceQueue;
	queues: PatientWorkQueueCard[];
	sectionRef: RefObject<HTMLElement>;
	setIsWorkQueuesExpanded: Dispatch<SetStateAction<boolean>>;
}

export const PatientWorkQueues = ({
	hasAuthoritativeQueues,
	isAllClear,
	isWorkQueuesExpanded,
	onToggleQueue,
	queue,
	queues,
	sectionRef,
	setIsWorkQueuesExpanded,
}: PatientWorkQueuesProps) => {
	const { t } = useTranslation();

	return (
		<QueueSection
			data-testid='patients-queue-state-label'
			id='patients-queue-state-label'
			ref={sectionRef}
		>
			<SectionLabel
				data-testid='patients-queue-state-header'
				id='patients-queue-state-header'
			>
				<SectionLabelCopy
					data-testid='patients-queue-state-copy'
					id='patients-queue-state-copy'
				>
					<SectionTitle
						data-testid='patients-queue-state-title'
						id='patients-queue-state-title'
					>
						{t('patients.list.queues.label')}
					</SectionTitle>
					<SectionPurpose
						data-testid='patients-queue-state-purpose'
						id='patients-queue-state-purpose'
					>
						{isAllClear
							? t('patients.list.queues.all-clear-purpose')
							: hasAuthoritativeQueues
								? t('patients.list.queues.purpose')
								: t('patients.list.queues.pending-purpose')}
					</SectionPurpose>
				</SectionLabelCopy>
				<SectionLabelDivider
					aria-hidden='true'
					data-testid='patients-queue-state-divider'
					id='patients-queue-state-divider'
				/>
				<QueueVisibilityToggle
					aria-controls='patients-work-queues'
					aria-expanded={isWorkQueuesExpanded}
					aria-label={t(
						isWorkQueuesExpanded
							? 'common.layout.collapse-queue'
							: 'common.layout.expand-queue'
					)}
					data-action={
						isWorkQueuesExpanded ? 'collapse-work-queues' : 'expand-work-queues'
					}
					data-testid='patients-work-queues-toggle'
					id='patients-work-queues-toggle'
					onClick={() => setIsWorkQueuesExpanded((current) => !current)}
					type='button'
				>
					<QueueVisibilityIcon
						data-expanded={isWorkQueuesExpanded}
						data-testid='patients-work-queues-toggle-icon'
						id='patients-work-queues-toggle-icon'
					>
						{isWorkQueuesExpanded ? <Minus /> : <Plus />}
					</QueueVisibilityIcon>
				</QueueVisibilityToggle>
			</SectionLabel>

			<QueueCollapseRegion
				aria-hidden={!isWorkQueuesExpanded}
				data-expanded={isWorkQueuesExpanded}
				data-testid='patients-work-queues-region'
				id='patients-work-queues-region'
				inert={isWorkQueuesExpanded ? undefined : ''}
			>
				<QueueCollapseContent>
					<WorkQueues
						id='patients-work-queues'
						data-testid='patients-work-queues'
						aria-label={t('patients.list.queues.label')}
					>
						{queues.map((queueItem) => {
							const isClear = queueItem.count === 0;
							const isSelected = queue === queueItem.queue;
							const queueIcon = isClear ? <CheckSuccess /> : queueItem.icon;

							return (
								<QueueCard
									aria-label={
										isClear
											? t('patients.list.queues.all-clear-aria', {
													queue: t(queueItem.labelKey),
												})
											: isSelected
												? t('patients.list.queues.clear-filter', {
														queue: t(queueItem.labelKey),
													})
												: t('patients.list.queues.filter-by', {
														queue: t(queueItem.labelKey),
													})
									}
									aria-pressed={isSelected}
									data-action={
										isClear
											? 'queue-all-clear'
											: isSelected
												? 'show-all-patients'
												: 'filter-patients'
									}
									data-queue={queueItem.queue}
									data-state={isClear ? 'clear' : 'actionable'}
									data-testid={queueItem.id}
									disabled={isClear}
									id={queueItem.id}
									key={queueItem.queue}
									onClick={() => onToggleQueue(queueItem.queue)}
									type='button'
								>
									<QueueIcon
										id={`${queueItem.id}-icon`}
										data-testid={`${queueItem.id}-icon`}
									>
										{cloneElement(queueIcon, {
											'data-testid': `${queueItem.id}-icon-svg`,
											id: `${queueItem.id}-icon-svg`,
										})}
									</QueueIcon>
									<QueueCopy
										id={`${queueItem.id}-copy`}
										data-testid={`${queueItem.id}-copy`}
									>
										<QueueTop
											id={`${queueItem.id}-header`}
											data-testid={`${queueItem.id}-header`}
										>
											<QueueTitle
												id={`${queueItem.id}-title`}
												data-testid={`${queueItem.id}-title`}
											>
												{t(queueItem.labelKey)}
											</QueueTitle>
											{queueItem.count !== undefined ? (
												<QueueCount
													id={`${queueItem.id}-count`}
													data-testid={`${queueItem.id}-count`}
												>
													{queueItem.count}
												</QueueCount>
											) : null}
										</QueueTop>
										<QueueDescription
											id={`${queueItem.id}-description`}
											data-testid={`${queueItem.id}-description`}
										>
											{t(
												isClear
													? queueItem.clearDescriptionKey
													: queueItem.descriptionKey
											)}
										</QueueDescription>
									</QueueCopy>
								</QueueCard>
							);
						})}
					</WorkQueues>
				</QueueCollapseContent>
			</QueueCollapseRegion>
		</QueueSection>
	);
};

import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import {
	QueueFilterChip,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
} from '@psycron/components/queue-panel';

import { FiltersContent } from '../CancellationRecoveryPage.styles';
import type {
	CancellationRecoveryDeliveryModeFilter,
	CancellationRecoveryFiltersProps,
	CancellationRecoveryPeriodFilter,
	CancellationRecoveryStatusFilter,
	CancellationRecoveryWhoCancelledFilter,
} from '../CancellationRecoveryPage.types';

type FilterChipOption<T extends string> = {
	label: string;
	value: T;
};

const FilterChipGroup = <T extends string>({
	onChange,
	options,
	value,
}: {
	onChange: (value: T) => void;
	options: FilterChipOption<T>[];
	value: T;
}) => (
	<QueueFiltersRow>
		{options.map((option) => (
			<QueueFilterChip
				isActive={value === option.value}
				key={option.value}
				onClick={() => onChange(option.value)}
				type='button'
			>
				{option.label}
			</QueueFilterChip>
		))}
	</QueueFiltersRow>
);

export const CancellationRecoveryFilters = ({
	controls,
}: CancellationRecoveryFiltersProps) => {
	const { t } = useTranslation();
	const { filters, reasonOptions } = controls;

	return (
		<FiltersContent>
			<QueueFiltersSection>
				<QueueFiltersLabel>
					{t('availability.cancellation-recovery.filters.patient')}
				</QueueFiltersLabel>
				<TextField
					fullWidth
					onChange={(event) => controls.setPatientQuery(event.target.value)}
					placeholder={t(
						'availability.cancellation-recovery.filters.patient-placeholder'
					)}
					size='small'
					value={filters.patientQuery}
				/>
			</QueueFiltersSection>

			<QueueFiltersSection>
				<QueueFiltersLabel>
					{t('availability.cancellation-recovery.filters.period')}
				</QueueFiltersLabel>
				<FilterChipGroup<CancellationRecoveryPeriodFilter>
					onChange={controls.setPeriod}
					options={[
						{
							label: t(
								'availability.cancellation-recovery.filters.period-options.all'
							),
							value: 'all',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.period-options.upcoming'
							),
							value: 'upcoming',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.period-options.past'
							),
							value: 'past',
						},
					]}
					value={filters.period}
				/>
			</QueueFiltersSection>

			<QueueFiltersSection>
				<QueueFiltersLabel>
					{t('availability.cancellation-recovery.filters.status')}
				</QueueFiltersLabel>
				<FilterChipGroup<CancellationRecoveryStatusFilter>
					onChange={controls.setStatus}
					options={[
						{
							label: t(
								'availability.cancellation-recovery.filters.status-options.needs-action'
							),
							value: 'needs_action',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.status-options.resolved'
							),
							value: 'resolved',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.status-options.all'
							),
							value: 'all',
						},
					]}
					value={filters.status}
				/>
			</QueueFiltersSection>

			<QueueFiltersSection>
				<QueueFiltersLabel>
					{t('availability.cancellation-recovery.filters.cancelled-by')}
				</QueueFiltersLabel>
				<FilterChipGroup<CancellationRecoveryWhoCancelledFilter>
					onChange={controls.setCancelledBy}
					options={[
						{
							label: t(
								'availability.cancellation-recovery.filters.cancelled-by-options.all'
							),
							value: 'all',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.cancelled-by-options.patient'
							),
							value: 'patient',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.cancelled-by-options.therapist'
							),
							value: 'therapist',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.cancelled-by-options.unknown'
							),
							value: 'unknown',
						},
					]}
					value={filters.cancelledBy}
				/>
			</QueueFiltersSection>

			<QueueFiltersSection>
				<QueueFiltersLabel>
					{t('availability.cancellation-recovery.filters.reason')}
				</QueueFiltersLabel>
				<QueueFiltersRow>
					<QueueFilterChip
						isActive={filters.reasonCode === 'all'}
						onClick={() => controls.setReasonCode('all')}
						type='button'
					>
						{t('availability.cancellation-recovery.filters.reason-all')}
					</QueueFilterChip>
					{reasonOptions.map((reason) => (
						<QueueFilterChip
							isActive={filters.reasonCode === reason.value}
							key={reason.value}
							onClick={() => controls.setReasonCode(reason.value)}
							type='button'
						>
							{t(reason.labelKey)}
						</QueueFilterChip>
					))}
				</QueueFiltersRow>
			</QueueFiltersSection>

			<QueueFiltersSection>
				<QueueFiltersLabel>
					{t('availability.cancellation-recovery.filters.delivery')}
				</QueueFiltersLabel>
				<FilterChipGroup<CancellationRecoveryDeliveryModeFilter>
					onChange={controls.setDeliveryMode}
					options={[
						{
							label: t(
								'availability.cancellation-recovery.filters.delivery-options.all'
							),
							value: 'all',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.delivery-options.online'
							),
							value: 'online',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.delivery-options.in-person'
							),
							value: 'in-person',
						},
						{
							label: t(
								'availability.cancellation-recovery.filters.delivery-options.unknown'
							),
							value: 'unknown',
						},
					]}
					value={filters.deliveryMode}
				/>
			</QueueFiltersSection>
		</FiltersContent>
	);
};

import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';

import {
	FilterChip,
	FiltersContent,
	FiltersLabel,
	FiltersRow,
	FiltersSection,
} from '../CancellationRecoveryPage.styles';
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
	<FiltersRow>
		{options.map((option) => (
			<FilterChip
				isActive={value === option.value}
				key={option.value}
				onClick={() => onChange(option.value)}
				type='button'
			>
				{option.label}
			</FilterChip>
		))}
	</FiltersRow>
);

export const CancellationRecoveryFilters = ({
	controls,
}: CancellationRecoveryFiltersProps) => {
	const { t } = useTranslation();
	const { filters, reasonOptions } = controls;

	return (
		<FiltersContent>
			<FiltersSection>
				<FiltersLabel>
					{t('availability.cancellation-recovery.filters.patient')}
				</FiltersLabel>
				<TextField
					fullWidth
					onChange={(event) => controls.setPatientQuery(event.target.value)}
					placeholder={t(
						'availability.cancellation-recovery.filters.patient-placeholder'
					)}
					size='small'
					value={filters.patientQuery}
				/>
			</FiltersSection>

			<FiltersSection>
				<FiltersLabel>
					{t('availability.cancellation-recovery.filters.period')}
				</FiltersLabel>
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
			</FiltersSection>

			<FiltersSection>
				<FiltersLabel>
					{t('availability.cancellation-recovery.filters.status')}
				</FiltersLabel>
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
			</FiltersSection>

			<FiltersSection>
				<FiltersLabel>
					{t('availability.cancellation-recovery.filters.cancelled-by')}
				</FiltersLabel>
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
			</FiltersSection>

			<FiltersSection>
				<FiltersLabel>
					{t('availability.cancellation-recovery.filters.reason')}
				</FiltersLabel>
				<FiltersRow>
					<FilterChip
						isActive={filters.reasonCode === 'all'}
						onClick={() => controls.setReasonCode('all')}
						type='button'
					>
						{t('availability.cancellation-recovery.filters.reason-all')}
					</FilterChip>
					{reasonOptions.map((reason) => (
						<FilterChip
							isActive={filters.reasonCode === reason.value}
							key={reason.value}
							onClick={() => controls.setReasonCode(reason.value)}
							type='button'
						>
							{t(reason.labelKey)}
						</FilterChip>
					))}
				</FiltersRow>
			</FiltersSection>

			<FiltersSection>
				<FiltersLabel>
					{t('availability.cancellation-recovery.filters.delivery')}
				</FiltersLabel>
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
			</FiltersSection>
		</FiltersContent>
	);
};

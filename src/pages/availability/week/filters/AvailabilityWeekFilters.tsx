import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, Switch } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import type { DeliveryMode, TimeOfDay } from '@psycron/hooks/useCalendarPrefs';

import {
	FiltersChip,
	FiltersChipGroup,
	FiltersDivider,
	FiltersPanelContent,
	FiltersPanelHeader,
	FiltersPanelTitle,
	FiltersSection,
	FiltersSectionLabel,
	FiltersSwitchLabel,
	FiltersSwitchRow,
} from './AvailabilityWeekFilters.styles';
import type {
	IAvailabilityWeekFiltersProps,
	IFilterSection,
} from './AvailabilityWeekFilters.types';

export const AvailabilityWeekFilters = ({
	activeFilterCount,
	allSessionTypes,
	anchorEl,
	onClearFilters,
	onClose,
	onToggleDeliveryMode,
	onToggleSessionType,
	onToggleShowCancelledSlots,
	onToggleShowFreeSlots,
	onToggleTimeOfDay,
	prefs,
}: IAvailabilityWeekFiltersProps) => {
	const { t } = useTranslation();
	const open = Boolean(anchorEl);

	const sections: IFilterSection[] = [
		{
			key: 'status',
			labelKey: 'availability.week.filter-section-status',
			rows: [
				{
					checked: prefs.showFreeSlots,
					labelKey: 'availability.week.filter-label-free',
					onChange: onToggleShowFreeSlots,
				},
				{
					checked: prefs.showCancelledSlots,
					labelKey: 'availability.week.filter-label-cancelled',
					onChange: onToggleShowCancelledSlots,
				},
			],
			type: 'switches',
		},
		...(allSessionTypes.length > 0
			? [
					{
						getOptionLabel: (v: string) => v,
						isActive: (v: string) => prefs.sessionTypes.includes(v),
						key: 'session-type',
						labelKey: 'availability.week.filter-section-session-type',
						onToggle: onToggleSessionType,
						options: allSessionTypes,
						type: 'chips' as const,
					},
				]
			: []),
		{
			getOptionLabel: (v) => t(`availability.week.filter-delivery-${v}`),
			isActive: (v) => prefs.deliveryModes.includes(v as DeliveryMode),
			key: 'delivery',
			labelKey: 'availability.week.filter-section-delivery',
			onToggle: (v) => onToggleDeliveryMode(v as DeliveryMode),
			options: ['online', 'in-person'],
			type: 'chips',
		},
		{
			getOptionLabel: (v) => t(`availability.week.filter-time-${v}`),
			isActive: (v) => prefs.timeOfDay.includes(v as TimeOfDay),
			key: 'time',
			labelKey: 'availability.week.filter-section-time',
			onToggle: (v) => onToggleTimeOfDay(v as TimeOfDay),
			options: ['morning', 'afternoon', 'evening'],
			type: 'chips',
		},
	];

	return (
		<Popover
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			id='availability-week-filters'
			data-testid='availability-week-filters'
		>
			<FiltersPanelContent
				id='availability-week-filters-content'
				data-testid='availability-week-filters-content'
			>
				<FiltersPanelHeader
					id='availability-week-filters-header'
					data-testid='availability-week-filters-header'
				>
					<FiltersPanelTitle>
						{t('availability.week.filters')}
					</FiltersPanelTitle>
					{activeFilterCount > 0 && (
						<Button
							onClick={onClearFilters}
							secondary
							small
							id='availability-week-clear-filters-button'
							data-testid='availability-week-clear-filters-button'
						>
							{t('availability.week.filter-clear')}
						</Button>
					)}
				</FiltersPanelHeader>

				{sections.map((section) => (
					<Fragment key={section.key}>
						<FiltersDivider />
						<FiltersSection
							id={`${section.key}-filter-section`}
							data-testid={`${section.key}-filter-section`}
						>
							<FiltersSectionLabel>{t(section.labelKey)}</FiltersSectionLabel>
							{section.type === 'switches' ? (
								section.rows.map((row) => (
									<FiltersSwitchRow
										key={row.labelKey}
										id={`${section.key}-switch-${row.labelKey}`}
										data-testid={`${section.key}-switch-${row.labelKey}`}
									>
										<FiltersSwitchLabel
											id={`${section.key}-switch-label-${row.labelKey}`}
											data-testid={`${section.key}-switch-label-${row.labelKey}`}
										>
											{t(row.labelKey)}
										</FiltersSwitchLabel>
										<Switch
											checked={row.checked}
											onChange={row.onChange}
											size='small'
										/>
									</FiltersSwitchRow>
								))
							) : (
								<FiltersChipGroup
									id={`${section.key}-chip-group`}
									data-testid={`${section.key}-chip-group`}
								>
									{section.options.map((opt) => (
										<FiltersChip
											key={opt}
											isActive={section.isActive(opt)}
											onClick={() => section.onToggle(opt)}
											small
											tertiary
											id={`${section.key}-chip-${opt}`}
											data-testid={`${section.key}-chip-${opt}`}
										>
											{section.getOptionLabel(opt)}
										</FiltersChip>
									))}
								</FiltersChipGroup>
							)}
						</FiltersSection>
					</Fragment>
				))}
			</FiltersPanelContent>
		</Popover>
	);
};

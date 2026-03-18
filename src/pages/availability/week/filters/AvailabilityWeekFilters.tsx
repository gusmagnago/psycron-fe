import { useTranslation } from 'react-i18next';
import { Switch } from '@mui/material';

import {
	FiltersChip,
	FiltersChipGroup,
	FiltersDivider,
	FiltersPanelClearButton,
	FiltersPanelContent,
	FiltersPanelHeader,
	FiltersPanelTitle,
	FiltersPopover,
	FiltersSection,
	FiltersSectionLabel,
	FiltersSwitchLabel,
	FiltersSwitchRow,
} from './AvailabilityWeekFilters.styles';
import type { IAvailabilityWeekFiltersProps } from './AvailabilityWeekFilters.types';

export const AvailabilityWeekFilters = ({
	activeFilterCount,
	allSessionTypes,
	anchorEl,
	onClearFilters,
	onClose,
	onToggleBookingSource,
	onToggleDeliveryMode,
	onToggleSessionType,
	onToggleShowCancelledSlots,
	onToggleShowFreeSlots,
	onToggleTimeOfDay,
	prefs,
}: IAvailabilityWeekFiltersProps) => {
	const { t } = useTranslation();
	const open = Boolean(anchorEl);

	return (
		<FiltersPopover
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		>
			<FiltersPanelContent>
				<FiltersPanelHeader>
					<FiltersPanelTitle>
						{t('availability.week.filters')}
					</FiltersPanelTitle>
					{activeFilterCount > 0 && (
						<FiltersPanelClearButton onClick={onClearFilters} tertiary small>
							{t('availability.week.filter-clear')}
						</FiltersPanelClearButton>
					)}
				</FiltersPanelHeader>

				<FiltersDivider />

				{/* Status */}
				<FiltersSection>
					<FiltersSectionLabel>
						{t('availability.week.filter-section-status')}
					</FiltersSectionLabel>
					<FiltersSwitchRow>
						<FiltersSwitchLabel>
							{t('availability.week.filter-label-free')}
						</FiltersSwitchLabel>
						<Switch
							checked={prefs.showFreeSlots}
							onChange={onToggleShowFreeSlots}
							size='small'
						/>
					</FiltersSwitchRow>
					<FiltersSwitchRow>
						<FiltersSwitchLabel>
							{t('availability.week.filter-label-cancelled')}
						</FiltersSwitchLabel>
						<Switch
							checked={prefs.showCancelledSlots}
							onChange={onToggleShowCancelledSlots}
							size='small'
						/>
					</FiltersSwitchRow>
				</FiltersSection>

				<FiltersDivider />

				{/* Source */}
				<FiltersSection>
					<FiltersSectionLabel>
						{t('availability.week.filter-section-source')}
					</FiltersSectionLabel>
					<FiltersChipGroup>
						{(['jupiter', 'google'] as const).map((source) => (
							<FiltersChip
								key={source}
								isActive={prefs.bookingSources.includes(source)}
								onClick={() => onToggleBookingSource(source)}
								small
							>
								{t(`availability.week.filter-source-${source}`)}
							</FiltersChip>
						))}
					</FiltersChipGroup>
				</FiltersSection>

				<FiltersDivider />

				{/* Session type */}
				{allSessionTypes.length > 0 && (
					<>
						<FiltersSection>
							<FiltersSectionLabel>
								{t('availability.week.filter-section-session-type')}
							</FiltersSectionLabel>
							<FiltersChipGroup>
								{allSessionTypes.map((type) => (
									<FiltersChip
										key={type}
										isActive={prefs.sessionTypes.includes(type)}
										onClick={() => onToggleSessionType(type)}
										small
									>
										{type}
									</FiltersChip>
								))}
							</FiltersChipGroup>
						</FiltersSection>

						<FiltersDivider />
					</>
				)}

				{/* Delivery */}
				<FiltersSection>
					<FiltersSectionLabel>
						{t('availability.week.filter-section-delivery')}
					</FiltersSectionLabel>
					<FiltersChipGroup>
						{(['online', 'in-person'] as const).map((mode) => (
							<FiltersChip
								key={mode}
								isActive={prefs.deliveryModes.includes(mode)}
								onClick={() => onToggleDeliveryMode(mode)}
								small
							>
								{t(`availability.week.filter-delivery-${mode}`)}
							</FiltersChip>
						))}
					</FiltersChipGroup>
				</FiltersSection>

				<FiltersDivider />

				{/* Time of day */}
				<FiltersSection>
					<FiltersSectionLabel>
						{t('availability.week.filter-section-time')}
					</FiltersSectionLabel>
					<FiltersChipGroup>
						{(['morning', 'afternoon', 'evening'] as const).map((band) => (
							<FiltersChip
								key={band}
								isActive={prefs.timeOfDay.includes(band)}
								onClick={() => onToggleTimeOfDay(band)}
								small
							>
								{t(`availability.week.filter-time-${band}`)}
							</FiltersChip>
						))}
					</FiltersChipGroup>
				</FiltersSection>
			</FiltersPanelContent>
		</FiltersPopover>
	);
};

import { useTranslation } from 'react-i18next';
import { Account, Address, Edit } from '@psycron/components/icons';

import { SlotAddressFields } from '../slot-address-fields/SlotAddressFields';

import {
	CustomAddressWrapper,
	LocationChoiceCard,
	LocationChoiceCardLabel,
	LocationChoiceGrid,
	LocationChoiceSubtitle,
	LocationSection,
	LocationSectionLabel,
} from './SlotLocationSection.styles';
import type {
	ILocationOption,
	ISlotLocationSectionProps,
} from './SlotLocationSection.types';

const LOCATION_OPTIONS: ILocationOption[] = [
	{
		choice: 'clinic',
		icon: <Address />,
		labelKey: 'availability.week.drawer.location-choice-clinic',
		subtitleKey: 'availability.week.drawer.location-subtitle-clinic',
	},
	{
		choice: 'custom',
		icon: <Edit />,
		labelKey: 'availability.week.drawer.location-choice-custom',
		subtitleKey: 'availability.week.drawer.location-subtitle-custom',
	},
	{
		choice: 'patient',
		icon: <Account />,
		labelKey: 'availability.week.drawer.location-choice-patient',
		subtitleKey: 'availability.week.drawer.location-subtitle-patient',
	},
];

export const SlotLocationSection = ({
	customAddress,
	locationChoice,
	onCustomAddressChange,
	onLocationChoiceChange,
}: ISlotLocationSectionProps) => {
	const { t } = useTranslation();

	return (
		<LocationSection>
			<LocationSectionLabel>
				{t('availability.week.drawer.location-choice-label')}
			</LocationSectionLabel>

			<LocationChoiceGrid>
				{LOCATION_OPTIONS.map(({ choice, icon, labelKey }) => {
					const isSelected = locationChoice === choice;
					return (
						<LocationChoiceCard
							key={choice}
							onClick={() => onLocationChoiceChange(choice)}
							tertiary
							variant={isSelected ? 'contained' : 'outlined'}
						>
							{icon}
							<LocationChoiceCardLabel>{t(labelKey)}</LocationChoiceCardLabel>
						</LocationChoiceCard>
					);
				})}
			</LocationChoiceGrid>

			<LocationChoiceGrid>
				{LOCATION_OPTIONS.map(({ choice, subtitleKey }) => {
					const isSelected = locationChoice === choice;
					return (
						<LocationChoiceSubtitle key={`${choice}-subtitle`}>
							{isSelected && t(subtitleKey)}
						</LocationChoiceSubtitle>
					);
				})}
			</LocationChoiceGrid>

			{locationChoice === 'custom' && (
				<CustomAddressWrapper>
					<SlotAddressFields
						address={customAddress}
						isAddressDirty={false}
						onChange={onCustomAddressChange}
					/>
				</CustomAddressWrapper>
			)}
		</LocationSection>
	);
};

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { ICreatePatientForm, SessionDelivery } from '@psycron/api/patient/index.types';
import { Globe, MapPin } from '@psycron/components/icons';

import {
	LocationChoiceCard,
	LocationChoiceCardLabel,
	LocationChoiceGrid,
	LocationChoiceSubtitle,
	LocationSection,
	LocationSectionLabel,
} from '../slot-location-section/SlotLocationSection.styles';

interface IDeliveryOption {
	delivery: SessionDelivery;
	icon: JSX.Element;
	labelKey: string;
	subtitleKey: string;
}

const DELIVERY_OPTIONS: IDeliveryOption[] = [
	{
		delivery: 'online',
		icon: <Globe />,
		labelKey: 'availability.week.drawer.session-delivery-online',
		subtitleKey: 'availability.week.drawer.session-delivery-online-subtitle',
	},
	{
		delivery: 'in_person',
		icon: <MapPin />,
		labelKey: 'availability.week.drawer.session-delivery-in-person',
		subtitleKey:
			'availability.week.drawer.session-delivery-in-person-subtitle',
	},
];

export const SlotSessionDeliverySection = () => {
	const { t } = useTranslation();
	const { watch, setValue } = useFormContext<ICreatePatientForm>();
	const selected = watch('sessionDelivery');

	return (
		<LocationSection>
			<LocationSectionLabel>
				{t('availability.week.drawer.session-delivery-label')}
			</LocationSectionLabel>

			<LocationChoiceGrid>
				{DELIVERY_OPTIONS.map(({ delivery, icon, labelKey }) => (
					<LocationChoiceCard
						key={delivery}
						onClick={() =>
							setValue('sessionDelivery', delivery, { shouldDirty: true })
						}
						tertiary
						variant={selected === delivery ? 'contained' : 'outlined'}
					>
						{icon}
						<LocationChoiceCardLabel>{t(labelKey)}</LocationChoiceCardLabel>
					</LocationChoiceCard>
				))}
			</LocationChoiceGrid>

			<LocationChoiceGrid>
				{DELIVERY_OPTIONS.map(({ delivery, subtitleKey }) => (
					<LocationChoiceSubtitle key={`${delivery}-subtitle`}>
						{selected === delivery && t(subtitleKey)}
					</LocationChoiceSubtitle>
				))}
			</LocationChoiceGrid>
		</LocationSection>
	);
};

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type ICreatePatientForm,RecurrencePattern } from '@psycron/api/patient/index.types';

import {
	LocationChoiceCard,
	LocationChoiceCardLabel,
	LocationChoiceGrid,
	LocationSection,
	LocationSectionLabel,
} from '../slot-location-section/SlotLocationSection.styles';

interface IRecurrenceOption {
	labelKey: string;
	pattern: RecurrencePattern;
}

const RECURRENCE_OPTIONS: IRecurrenceOption[] = [
	{
		labelKey: 'availability.week.drawer.recurrence-single',
		pattern: RecurrencePattern.SINGLE,
	},
	{
		labelKey: 'availability.week.drawer.recurrence-end-month',
		pattern: RecurrencePattern.UNTIL_END_OF_MONTH,
	},
	{
		labelKey: 'availability.week.drawer.recurrence-end-year',
		pattern: RecurrencePattern.UNTIL_END_OF_YEAR,
	},
	{
		labelKey: 'availability.week.drawer.recurrence-all',
		pattern: RecurrencePattern.ALL_APPOINTMENTS,
	},
];

export const SlotRecurrenceSection = () => {
	const { t } = useTranslation();
	const { watch, setValue } = useFormContext<ICreatePatientForm>();
	const selected = watch('recurrencePattern');

	return (
		<LocationSection>
			<LocationSectionLabel>
				{t('availability.week.drawer.recurrence-label')}
			</LocationSectionLabel>

			<LocationChoiceGrid style={{ flexWrap: 'wrap' }}>
				{RECURRENCE_OPTIONS.map(({ pattern, labelKey }) => (
					<LocationChoiceCard
						key={pattern}
						onClick={() =>
							setValue('recurrencePattern', pattern, { shouldDirty: true })
						}
						tertiary
						variant={selected === pattern ? 'contained' : 'outlined'}
					>
						<LocationChoiceCardLabel>{t(labelKey)}</LocationChoiceCardLabel>
					</LocationChoiceCard>
				))}
			</LocationChoiceGrid>
		</LocationSection>
	);
};

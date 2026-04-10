import { useTranslation } from 'react-i18next';
import { Watch } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import { BookedSection } from '../slot-booked-body/booked-section/SlotBookedSection';
import {
	DetailLabel,
	DetailRow,
	DetailRowLeft,
	DetailValue,
} from '../slot-booked-body/SlotBookedBody.styles';

import type { ISlotSessionSectionProps } from './SlotSessionSection.types';

export const SlotSessionSection = ({
	date,
	duration,
	patientTime,
	patientTimeZoneName,
	therapistTime,
	therapistTimeZoneName,
}: ISlotSessionSectionProps) => {
	const { t } = useTranslation();
	const therapistTimeLabel = therapistTimeZoneName
		? `${t('availability.week.drawer.your-time')} (${therapistTimeZoneName})`
		: t('availability.week.drawer.your-time');
	const patientTimeLabel = patientTimeZoneName
		? `${t('availability.week.drawer.patient-time')} (${patientTimeZoneName})`
		: t('availability.week.drawer.patient-time');

	return (
		<BookedSection
			icon={<Watch color={palette.gray['05']} />}
			title={t('availability.week.drawer.booked-section-session')}
		>
			<DetailRow>
				<DetailRowLeft>
					<DetailLabel>{t('availability.week.drawer.booked-date')}</DetailLabel>
					<DetailValue>{date}</DetailValue>
				</DetailRowLeft>
			</DetailRow>
			<DetailRow>
				<DetailRowLeft>
					<DetailLabel>{therapistTimeLabel}</DetailLabel>
					<DetailValue>{therapistTime}</DetailValue>
				</DetailRowLeft>
			</DetailRow>
			{patientTime && (
				<DetailRow>
					<DetailRowLeft>
						<DetailLabel>{patientTimeLabel}</DetailLabel>
						<DetailValue>{patientTime}</DetailValue>
					</DetailRowLeft>
				</DetailRow>
			)}
			<DetailRow>
				<DetailRowLeft>
					<DetailLabel>
						{t('availability.week.drawer.booked-duration')}
					</DetailLabel>
					<DetailValue>{duration}</DetailValue>
				</DetailRowLeft>
			</DetailRow>
		</BookedSection>
	);
};

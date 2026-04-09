import { useTranslation } from 'react-i18next';
import { Watch } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import { BookedSection } from '../slot-booked-body/booked-section/SlotBookedSection';
import {
	DetailLabel,
	DetailRow,
	DetailRowLeft,
	DetailSub,
	DetailValue,
} from '../slot-booked-body/SlotBookedBody.styles';

import type { ISlotSessionSectionProps } from './SlotSessionSection.types';

export const SlotSessionSection = ({
	date,
	duration,
	time,
	timeSub,
}: ISlotSessionSectionProps) => {
	const { t } = useTranslation();

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
					<DetailLabel>{t('availability.week.drawer.booked-time')}</DetailLabel>
					<DetailValue>{time}</DetailValue>
					{timeSub && <DetailSub>{timeSub}</DetailSub>}
				</DetailRowLeft>
			</DetailRow>
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

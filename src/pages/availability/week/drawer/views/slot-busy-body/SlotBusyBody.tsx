import { useTranslation } from 'react-i18next';
import { Calendar } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import { SlotSessionSection } from '../slot-session-section/SlotSessionSection';

import {
	BusyCommitmentValue,
	BusyInfoTag,
	BusyNoteLabel,
	BusyNoteSection,
	BusyNoteText,
} from './SlotBusyBody.styles';
import type { ISlotBusyBodyProps } from './SlotBusyBody.types';

export const SlotBusyBody = ({
	commitmentTitle,
	sessionDetails,
}: ISlotBusyBodyProps) => {
	const { t } = useTranslation();

	return (
		<>
			<SlotSessionSection {...sessionDetails} />
			<BusyNoteSection>
				<BusyNoteLabel>
					{t('availability.week.drawer.busy-note-label')}
				</BusyNoteLabel>
				{commitmentTitle ? (
					<BusyCommitmentValue>{commitmentTitle}</BusyCommitmentValue>
				) : (
					<BusyNoteText>
						{t('availability.week.drawer.busy-note')}
					</BusyNoteText>
				)}
				<BusyInfoTag>
					<Calendar color={palette.gray['08']} />
					{t('availability.week.drawer.busy-subtitle')}
				</BusyInfoTag>
			</BusyNoteSection>
		</>
	);
};

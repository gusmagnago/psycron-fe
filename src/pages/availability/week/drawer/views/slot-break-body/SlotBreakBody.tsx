import { useTranslation } from 'react-i18next';

import { SlotSessionSection } from '../slot-session-section/SlotSessionSection';

import {
	BreakInfoTag,
	BreakNoteLabel,
	BreakNoteSection,
	BreakNoteText,
} from './SlotBreakBody.styles';
import type { ISlotBreakBodyProps } from './SlotBreakBody.types';

export const SlotBreakBody = ({ sessionDetails }: ISlotBreakBodyProps) => {
	const { t } = useTranslation();

	return (
		<>
			<SlotSessionSection {...sessionDetails} />
			<BreakNoteSection>
				<BreakNoteLabel>
					{t('availability.week.drawer.break-note-label')}
				</BreakNoteLabel>
				<BreakNoteText>
					{t('availability.week.drawer.break-note')}
				</BreakNoteText>
				<BreakInfoTag>
					{t('availability.week.drawer.break-subtitle')}
				</BreakInfoTag>
			</BreakNoteSection>
		</>
	);
};

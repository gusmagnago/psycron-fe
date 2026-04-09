import { useTranslation } from 'react-i18next';
import i18n from '@psycron/i18n';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import { SlotSessionSection } from '../slot-session-section/SlotSessionSection';

import {
	BlockedAtText,
	BlockedReasonLabel,
	BlockedReasonSection,
	BlockedReasonValue,
} from './SlotBlockedBody.styles';
import type { ISlotBlockedBodyProps } from './SlotBlockedBody.types';

export const SlotBlockedBody = ({
	blockedAt,
	blockReason,
	sessionDetails,
}: ISlotBlockedBodyProps) => {
	const { t } = useTranslation();
	const dateLocale = i18n.language.startsWith('pt') ? ptBR : enGB;

	return (
		<>
			<SlotSessionSection {...sessionDetails} />

			{blockReason && (
				<BlockedReasonSection>
					<BlockedReasonLabel>
						{t('availability.week.drawer.block-reason-label')}
					</BlockedReasonLabel>
					<BlockedReasonValue>{blockReason}</BlockedReasonValue>
				</BlockedReasonSection>
			)}

			{blockedAt && (
				<BlockedAtText>
					{t('availability.week.drawer.blocked-at', {
						date: format(parseISO(blockedAt), 'PPP p', {
							locale: dateLocale,
						}),
					})}
				</BlockedAtText>
			)}
		</>
	);
};

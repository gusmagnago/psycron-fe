import { useTranslation } from 'react-i18next';
import { Ban } from '@psycron/components/icons';
import i18n from '@psycron/i18n';
import { palette } from '@psycron/theme/palette/palette.theme';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import { SlotDetailView } from '../slot-detail-view/SlotDetailView';

import {
	BlockedAtText,
	BlockedIconWrapper,
	BlockedReasonLabel,
	BlockedReasonSection,
	BlockedReasonValue,
} from './SlotBlockedBody.styles';
import type { ISlotBlockedBodyProps } from './SlotBlockedBody.types';

export const SlotBlockedBody = ({
	blockedAt,
	blockReason,
	details,
}: ISlotBlockedBodyProps) => {
	const { t } = useTranslation();
	const dateLocale = i18n.language.startsWith('pt') ? ptBR : enGB;

	return (
		<>
			<BlockedIconWrapper>
				<Ban color={palette.error.main} size={40} />
			</BlockedIconWrapper>

			<SlotDetailView details={details} />

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

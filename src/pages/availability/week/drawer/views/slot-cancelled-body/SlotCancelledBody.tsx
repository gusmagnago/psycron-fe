import { useTranslation } from 'react-i18next';
import { CancellationReasonEnum } from '@psycron/api/user/availability/index.types';
import i18n from '@psycron/i18n';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import { SlotSessionSection } from '../slot-session-section/SlotSessionSection';

import {
	CancelledAtText,
	CancelledReasonLabel,
	CancelledReasonSection,
	CancelledReasonValue,
} from './SlotCancelledBody.styles';
import type { ISlotCancelledBodyProps } from './SlotCancelledBody.types';

export const SlotCancelledBody = ({
	canceledAt,
	customReason,
	reasonCode,
	sessionDetails,
}: ISlotCancelledBodyProps) => {
	const { t } = useTranslation();
	const dateLocale = i18n.language.startsWith('pt') ? ptBR : enGB;

	return (
		<>
			<SlotSessionSection {...sessionDetails} />

			{reasonCode != null && (
				<CancelledReasonSection>
					<CancelledReasonLabel>
						{t('availability.week.drawer.cancelled-reason-label')}
					</CancelledReasonLabel>
					<CancelledReasonValue>
						{t(`globals.cancellation-reason.${reasonCode}`)}
					</CancelledReasonValue>
					{reasonCode === CancellationReasonEnum.OTHER && customReason && (
						<CancelledReasonValue>{customReason}</CancelledReasonValue>
					)}
				</CancelledReasonSection>
			)}

			{canceledAt && (
				<CancelledAtText>
					{t('availability.week.drawer.cancelled-at', {
						date: format(parseISO(canceledAt), 'PPP p', {
							locale: dateLocale,
						}),
					})}
				</CancelledAtText>
			)}
		</>
	);
};

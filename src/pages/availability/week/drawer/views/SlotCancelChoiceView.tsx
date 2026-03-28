import { useTranslation } from 'react-i18next';

import {
	CancelChoiceCard,
	CancelChoiceCardSub,
	CancelChoiceCardTitle,
	CancelChoiceWrapper,
} from '../AvailabilityWeekDrawer.styles';

interface ISlotCancelChoiceViewProps {
	onCancel: () => void;
	onReschedule: () => void;
}

export const SlotCancelChoiceView = ({
	onCancel,
	onReschedule,
}: ISlotCancelChoiceViewProps) => {
	const { t } = useTranslation();

	return (
		<CancelChoiceWrapper>
			<CancelChoiceCard onClick={onReschedule}>
				<CancelChoiceCardTitle>
					{t('availability.week.drawer.reschedule')}
				</CancelChoiceCardTitle>
				<CancelChoiceCardSub>
					{t('availability.week.drawer.reschedule-choice-sub')}
				</CancelChoiceCardSub>
			</CancelChoiceCard>
			<CancelChoiceCard isDanger onClick={onCancel}>
				<CancelChoiceCardTitle>
					{t('availability.week.drawer.cancel-appointment')}
				</CancelChoiceCardTitle>
				<CancelChoiceCardSub>
					{t('availability.week.drawer.cancel-choice-sub')}
				</CancelChoiceCardSub>
			</CancelChoiceCard>
		</CancelChoiceWrapper>
	);
};

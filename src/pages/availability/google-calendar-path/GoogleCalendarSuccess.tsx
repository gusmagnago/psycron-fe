import { useTranslation } from 'react-i18next';
import type { IChipOption } from '@psycron/components/chat/chips/ChatChips.types';
import { SingleSelectChips } from '@psycron/components/chat/chips/SingleSelectChips';

interface GoogleCalendarSuccessProps {
	isImporting?: boolean;
	onSelect: (key: string) => void;
}

// Dock control only: the success bubbles ("Your Google Calendar is connected!",
// "Want me to use your existing schedule…") are emitted into the conversation
// stream by the flow — this renders just the use-existing / scratch choice chips.
export const GoogleCalendarSuccess = ({
	isImporting = false,
	onSelect,
}: GoogleCalendarSuccessProps) => {
	const { t } = useTranslation();

	const postConnectOptions: IChipOption[] = [
		{
			key: 'chip-use-existing',
			label: t('jupiter.google-calendar.chip-use-existing'),
			variant: 'primary',
		},
		{
			key: 'chip-define-hours',
			label: t('jupiter.google-calendar.chip-define-hours'),
			variant: 'secondary',
		},
	];

	if (isImporting) return null;

	return (
		<SingleSelectChips
			options={postConnectOptions}
			testIdPrefix='jupiter-onboarding-google-success'
			onSelect={onSelect}
		/>
	);
};

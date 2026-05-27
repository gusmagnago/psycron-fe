import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CalendarItem } from '@psycron/api/auth';
import { Button } from '@psycron/components/button/Button';
import { ChevronLeft } from '@psycron/components/icons';

import {
	BackBtn,
	CalendarDot,
	CalendarList,
	CalendarName,
	CalendarOption,
	ConfirmBtn,
	PickerCard,
	PickerHeader,
	PickerTitle,
	PrimaryBadge,
} from './GoogleCalendarPicker.styles';

interface GoogleCalendarPickerProps {
	calendars: CalendarItem[];
	onBack?: () => void;
	onSelect: (calendarId: string) => void;
}

export const GoogleCalendarPicker = ({
	calendars,
	onSelect,
	onBack,
}: GoogleCalendarPickerProps) => {
	const { t } = useTranslation();

	const primaryCalendar = calendars.find((c) => c.primary);
	const [selectedId, setSelectedId] = useState<string>(
		primaryCalendar?.id ?? calendars[0]?.id ?? 'primary'
	);

	const handleConfirm = () => {
		onSelect(selectedId);
	};

	return (
		<PickerCard>
			<PickerHeader>
				{onBack && (
					<BackBtn
						onClick={onBack}
						type='button'
						aria-label={t('jupiter.calendar-picker.back')}
					>
						<ChevronLeft />
					</BackBtn>
				)}
				<PickerTitle>{t('jupiter.calendar-picker.title')}</PickerTitle>
			</PickerHeader>

			<CalendarList>
				{calendars.map((cal) => (
					<CalendarOption
						key={cal.id}
						isSelected={selectedId === cal.id}
						onClick={() => setSelectedId(cal.id)}
					>
						<CalendarDot color={cal.backgroundColor} />
						<CalendarName>{cal.summary}</CalendarName>
						{cal.primary && (
							<PrimaryBadge>{t('jupiter.calendar-picker.primary')}</PrimaryBadge>
						)}
					</CalendarOption>
				))}
			</CalendarList>

			<ConfirmBtn>
				<Button variant='contained' onClick={handleConfirm}>
					{t('jupiter.calendar-picker.confirm')}
				</Button>
			</ConfirmBtn>
		</PickerCard>
	);
};

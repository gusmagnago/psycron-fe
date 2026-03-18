import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { CloseButton } from '@psycron/components/button/close/CloseButton';
import { Drawer } from '@psycron/components/drawer/Drawer';
import {
	Account,
	Appointment,
	Calendar,
	Google,
	Jupiter,
	MapPin,
	Watch,
} from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';
import { format, parseISO } from 'date-fns';

import {
	ConfirmedBadge,
	ConfirmedBadgeText,
	DrawerActions,
	DrawerBadgeRow,
	DrawerDetailIcon,
	DrawerDetailLabel,
	DrawerDetailRow,
	DrawerDetailsList,
	DrawerDetailSub,
	DrawerDetailValue,
	DrawerHeader,
	DrawerPatientName,
	SourceBadge,
	SourceBadgeText,
} from './AvailabilityWeekDrawer.styles';
import type { IAvailabilityWeekDrawerProps } from './AvailabilityWeekDrawer.types';

export const AvailabilityWeekDrawer = ({
	slot,
	onClose,
}: IAvailabilityWeekDrawerProps) => {
	const { t } = useTranslation();
	const isGoogle = slot.status === 'booked-google';

	const endHour = Number(slot.startTime.split(':')[0]) + slot.duration / 60;
	const endTime = `${String(endHour).padStart(2, '0')}:${slot.startTime.split(':')[1]}`;

	return (
		<Drawer ariaLabel={slot.patientName ?? ''} onClose={onClose}>
			<DrawerHeader>
				<div>
					<DrawerPatientName>{slot.patientName}</DrawerPatientName>
					<DrawerBadgeRow>
						<ConfirmedBadge>
							<ConfirmedBadgeText>
								{t('availability.week.drawer.confirmed')}
							</ConfirmedBadgeText>
						</ConfirmedBadge>
						<SourceBadge isGoogle={isGoogle}>
							{isGoogle ? (
								<Google color={palette.white} />
							) : (
								<Jupiter color={palette.brand.purple} />
							)}
							<SourceBadgeText isGoogle={isGoogle}>
								{isGoogle ? 'Google' : 'Júpiter'}
							</SourceBadgeText>
						</SourceBadge>
					</DrawerBadgeRow>
				</div>
				<CloseButton onClick={onClose} />
			</DrawerHeader>

			<DrawerDetailsList>
				<DrawerDetailRow>
					<DrawerDetailIcon>
						<Calendar color={palette.brand.purple} />
					</DrawerDetailIcon>
					<div>
						<DrawerDetailLabel>
							{t('availability.week.drawer.date')}
						</DrawerDetailLabel>
						<DrawerDetailValue>
							{format(parseISO(slot.date), 'EEEE, MMMM d, yyyy')}
						</DrawerDetailValue>
					</div>
				</DrawerDetailRow>

				<DrawerDetailRow>
					<DrawerDetailIcon>
						<Watch color={palette.brand.purple} />
					</DrawerDetailIcon>
					<div>
						<DrawerDetailLabel>
							{t('availability.week.drawer.your-time')}
						</DrawerDetailLabel>
						<DrawerDetailValue>
							{slot.startTime} – {endTime} (GMT-3)
						</DrawerDetailValue>
						<DrawerDetailSub>
							{slot.duration} {t('availability.week.drawer.minutes')}
						</DrawerDetailSub>
					</div>
				</DrawerDetailRow>

				{slot.timezone && (
					<DrawerDetailRow>
						<DrawerDetailIcon>
							<MapPin color={palette.brand.purple} />
						</DrawerDetailIcon>
						<div>
							<DrawerDetailLabel>
								{t('availability.week.drawer.patient-time')}
							</DrawerDetailLabel>
							<DrawerDetailValue>
								{slot.startTime} ({slot.timezone})
							</DrawerDetailValue>
						</div>
					</DrawerDetailRow>
				)}

				{slot.therapyType && (
					<DrawerDetailRow>
						<DrawerDetailIcon>
							<Account color={palette.brand.purple} />
						</DrawerDetailIcon>
						<div>
							<DrawerDetailLabel>
								{t('availability.week.drawer.session-type')}
							</DrawerDetailLabel>
							<DrawerDetailValue>{slot.therapyType}</DrawerDetailValue>
						</div>
					</DrawerDetailRow>
				)}

				{slot.notes && (
					<DrawerDetailRow>
						<DrawerDetailIcon>
							<Appointment color={palette.brand.purple} />
						</DrawerDetailIcon>
						<div>
							<DrawerDetailLabel>
								{t('availability.week.drawer.notes')}
							</DrawerDetailLabel>
							<DrawerDetailValue>{slot.notes}</DrawerDetailValue>
						</div>
					</DrawerDetailRow>
				)}
			</DrawerDetailsList>

			<DrawerActions>
				<Button fullWidth tertiary>
					{t('availability.week.drawer.edit')}
				</Button>
				<Button fullWidth severity='error'>
					{t('availability.week.drawer.cancel-appointment')}
				</Button>
			</DrawerActions>
		</Drawer>
	);
};

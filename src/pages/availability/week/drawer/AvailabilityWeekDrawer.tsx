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
	DrawerDetailWrapper,
	DrawerHeader,
	DrawerPatientName,
	SourceBadge,
	SourceBadgeText,
} from './AvailabilityWeekDrawer.styles';
import type {
	IAvailabilityWeekDrawerProps,
	IDrawerDetail,
} from './AvailabilityWeekDrawer.types';

export const AvailabilityWeekDrawer = ({
	slot,
	onClose,
}: IAvailabilityWeekDrawerProps) => {
	const { t } = useTranslation();
	const isGoogle = slot.status === 'booked-google';

	const endHour = Number(slot.startTime.split(':')[0]) + slot.duration / 60;
	const endTime = `${String(endHour).padStart(2, '0')}:${slot.startTime.split(':')[1]}`;

	const details: IDrawerDetail[] = [
		{
			icon: <Calendar color={palette.brand.purple} />,
			key: 'date',
			label: t('availability.week.drawer.date'),
			value: format(parseISO(slot.date), 'EEEE, MMMM d, yyyy'),
		},
		{
			icon: <Watch color={palette.brand.purple} />,
			key: 'time',
			label: t('availability.week.drawer.your-time'),
			sub: `${t('availability.week.drawer.session-duration')}${slot.duration} ${t('availability.week.drawer.minutes')}`,
			value: `${slot.startTime} – ${endTime}`,
		},
		...(slot.timezone
			? [
					{
						icon: <MapPin color={palette.brand.purple} />,
						key: 'timezone',
						label: t('availability.week.drawer.patient-time'),
						value: `${slot.startTime} (${slot.timezone})`,
					},
				]
			: []),
		...(slot.therapyType
			? [
					{
						icon: <Account color={palette.brand.purple} />,
						key: 'therapy-type',
						label: t('availability.week.drawer.session-type'),
						value: slot.therapyType,
					},
				]
			: []),
		...(slot.notes
			? [
					{
						icon: <Appointment color={palette.brand.purple} />,
						key: 'notes',
						label: t('availability.week.drawer.notes'),
						value: slot.notes,
					},
				]
			: []),
	];

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
				{details.map(({ icon, key, label, sub, value }) => (
					<DrawerDetailRow key={key}>
						<DrawerDetailIcon>{icon}</DrawerDetailIcon>
						<DrawerDetailWrapper>
							<DrawerDetailLabel>{label}</DrawerDetailLabel>
							<DrawerDetailValue>{value}</DrawerDetailValue>
							{sub && <DrawerDetailSub>{sub}</DrawerDetailSub>}
						</DrawerDetailWrapper>
					</DrawerDetailRow>
				))}
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

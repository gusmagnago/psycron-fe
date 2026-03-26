import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';
import {
	Account,
	Appointment,
	Calendar,
	Google,
	Jupiter,
	MapPin,
	Watch,
} from '@psycron/components/icons';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { getFormattedContacts } from '@psycron/hooks/useFormattedContacts';
import { useSecureStorage } from '@psycron/hooks/useSecureStorage';
import i18n from '@psycron/i18n';
import { palette } from '@psycron/theme/palette/palette.theme';
import { THERAPIST_ID } from '@psycron/utils/tokens';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import {
	ConfirmedBadge,
	ConfirmedBadgeText,
	DrawerBadgeRow,
	DrawerDetailIcon,
	DrawerDetailLabel,
	DrawerDetailRow,
	DrawerDetailsList,
	DrawerDetailSub,
	DrawerDetailValue,
	DrawerDetailWrapper,
	FormWrapper,
	SourceBadge,
	SourceBadgeText,
} from './AvailabilityWeekDrawer.styles';
import type {
	IAvailabilityWeekDrawerProps,
	IDrawerDetail,
} from './AvailabilityWeekDrawer.types';
import {
	computeEndTime,
	computeTimeStrings,
	STATUS_CONFIG,
} from './AvailabilityWeekDrawer.utils';

// Encapsulates booking form state and submission — keeps the component declarative
const useBookingForm = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null
) => {
	const { bookAppointmentWithLink } = usePatient();
	const methods = useForm<ICreatePatientForm>({ mode: 'onChange' });
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = (formData: ICreatePatientForm) => {
		const { email, firstName, lastName } = formData;
		const { fullPhone, fullWhatsapp } = getFormattedContacts(formData);

		bookAppointmentWithLink({
			therapistId,
			data: {
				availabilityDayId: slot.availabilityDayId ?? '',
				slotId: slot._id ?? slot.id,
				patient: {
					firstName,
					lastName,
					contacts: {
						email,
						phone: fullPhone,
						...(fullWhatsapp ? { whatsapp: fullWhatsapp } : {}),
					},
				},
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				shouldReplicate: false,
			},
		});
	};

	return { isSubmitting, methods, submitBooking: handleSubmit(onSubmit) };
};

export const AvailabilityWeekDrawer = ({
	slot,
	onClose,
}: IAvailabilityWeekDrawerProps) => {
	const { t } = useTranslation();
	const therapistId = useSecureStorage(THERAPIST_ID);
	const { userDetails } = useUserDetails(therapistId ?? undefined);
	const { isSubmitting, methods, submitBooking } = useBookingForm(
		slot,
		therapistId
	);

	const isAvailable = slot.status === 'available';
	const isGoogle = slot.status === 'booked-google';
	const statusCfg = STATUS_CONFIG[slot.status];
	const dateLocale = i18n.language.startsWith('pt') ? ptBR : enGB;

	const endTime = computeEndTime(slot.startTime, slot.duration);
	const formattedDate = format(parseISO(slot.date), 'PPPP', {
		locale: dateLocale,
	});

	const { therapistTimeStr, patientTimeStr } = useMemo(() => {
		const therapistTZ =
			userDetails?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
		return computeTimeStrings(slot, endTime, therapistTZ, dateLocale);
	}, [slot, endTime, userDetails?.timeZone, dateLocale]);

	const timeSub = `${t('availability.week.drawer.session-duration')}${slot.duration} ${t('availability.week.drawer.minutes')}`;

	// Available: show date + therapist time as pre-booking context
	// Booked: show therapist time + patient time + session metadata
	const details: IDrawerDetail[] = isAvailable
		? [
				{
					icon: <Calendar color={palette.brand.purple} />,
					key: 'date',
					label: t('availability.week.drawer.date'),
					value: formattedDate,
				},
				{
					icon: <Watch color={palette.brand.purple} />,
					key: 'time',
					label: t('availability.week.drawer.your-time'),
					sub: timeSub,
					value: therapistTimeStr,
				},
			]
		: [
				{
					icon: <Watch color={palette.brand.purple} />,
					key: 'time',
					label: t('availability.week.drawer.your-time'),
					sub: timeSub,
					value: therapistTimeStr,
				},
				...(patientTimeStr
					? [
							{
								icon: <MapPin color={palette.brand.purple} />,
								key: 'patient-time',
								label: t('availability.week.drawer.patient-time'),
								value: patientTimeStr,
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
		<Drawer
			ariaLabel={
				isAvailable
					? t('availability.week.drawer.book-slot')
					: (slot.patientName ?? '')
			}
			title={
				isAvailable
					? t('availability.week.drawer.book-slot')
					: (slot.patientName ?? '')
			}
			headerExtra={
				<>
					{!isAvailable && (
						<DrawerDetailLabel>{formattedDate}</DrawerDetailLabel>
					)}
					<DrawerBadgeRow>
						{isAvailable ? (
							<ConfirmedBadge>
								<ConfirmedBadgeText>
									{slot.startTime} – {endTime}
								</ConfirmedBadgeText>
							</ConfirmedBadge>
						) : (
							<>
								{statusCfg && (
									<ConfirmedBadge badgeColor={statusCfg.badgeColor}>
										<ConfirmedBadgeText>
											{t(statusCfg.labelKey)}
										</ConfirmedBadgeText>
									</ConfirmedBadge>
								)}
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
							</>
						)}
					</DrawerBadgeRow>
				</>
			}
			onClose={onClose}
			actions={
				isAvailable ? (
					<Button
						fullWidth
						disabled={isSubmitting}
						onClick={submitBooking}
						tertiary
						variant='contained'
					>
						{t('availability.week.drawer.confirm-booking')}
					</Button>
				) : (
					<>
						<Button fullWidth tertiary>
							{t('availability.week.drawer.edit')}
						</Button>
						<Button fullWidth severity='error'>
							{t('availability.week.drawer.cancel-appointment')}
						</Button>
					</>
				)
			}
		>
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

			{isAvailable && (
				<FormProvider {...methods}>
					<Box component='form'>
						<FormWrapper>
							<NameForm<ICreatePatientForm>
								required
								fields={{ firstName: 'firstName', lastName: 'lastName' }}
								labelFirstName={t(
									'availability.week.drawer.patient-first-name'
								)}
								labelLastName={t('availability.week.drawer.patient-last-name')}
								placeholderFirstName={t(
									'availability.week.drawer.patient-first-name'
								)}
								placeholderLastName={t(
									'availability.week.drawer.patient-last-name'
								)}
							/>
							<ContactsForm<ICreatePatientForm>
								atLeastOneContact
								fullWidth
								labelEmail={t('availability.week.drawer.patient-email')}
								placeholderEmail={t('availability.week.drawer.patient-email')}
								fields={{
									email: 'email',
									hasWhatsApp: 'hasWhatsApp',
									isPhoneWpp: 'isPhoneWpp',
									phone: 'phone',
									whatsapp: 'whatsapp',
								}}
							/>
						</FormWrapper>
					</Box>
				</FormProvider>
			)}
		</Drawer>
	);
};

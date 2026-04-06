import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { Avatar } from '@psycron/components/avatar/Avatar';
import { Divider } from '@psycron/components/divider/Divider';
import {
	Account,
	Appointment,
	CheckSuccess,
	Copy,
	Globe,
	Google,
	Mail,
	MapPin,
	Phone,
	Watch,
	WhatsApp,
} from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import { BookedSection } from './booked-section/SlotBookedSection';
import {
	ActionIconButton,
	BookedBodyWrapper,
	ContactShortcutButton,
	ContactShortcutsRow,
	DeliveryBadge,
	DetailActions,
	DetailLabel,
	DetailRow,
	DetailRowLeft,
	DetailSub,
	DetailValue,
	GoogleSyncBanner,
	IdentityBlock,
	IdentityInfo,
	IdentityName,
	MissingFieldText,
	NotesText,
	OnlineSessionLabel,
	OnlineSessionRow,
	PastOverlay,
	RequestAddressButton,
	SectionWrapper,
	SessionCountText,
} from './SlotBookedBody.styles';
import type { ISlotBookedBodyProps } from './SlotBookedBody.types';
import { useCopyToClipboard } from './SlotBookedBody.utils';

export const SlotBookedBody = ({
	appointmentDetails,
	formattedDate,
	isGoogle,
	isLoading,
	isPast,
	patientName,
	patientTimeStr,
	sessionType,
	slot,
	therapistTimeStr,
	timeSub,
}: ISlotBookedBodyProps) => {
	const { t } = useTranslation();
	const { copy, copiedKey } = useCopyToClipboard();

	const patient = appointmentDetails?.appointment?.patient;
	const appt = appointmentDetails?.appointment;

	const email = patient?.contacts?.email;
	const phone = patient?.contacts?.phone;
	const whatsapp = patient?.contacts?.whatsapp;

	const firstName = patient?.firstName ?? '';
	const lastName = patient?.lastName ?? '';

	const sessionCount = appt?.sessionCount ?? 0;

	const isOnline = slot.deliveryMode === 'online' || sessionType === 'ONLINE';

	const address = appt?.address
		? [appt.address.street, appt.address.city, appt.address.country]
				.filter(Boolean)
				.join(', ')
		: null;

	if (isLoading) {
		return (
			<BookedBodyWrapper>
				<IdentityBlock>
					<Skeleton variant='circular' width={40} height={40} />
					<IdentityInfo>
						<Skeleton variant='text' width='60%' height={20} />
						<Skeleton variant='text' width='40%' height={16} />
						<Skeleton variant='text' width='50%' height={32} />
					</IdentityInfo>
				</IdentityBlock>
				<Divider />
				<SectionWrapper>
					<Skeleton variant='text' width='30%' height={16} />
					<Skeleton variant='text' width='80%' height={20} />
					<Skeleton variant='text' width='60%' height={20} />
					<Skeleton variant='text' width='50%' height={20} />
				</SectionWrapper>
				<Divider />
				<SectionWrapper>
					<Skeleton variant='text' width='30%' height={16} />
					<Skeleton variant='text' width='70%' height={20} />
					<Skeleton variant='text' width='55%' height={20} />
				</SectionWrapper>
			</BookedBodyWrapper>
		);
	}

	return (
		<BookedBodyWrapper>
			{isPast && <PastOverlay />}

			{/* ─── Patient identity ─── */}
			<IdentityBlock>
				<Avatar firstName={firstName} lastName={lastName || firstName} />
				<IdentityInfo>
					<IdentityName>{patientName}</IdentityName>
					{patientName && (
						<SessionCountText>
							{sessionCount <= 1
								? t('availability.week.drawer.booked-session-first', {
										name: firstName,
									})
								: t('availability.week.drawer.booked-session-count', {
										count: sessionCount,
										name: firstName,
									})}
						</SessionCountText>
					)}
					<ContactShortcutsRow>
						{phone && (
							<ContactShortcutButton
								aria-label={t('availability.week.drawer.booked-call-aria', {
									name: patientName,
								})}
								href={`tel:${phone}`}
								title={t('availability.week.drawer.call-phone')}
							>
								<Phone color={palette.info.main} />
							</ContactShortcutButton>
						)}
						{(whatsapp ?? phone) && (
							<ContactShortcutButton
								aria-label={t('availability.week.drawer.booked-whatsapp-aria', {
									name: patientName,
								})}
								href={`https://wa.me/${(whatsapp ?? phone ?? '').replace(/\D/g, '')}`}
								rel='noopener noreferrer'
								target='_blank'
								title='WhatsApp'
							>
								<WhatsApp color={palette.success.main} />
							</ContactShortcutButton>
						)}
						{email && (
							<ContactShortcutButton
								aria-label={t('availability.week.drawer.booked-email-aria', {
									name: patientName,
								})}
								href={`mailto:${email}`}
								title={t('availability.week.drawer.patient-email')}
							>
								<Mail color={palette.brand.purple} />
							</ContactShortcutButton>
						)}
					</ContactShortcutsRow>
				</IdentityInfo>
			</IdentityBlock>

			{/* ─── Google sync note ─── */}
			{isGoogle && (
				<GoogleSyncBanner>
					<Google color={palette.brand.google} />
					{t('availability.week.drawer.booked-google-sync')}
				</GoogleSyncBanner>
			)}

			<Divider />

			{/* ─── Session section ─── */}
			<BookedSection
				icon={<Watch color={palette.gray['05']} />}
				title={t('availability.week.drawer.booked-section-session')}
			>
				<DetailRow>
					<DetailRowLeft>
						<DetailLabel>
							{t('availability.week.drawer.booked-date')}
						</DetailLabel>
						<DetailValue>{formattedDate}</DetailValue>
					</DetailRowLeft>
				</DetailRow>

				<DetailRow>
					<DetailRowLeft>
						<DetailLabel>
							{t('availability.week.drawer.booked-time')}
						</DetailLabel>
						<DetailValue>{therapistTimeStr}</DetailValue>
						{patientTimeStr && <DetailSub>{patientTimeStr}</DetailSub>}
					</DetailRowLeft>
				</DetailRow>

				<DetailRow>
					<DetailRowLeft>
						<DetailLabel>
							{t('availability.week.drawer.booked-duration')}
						</DetailLabel>
						<DetailValue>{timeSub}</DetailValue>
					</DetailRowLeft>
				</DetailRow>
			</BookedSection>

			<Divider />

			{/* ─── Patient section ─── */}
			<BookedSection
				icon={<Account color={palette.gray['05']} />}
				title={t('availability.week.drawer.booked-section-patient')}
			>
				<DetailRow>
					<DetailRowLeft>
						<DetailLabel>
							{t('availability.week.drawer.booked-email')}
						</DetailLabel>
						{email ? (
							<DetailValue>{email}</DetailValue>
						) : (
							<MissingFieldText>
								{t('availability.week.drawer.booked-no-email')}
							</MissingFieldText>
						)}
					</DetailRowLeft>
					{email && (
						<DetailActions>
							<ActionIconButton
								aria-label={t('availability.week.drawer.booked-copy-aria', {
									field: 'email',
								})}
								isCopied={copiedKey === 'email'}
								onClick={() => copy(email, 'email')}
								title={
									copiedKey === 'email'
										? t('availability.week.drawer.booked-copied')
										: undefined
								}
								type='button'
							>
								{copiedKey === 'email' ? (
									<CheckSuccess color={palette.success.main} />
								) : (
									<Copy color={palette.gray['05']} />
								)}
							</ActionIconButton>
							<ContactShortcutButton
								aria-label={t('availability.week.drawer.booked-email-aria', {
									name: patientName,
								})}
								href={`mailto:${email}`}
							>
								<Mail color={palette.brand.purple} />
							</ContactShortcutButton>
						</DetailActions>
					)}
				</DetailRow>

				<DetailRow>
					<DetailRowLeft>
						<DetailLabel>
							{t('availability.week.drawer.booked-phone')}
						</DetailLabel>
						{phone ? (
							<DetailValue>{phone}</DetailValue>
						) : (
							<MissingFieldText>
								{t('availability.week.drawer.booked-no-phone')}
							</MissingFieldText>
						)}
					</DetailRowLeft>
					{phone && (
						<DetailActions>
							<ActionIconButton
								aria-label={t('availability.week.drawer.booked-copy-aria', {
									field: 'phone',
								})}
								isCopied={copiedKey === 'phone'}
								onClick={() => copy(phone, 'phone')}
								title={
									copiedKey === 'phone'
										? t('availability.week.drawer.booked-copied')
										: undefined
								}
								type='button'
							>
								{copiedKey === 'phone' ? (
									<CheckSuccess color={palette.success.main} />
								) : (
									<Copy color={palette.gray['05']} />
								)}
							</ActionIconButton>
							<ContactShortcutButton
								aria-label={t('availability.week.drawer.booked-call-aria', {
									name: patientName,
								})}
								href={`tel:${phone}`}
							>
								<Phone color={palette.info.main} />
							</ContactShortcutButton>
							<ContactShortcutButton
								aria-label={t('availability.week.drawer.booked-whatsapp-aria', {
									name: patientName,
								})}
								href={`https://wa.me/${(whatsapp ?? phone).replace(/\D/g, '')}`}
								rel='noopener noreferrer'
								target='_blank'
							>
								<WhatsApp color={palette.success.main} />
							</ContactShortcutButton>
						</DetailActions>
					)}
				</DetailRow>
			</BookedSection>

			{/* ─── Location section ─── */}
			<BookedSection
				icon={<MapPin color={palette.gray['05']} />}
				title={t('availability.week.drawer.booked-section-location')}
			>
				{isOnline ? (
					<OnlineSessionRow>
						<Globe color={palette.brand.purple} />
						<OnlineSessionLabel>
							{t('availability.week.drawer.booked-online-session')}
						</OnlineSessionLabel>
						<DeliveryBadge isOnline>
							{t('availability.week.drawer.session-delivery-online')}
						</DeliveryBadge>
					</OnlineSessionRow>
				) : (
					<DetailRow>
						<DetailRowLeft>
							<DetailLabel>
								{t('availability.week.drawer.appointment-address')}
							</DetailLabel>
							{address ? (
								<DetailValue>{address}</DetailValue>
							) : appt?.letPatientChooseAddress ? (
								<>
									<MissingFieldText>
										{t('availability.week.drawer.booked-awaiting-address')}
									</MissingFieldText>
									{!isPast && (
										<RequestAddressButton
											type='button'
											onClick={() => {
												// TODO: wire to notification centre (PR-304)
											}}
										>
											<Mail color={palette.brand.purple} />
											{t('availability.week.drawer.booked-request-address')}
										</RequestAddressButton>
									)}
								</>
							) : (
								<MissingFieldText>
									{t('availability.week.drawer.booked-in-person')}
								</MissingFieldText>
							)}
						</DetailRowLeft>
						{address && (
							<DetailActions>
								<ActionIconButton
									aria-label={t('availability.week.drawer.booked-copy-aria', {
										field: 'address',
									})}
									isCopied={copiedKey === 'address'}
									onClick={() => copy(address, 'address')}
									type='button'
								>
									{copiedKey === 'address' ? (
										<CheckSuccess color={palette.success.main} />
									) : (
										<Copy color={palette.gray['05']} />
									)}
								</ActionIconButton>
							</DetailActions>
						)}
					</DetailRow>
				)}
			</BookedSection>

			{/* ─── Notes section (conditional) ─── */}
			{slot.notes && (
				<BookedSection
					icon={<Appointment color={palette.gray['05']} />}
					title={t('availability.week.drawer.booked-section-notes')}
				>
					<NotesText>{slot.notes}</NotesText>
				</BookedSection>
			)}
		</BookedBodyWrapper>
	);
};

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { Avatar } from '@psycron/components/avatar/Avatar';
import { ShareButton } from '@psycron/components/button/share/ShareButton';
import { Divider } from '@psycron/components/divider/Divider';
import {
	Account,
	Appointment,
	Bell,
	CheckSuccess,
	Copy,
	Globe,
	Google,
	Mail,
	MapPin,
	Phone,
	WhatsApp,
} from '@psycron/components/icons';
import i18n from '@psycron/i18n';
import { NOTIFICATIONS } from '@psycron/pages/urls';
import { palette } from '@psycron/theme/palette/palette.theme';

import { SlotSessionSection } from '../slot-session-section/SlotSessionSection';

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
	DetailValue,
	GoogleSyncBanner,
	IdentityBlock,
	IdentityInfo,
	IdentityName,
	MissingFieldText,
	NavShortcutButton,
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
	isGoogle,
	isLoading,
	isPast,
	patientName,
	sessionDetails,
	sessionType,
	slot,
	shareText,
	shareTitle,
	shareWith,
	bookingLink,
}: ISlotBookedBodyProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { copy, copiedKey } = useCopyToClipboard();

	const patient = appointmentDetails?.appointment?.patient;
	const appt = appointmentDetails?.appointment;
	const patientId = appt?.patientId ?? (patient?._id as string | undefined);

	const email = patient?.contacts?.email;
	const phone = patient?.contacts?.phone;
	const whatsapp = patient?.contacts?.whatsapp;

	const nameParts = (patientName ?? '').trim().split(/\s+/);
	const firstName = patient?.firstName ?? nameParts[0] ?? '';
	const lastName = patient?.lastName ?? nameParts.slice(1).join(' ') ?? '';

	// Google enrichment fields from the slot
	const googleMeetLink = slot.googleMeetLink;
	const googleDescription = slot.googleDescription;
	const googleHtmlLink = slot.googleHtmlLink;
	const googleLocation = slot.googleLocation;
	const googleAttendees = slot.googleAttendees ?? [];
	const googleOrganizer = slot.googleOrganizer;

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
						<ShareButton
							absoluteUrl={bookingLink}
							preferNativeShare
							shareWith={shareWith}
							textKey={shareText}
							titleKey={shareTitle}
						/>
						{patientId && (
							<NavShortcutButton
								aria-label={t('availability.week.drawer.booked-view-notifications')}
								title={t('availability.week.drawer.booked-view-notifications')}
								type='button'
								onClick={() => {
									capture(PostHogEvent.NotificationDeepLinkFollowed, {
										patient_id: patientId,
										source: 'slot_drawer',
									});
									navigate(`/${i18n.language}/${NOTIFICATIONS}`, {
										state: { patientId },
									});
								}}
							>
								<Bell color={palette.brand.purple} />
							</NavShortcutButton>
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
			<SlotSessionSection {...sessionDetails} />

			<Divider />

			{/* Patient section — hidden for GCal events (no Psycron patient linked) */}
			{!isGoogle && <BookedSection
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
			</BookedSection>}

			{/* ─── Location section ─── */}
			<BookedSection
				icon={<MapPin color={palette.gray['05']} />}
				title={t('availability.week.drawer.booked-section-location')}
			>
				{isOnline || googleMeetLink ? (
					<OnlineSessionRow>
						<Globe color={palette.brand.purple} />
						<OnlineSessionLabel>
							{t('availability.week.drawer.booked-online-session')}
						</OnlineSessionLabel>
						{(isOnline || !googleMeetLink) && (
							<DeliveryBadge isOnline>
								{t('availability.week.drawer.session-delivery-online')}
							</DeliveryBadge>
						)}
						{googleMeetLink && (
							<ContactShortcutButton
								href={googleMeetLink}
								rel='noopener noreferrer'
								target='_blank'
								aria-label='Join Google Meet'
								title='Join Google Meet'
							>
								<Google color={palette.brand.google} />
							</ContactShortcutButton>
						)}
					</OnlineSessionRow>
				) : (
					<DetailRow>
						<DetailRowLeft>
							<DetailLabel>
								{t('availability.week.drawer.appointment-address')}
							</DetailLabel>
							{(address || googleLocation) ? (
								<DetailValue>{address ?? googleLocation}</DetailValue>
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
						{(address || googleLocation) && (
							<DetailActions>
								<ActionIconButton
									aria-label={t('availability.week.drawer.booked-copy-aria', {
										field: 'address',
									})}
									isCopied={copiedKey === 'address'}
									onClick={() => copy((address ?? googleLocation)!, 'address')}
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

			{/* ─── Notes / description section ─── */}
			{(slot.notes || googleDescription) && (
				<BookedSection
					icon={<Appointment color={palette.gray['05']} />}
					title={t('availability.week.drawer.booked-section-notes')}
				>
					<NotesText>{slot.notes ?? googleDescription}</NotesText>
				</BookedSection>
			)}

			{/* ─── Google Calendar attendees + open link ─── */}
			{isGoogle && (googleAttendees.length > 0 || googleOrganizer || googleHtmlLink) && (
				<BookedSection
					icon={<Google color={palette.brand.google} />}
					title='Google Calendar'
				>
					{googleOrganizer && (
						<DetailRow>
							<DetailRowLeft>
								<DetailLabel>Organizer</DetailLabel>
								<DetailValue>
									{googleOrganizer.displayName ?? googleOrganizer.email}
								</DetailValue>
							</DetailRowLeft>
						</DetailRow>
					)}
					{googleAttendees.map((attendee) => (
						<DetailRow key={attendee.email}>
							<DetailRowLeft>
								<DetailLabel>Guest</DetailLabel>
								<DetailValue>
									{attendee.displayName
										? `${attendee.displayName} (${attendee.email})`
										: attendee.email}
								</DetailValue>
							</DetailRowLeft>
						</DetailRow>
					))}
					{googleHtmlLink && (
						<ContactShortcutButton
							href={googleHtmlLink}
							rel='noopener noreferrer'
							target='_blank'
							aria-label='Open in Google Calendar'
							title='Open in Google Calendar'
						>
							<Google color={palette.brand.google} />
						</ContactShortcutButton>
					)}
				</BookedSection>
			)}
		</BookedBodyWrapper>
	);
};

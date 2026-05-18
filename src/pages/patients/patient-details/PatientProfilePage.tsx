import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { Avatar } from '@psycron/components/avatar/Avatar';
import { ShareButton } from '@psycron/components/button/share/ShareButton';
import {
	Calendar,
	Edit,
	Mail,
	MapPin,
	Phone,
	Settings,
	WhatsApp,
} from '@psycron/components/icons';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { PatientNotificationSettingsDrawer } from '@psycron/pages/notifications/settings/PatientNotificationSettingsDrawer';
import { DOMAIN, PATIENTS } from '@psycron/pages/urls';
import {
	formatDateTimeRange,
	formatLocalizedDate,
	formatTimezoneLabel,
} from '@psycron/utils/date/date.utils';
import {
	formatPatientAddress,
	getPatientBillingViewModel,
	getPatientFullName,
} from '@psycron/utils/patient/patient.utils';

import type {
	PatientSessionRow,
	SessionTimelineFilter,
} from '../PatientsPage.types';
import {
	getLastCompletedSession,
	getNextSession,
	getPatientSessions,
	getPatientStats,
	getPreferredContactLabelKey,
	getSessionsAscending,
} from '../PatientsPage.utils';

import { ConsentSection } from './components/consent/ConsentSection';
import { PatientEditForm } from './edit-patient-form/PatientEditForm';
import { SessionDrawer } from './session-drawer/SessionDrawer';
import {
	ContentGrid,
	DetailGrid,
	DetailItem,
	DetailLabel,
	DetailValue,
	EmptyPanel,
	HeroActions,
	HeroCard,
	HeroHeaderRow,
	HeroIconButton,
	IdentityCluster,
	IdentityText,
	MutedValue,
	NotificationChannelsRow,
	NotificationChannelTag,
	NotificationDetailItem,
	PatientMeta,
	PatientName,
	ProfileLayout,
	SectionCard,
	SectionTitle,
	SessionDate,
	SessionList,
	SessionMain,
	SessionMeta,
	SessionRow,
	SessionStatus,
	ShortcutLink,
	ShortcutRow,
	StatCard,
	StatLabel,
	StatsGrid,
	StatusPill,
	StatValue,
} from './PatientProfilePage.styles';

export const PatientProfilePage = () => {
	const { i18n, t } = useTranslation();
	const { patientId } = useParams<{ patientId: string }>();
	const [searchParams, setSearchParams] = useSearchParams();
	const [editFormOpen, setEditFormOpen] = useState(false);
	const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
	const [selectedSession, setSelectedSession] =
		useState<PatientSessionRow | null>(null);
	const therapistId = useTherapistId();
	const { isPatientDetailsLoading, patientDetails } = usePatient(
		therapistId,
		patientId ?? null
	);

	const patientName = getPatientFullName(patientDetails);
	const fallback = t('patients.list.not-available');
	const sessions = getPatientSessions(patientDetails);
	const stats = getPatientStats(sessions);
	const nextSession = getNextSession(sessions);
	const lastSession = getLastCompletedSession(sessions);
	const timelineSessions = useMemo(
		() => getSessionsAscending(sessions),
		[sessions]
	);
	const requestedSessionId = searchParams.get('session');
	const requestedDrawerMode = searchParams.get('mode');
	const [timelineFilter, setTimelineFilter] =
		useState<SessionTimelineFilter>('all');
	const filteredTimelineSessions = useMemo(
		() =>
			timelineSessions.filter((session) => {
				switch (timelineFilter) {
					case 'upcoming':
						return !session.isPast && !session.isCancelled;
					case 'completed':
						return session.isPast && !session.isCancelled;
					case 'cancelled':
						return session.isCancelled;
					case 'all':
					default:
						return true;
				}
			}),
		[timelineFilter, timelineSessions]
	);
	const status = patientDetails?.status ?? 'ACTIVE';
	const title = patientName || t('globals.patient');
	const sharePatientId = patientDetails
		? status === 'MERGED' && patientDetails.mergedIntoPatientId
			? patientDetails.mergedIntoPatientId
			: patientDetails._id
		: null;
	const publicSessionsPath = sharePatientId
		? `${sharePatientId}/appointments`
		: '';
	const publicSessionsLink = sharePatientId
		? `${DOMAIN}/${i18n.language}/${publicSessionsPath}`
		: '';
	const billingViewModel = getPatientBillingViewModel(
		patientDetails?.billing,
		i18n.language,
		t
	);

	const remindersDisabled =
		patientDetails?.notificationPreferences?.reminder.enabled === false;

	const activeNotificationChannels = useMemo((): string[] => {
		if (!patientDetails) return [];

		const prefs = patientDetails.notificationPreferences;
		const contacts = patientDetails.contacts;
		const preferred = patientDetails.preferredContact?.type;
		const hasEmail = Boolean(contacts?.email);
		const hasWhatsApp = Boolean(contacts?.whatsapp ?? contacts?.phone);

		if (prefs && !remindersDisabled) {
			const channels: string[] = [];
			if (prefs.reminder.email && hasEmail) channels.push('email');
			if (prefs.reminder.whatsapp && hasWhatsApp) channels.push('whatsapp');
			return channels;
		}

		if (remindersDisabled) return [];

		// No prefs set — derive from contacts, preferred contact first
		if (preferred === 'whatsapp') {
			const channels: string[] = [];
			if (hasWhatsApp) channels.push('whatsapp');
			if (hasEmail) channels.push('email');
			return channels;
		}

		const channels: string[] = [];
		if (hasEmail) channels.push('email');
		if (hasWhatsApp) channels.push('whatsapp');
		return channels;
	}, [patientDetails, remindersDisabled]);

	useEffect(() => {
		if (!patientDetails?._id) return;

		capture(PostHogEvent.PatientCenterOpened, {
			target_user_id: patientDetails._id,
		});
	}, [patientDetails?._id]);

	const renderSessionStatus = (
		isCancelled: boolean,
		isPast: boolean
	): string => {
		if (isCancelled) return t('patients.profile.sessions.cancelled');
		if (isPast) return t('patients.profile.sessions.completed');
		return t('patients.profile.sessions.upcoming');
	};

	const openSessionDrawer = (session: PatientSessionRow) => {
		capture(PostHogEvent.PatientCenterSessionDrawerOpened, {
			source: 'timeline',
			session_status: session.isCancelled
				? 'cancelled'
				: session.isPast
					? 'past'
					: 'upcoming',
		});
		setSelectedSession(session);
	};

	useEffect(() => {
		if (!requestedSessionId || selectedSession) return;

		const requestedSession =
			timelineSessions.find((session) => session.slot._id === requestedSessionId) ??
			null;

		if (requestedSession) {
			setSelectedSession(requestedSession);
		}
	}, [requestedSessionId, selectedSession, timelineSessions]);

	const handleSessionDrawerClose = () => {
		setSelectedSession(null);

		if (!requestedSessionId && !requestedDrawerMode) return;

		const nextParams = new URLSearchParams(searchParams);
		nextParams.delete('mode');
		nextParams.delete('session');
		setSearchParams(nextParams, { replace: true });
	};

	const handleTimelineFilterChange = (filter: SessionTimelineFilter) => {
		setTimelineFilter(filter);

		if (!patientDetails?._id) return;

		capture(PostHogEvent.PatientCenterTimelineFilterChanged, {
			filter,
			target_user_id: patientDetails._id,
		});
	};

	return (
		<PageLayout
			title={title}
			subTitle={t('patients.profile.subtitle')}
			isLoading={isPatientDetailsLoading}
			backButton
			backTo={PATIENTS}
		>
			{patientDetails ? (
				<ProfileLayout>
					<HeroCard>
						<IdentityCluster>
							<Avatar
								firstName={patientDetails.firstName}
								lastName={patientDetails.lastName || patientDetails.firstName}
								large
							/>
							<IdentityText>
								<HeroHeaderRow>
									<StatusPill status={status}>
										{t(`patients.profile.status.${status.toLowerCase()}`)}
									</StatusPill>
									<HeroActions>
										{patientDetails ? (
											<ShareButton
												preferNativeShare
												shareWith={patientName}
												textKey={t('patients.profile.share.text')}
												titleKey={t('patients.profile.share.title')}
												url={publicSessionsPath}
											/>
										) : null}
										{status !== 'MERGED' ? (
											<Tooltip
												arrow
												placement='top'
												title={t('patients.profile.actions.edit')}
											>
												<HeroIconButton
													aria-label={t('patients.profile.actions.edit')}
													onClick={() => setEditFormOpen(true)}
													size='small'
												>
													<Edit />
												</HeroIconButton>
											</Tooltip>
										) : null}
									</HeroActions>
								</HeroHeaderRow>
								<PatientName>{patientName}</PatientName>
								<PatientMeta>
									{t('patients.profile.member-since', {
										date: formatLocalizedDate(
											patientDetails.createdAt,
											fallback,
											i18n.language
										),
									})}
								</PatientMeta>
								<ShortcutRow>
									{patientDetails.contacts?.phone ? (
										<ShortcutLink
											href={`tel:${patientDetails.contacts.phone}`}
											tone='info'
										>
											<Phone color='currentColor' />
											{t('patients.profile.actions.call')}
										</ShortcutLink>
									) : null}
									{patientDetails.contacts?.whatsapp ||
									patientDetails.contacts?.phone ? (
										<ShortcutLink
											href={`https://wa.me/${(
												patientDetails.contacts?.whatsapp ??
												patientDetails.contacts?.phone ??
												''
											).replace(/\D/g, '')}`}
											rel='noopener noreferrer'
											target='_blank'
											tone='success'
										>
											<WhatsApp color='currentColor' />
											{t('patients.profile.actions.whatsapp')}
										</ShortcutLink>
									) : null}
									{patientDetails.contacts?.email ? (
										<ShortcutLink
											href={`mailto:${patientDetails.contacts.email}`}
											tone='secondary'
										>
											<Mail color='currentColor' />
											{t('patients.profile.actions.email')}
										</ShortcutLink>
									) : null}
								</ShortcutRow>
							</IdentityText>
						</IdentityCluster>

						<StatsGrid>
							<StatCard
								aria-pressed={timelineFilter === 'all'}
								isActive={timelineFilter === 'all'}
								onClick={() => handleTimelineFilterChange('all')}
								type='button'
							>
								<StatValue>{stats.totalSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.total')}</StatLabel>
							</StatCard>
							<StatCard
								aria-pressed={timelineFilter === 'upcoming'}
								isActive={timelineFilter === 'upcoming'}
								onClick={() => handleTimelineFilterChange('upcoming')}
								type='button'
							>
								<StatValue>{stats.upcomingSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.upcoming')}</StatLabel>
							</StatCard>
							<StatCard
								aria-pressed={timelineFilter === 'completed'}
								isActive={timelineFilter === 'completed'}
								onClick={() => handleTimelineFilterChange('completed')}
								type='button'
							>
								<StatValue>{stats.pastSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.completed')}</StatLabel>
							</StatCard>
							<StatCard
								aria-pressed={timelineFilter === 'cancelled'}
								isActive={timelineFilter === 'cancelled'}
								onClick={() => handleTimelineFilterChange('cancelled')}
								type='button'
							>
								<StatValue>{stats.cancelledSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.cancelled')}</StatLabel>
							</StatCard>
						</StatsGrid>
					</HeroCard>

					<ContentGrid>
						<SectionCard>
							<SectionTitle>
								{t('patients.profile.sections.details')}
							</SectionTitle>
							<DetailGrid>
								<DetailItem>
									<DetailLabel>{t('globals.email')}</DetailLabel>
									<DetailValue>
										{patientDetails.contacts?.email ?? fallback}
									</DetailValue>
								</DetailItem>
								<DetailItem>
									<DetailLabel>{t('globals.phone')}</DetailLabel>
									<DetailValue>
										{patientDetails.contacts?.phone ?? fallback}
									</DetailValue>
								</DetailItem>
								<DetailItem>
									<DetailLabel>{t('globals.whatsapp')}</DetailLabel>
									<DetailValue>
										{patientDetails.contacts?.whatsapp ?? fallback}
									</DetailValue>
								</DetailItem>
								<DetailItem>
									<DetailLabel>
										{t('patients.list.columns.preferred-contact')}
									</DetailLabel>
									<DetailValue>
										{t(
											getPreferredContactLabelKey(
												patientDetails.preferredContact?.type
											)
										)}
									</DetailValue>
									{patientDetails.preferredContact?.value ? (
										<MutedValue>
											{patientDetails.preferredContact.value}
										</MutedValue>
									) : null}
								</DetailItem>
								<DetailItem>
									<DetailLabel>
										{t('patients.list.columns.timezone')}
									</DetailLabel>
									<DetailValue>
										{formatTimezoneLabel(
											patientDetails.timeZone,
											i18n.language,
											fallback
										)}
									</DetailValue>
								</DetailItem>
								<DetailItem>
									<DetailLabel>{t('globals.address')}</DetailLabel>
									<DetailValue>
										{formatPatientAddress(patientDetails.address, fallback)}
									</DetailValue>
								</DetailItem>
								<DetailItem>
									<DetailLabel>
										{t('patients.profile.billing.model')}
									</DetailLabel>
									<DetailValue>{billingViewModel.modelLabel}</DetailValue>
								</DetailItem>
								<DetailItem>
									<DetailLabel>
										{t('patients.profile.billing.category')}
									</DetailLabel>
									<DetailValue>{billingViewModel.categoryLabel}</DetailValue>
								</DetailItem>
								<DetailItem>
									<DetailLabel>
										{t('patients.profile.billing.amount')}
									</DetailLabel>
									<DetailValue>
										{billingViewModel.amountLabel ?? fallback}
									</DetailValue>
								</DetailItem>
								<NotificationDetailItem>
									<DetailLabel>
										{t('patients.profile.notifications.label')}
									</DetailLabel>
									<NotificationChannelsRow>
										{remindersDisabled ? (
											<NotificationChannelTag isActive={false}>
												{t('patients.profile.notifications.reminders-off')}
											</NotificationChannelTag>
										) : (
											activeNotificationChannels.map((channel) => (
												<NotificationChannelTag isActive key={channel}>
													{t(`notifications.channels.${channel}`)}
												</NotificationChannelTag>
											))
										)}
										<Tooltip
											arrow
											placement='top'
											title={t('notifications.patient-settings.action')}
										>
											<HeroIconButton
												aria-label={t(
													'notifications.patient-settings.action'
												)}
												onClick={() => setNotificationSettingsOpen(true)}
												size='small'
											>
												<Settings />
											</HeroIconButton>
										</Tooltip>
									</NotificationChannelsRow>
								</NotificationDetailItem>

								<DetailItem>
									<DetailLabel>
										{t('patients.profile.share.link-label')}
									</DetailLabel>
									<ShortcutLink
										href={publicSessionsLink}
										rel='noopener noreferrer'
										target='_blank'
									>
										{t('patients.profile.actions.open-sessions')}
									</ShortcutLink>
								</DetailItem>
							</DetailGrid>
							{status === 'MERGED' ? (
								<MutedValue>
									{t('patients.profile.merged-note', {
										patientId:
											patientDetails.mergedIntoPatientId ??
											t('patients.profile.unknown-patient'),
									})}
								</MutedValue>
							) : null}
						</SectionCard>

						<SectionCard>
							<SectionTitle>{t('consent.title')}</SectionTitle>
							<ConsentSection patientId={patientDetails._id} />
						</SectionCard>

						<SectionCard>
							<SectionTitle>
								{t('patients.profile.sections.timeline')}
							</SectionTitle>
							<DetailGrid>
								<DetailItem>
									<DetailLabel>
										{t('patients.profile.next-session')}
									</DetailLabel>
									<DetailValue>
										{nextSession
											? formatDateTimeRange(
													nextSession.startsAt,
													nextSession.slot.startTime,
													nextSession.slot.endTime,
													i18n.language
												)
											: t('patients.profile.no-upcoming-session')}
									</DetailValue>
								</DetailItem>
								<DetailItem>
									<DetailLabel>
										{t('patients.profile.last-session')}
									</DetailLabel>
									<DetailValue>
										{lastSession
											? formatDateTimeRange(
													lastSession.startsAt,
													lastSession.slot.startTime,
													lastSession.slot.endTime,
													i18n.language
												)
											: t('patients.profile.no-completed-session')}
									</DetailValue>
								</DetailItem>
							</DetailGrid>

							<SessionList>
								{filteredTimelineSessions.length ? (
									filteredTimelineSessions.map((session) => (
										<SessionRow
											aria-label={t(
												'patients.profile.session-drawer.open-label',
												{
													date: formatDateTimeRange(
														session.startsAt,
														session.slot.startTime,
														session.slot.endTime,
														i18n.language
													),
												}
											)}
											isCancelled={session.isCancelled}
											key={`${session.date}-${session.slot._id}`}
											onClick={() => openSessionDrawer(session)}
											type='button'
										>
											<SessionMain>
												<SessionDate>
													<Calendar color='currentColor' />
													{formatDateTimeRange(
														session.startsAt,
														session.slot.startTime,
														session.slot.endTime,
														i18n.language
													)}
												</SessionDate>
												<SessionMeta>
													{session.slot.deliveryMode
														? t(
																`patients.profile.delivery.${session.slot.deliveryMode}`
															)
														: t('patients.profile.delivery.not-set')}
													{session.slot.address ? (
														<>
															{' · '}
															<MapPin color='currentColor' />
															{formatPatientAddress(
																session.slot.address,
																fallback
															)}
														</>
													) : null}
												</SessionMeta>
											</SessionMain>
											<SessionStatus
												isCancelled={session.isCancelled}
												isPast={session.isPast}
											>
												{renderSessionStatus(
													session.isCancelled,
													session.isPast
												)}
											</SessionStatus>
										</SessionRow>
									))
								) : (
									<EmptyPanel>
										<MutedValue>{t('patients.profile.no-sessions')}</MutedValue>
									</EmptyPanel>
								)}
							</SessionList>
						</SectionCard>
					</ContentGrid>
					<PatientEditForm
						onClose={() => setEditFormOpen(false)}
						open={editFormOpen}
						patient={patientDetails}
						therapistId={therapistId}
					/>
					{patientId && notificationSettingsOpen ? (
						<PatientNotificationSettingsDrawer
							isOpen={notificationSettingsOpen}
							onClose={() => setNotificationSettingsOpen(false)}
							patientId={patientId}
							therapistId={therapistId ?? ''}
						/>
					) : null}
					{selectedSession ? (
						<SessionDrawer
							initialMode={
								requestedDrawerMode === 'reschedule' ? 'reschedule' : 'details'
							}
							notifications={patientDetails?.notifications}
							onClose={handleSessionDrawerClose}
							onRescheduleSuccess={handleSessionDrawerClose}
							patientId={patientId ?? ''}
							patientName={patientName}
							publicSessionsLink={publicSessionsLink}
							session={selectedSession}
							therapistId={therapistId}
						/>
					) : null}
				</ProfileLayout>
			) : (
				<EmptyPanel>
					<MutedValue>{t('patients.profile.not-found')}</MutedValue>
				</EmptyPanel>
			)}
		</PageLayout>
	);
};

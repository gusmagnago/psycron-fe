import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
	WhatsApp,
} from '@psycron/components/icons';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
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
	const [editFormOpen, setEditFormOpen] = useState(false);
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
			session_status: session.isCancelled
				? 'cancelled'
				: session.isPast
					? 'past'
					: 'upcoming',
		});
		setSelectedSession(session);
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
								onClick={() => setTimelineFilter('all')}
								type='button'
							>
								<StatValue>{stats.totalSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.total')}</StatLabel>
							</StatCard>
							<StatCard
								aria-pressed={timelineFilter === 'upcoming'}
								isActive={timelineFilter === 'upcoming'}
								onClick={() => setTimelineFilter('upcoming')}
								type='button'
							>
								<StatValue>{stats.upcomingSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.upcoming')}</StatLabel>
							</StatCard>
							<StatCard
								aria-pressed={timelineFilter === 'completed'}
								isActive={timelineFilter === 'completed'}
								onClick={() => setTimelineFilter('completed')}
								type='button'
							>
								<StatValue>{stats.pastSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.completed')}</StatLabel>
							</StatCard>
							<StatCard
								aria-pressed={timelineFilter === 'cancelled'}
								isActive={timelineFilter === 'cancelled'}
								onClick={() => setTimelineFilter('cancelled')}
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
					{selectedSession ? (
						<SessionDrawer
							notifications={patientDetails?.notifications}
							onClose={() => setSelectedSession(null)}
							onRescheduleSuccess={() => setSelectedSession(null)}
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

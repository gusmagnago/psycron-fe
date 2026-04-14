import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Avatar } from '@psycron/components/avatar/Avatar';
import {
	Calendar,
	Mail,
	MapPin,
	Phone,
	WhatsApp,
} from '@psycron/components/icons';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { PATIENTS } from '@psycron/pages/urls';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	formatDateTimeRange,
	formatLocalizedDate,
	formatTimezoneLabel,
} from '@psycron/utils/date/date.utils';
import {
	formatPatientAddress,
	getPatientFullName,
} from '@psycron/utils/patient/patient.utils';

import {
	getLastCompletedSession,
	getNextSession,
	getPatientSessions,
	getPatientStats,
	getPreferredContactLabelKey,
	getRecentSessions,
} from '../PatientsPage.utils';

import {
	ContentGrid,
	DetailGrid,
	DetailItem,
	DetailLabel,
	DetailValue,
	EmptyPanel,
	HeroCard,
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
	const recentSessions = getRecentSessions(sessions);
	const status = patientDetails?.status ?? 'ACTIVE';
	const title = patientName || t('globals.patient');

	const renderSessionStatus = (
		isCancelled: boolean,
		isPast: boolean
	): string => {
		if (isCancelled) return t('patients.profile.sessions.cancelled');
		if (isPast) return t('patients.profile.sessions.completed');
		return t('patients.profile.sessions.upcoming');
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
								<StatusPill status={status}>
									{t(`patients.profile.status.${status.toLowerCase()}`)}
								</StatusPill>
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
										<ShortcutLink href={`tel:${patientDetails.contacts.phone}`}>
											<Phone color={palette.info.main} />
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
										>
											<WhatsApp color={palette.success.main} />
											{t('patients.profile.actions.whatsapp')}
										</ShortcutLink>
									) : null}
									{patientDetails.contacts?.email ? (
										<ShortcutLink href={`mailto:${patientDetails.contacts.email}`}>
											<Mail color={palette.secondary.main} />
											{t('patients.profile.actions.email')}
										</ShortcutLink>
									) : null}
								</ShortcutRow>
							</IdentityText>
						</IdentityCluster>

						<StatsGrid>
							<StatCard>
								<StatValue>{stats.totalSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.total')}</StatLabel>
							</StatCard>
							<StatCard>
								<StatValue>{stats.upcomingSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.upcoming')}</StatLabel>
							</StatCard>
							<StatCard>
								<StatValue>{stats.pastSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.completed')}</StatLabel>
							</StatCard>
							<StatCard>
								<StatValue>{stats.cancelledSessions}</StatValue>
								<StatLabel>{t('patients.profile.stats.cancelled')}</StatLabel>
							</StatCard>
						</StatsGrid>
					</HeroCard>

					<ContentGrid>
						<SectionCard>
							<SectionTitle>{t('patients.profile.sections.details')}</SectionTitle>
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
									<DetailLabel>{t('patients.list.columns.timezone')}</DetailLabel>
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
							<SectionTitle>{t('patients.profile.sections.timeline')}</SectionTitle>
							<DetailGrid>
								<DetailItem>
									<DetailLabel>{t('patients.profile.next-session')}</DetailLabel>
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
									<DetailLabel>{t('patients.profile.last-session')}</DetailLabel>
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
								{recentSessions.length ? (
									recentSessions.map((session) => (
										<SessionRow
											isCancelled={session.isCancelled}
											key={`${session.date}-${session.slot._id}`}
										>
											<SessionMain>
												<SessionDate>
													<Calendar color={palette.gray['05']} />
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
															<MapPin color={palette.gray['05']} />
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
										<MutedValue>
											{t('patients.profile.no-sessions')}
										</MutedValue>
									</EmptyPanel>
								)}
							</SessionList>
						</SectionCard>
					</ContentGrid>
				</ProfileLayout>
			) : (
				<EmptyPanel>
					<MutedValue>{t('patients.profile.not-found')}</MutedValue>
				</EmptyPanel>
			)}
		</PageLayout>
	);
};

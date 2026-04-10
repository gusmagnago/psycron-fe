import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { AddPatientForm } from '@psycron/components/form/AddPatient/AddPatientForm';
import { Google, Mail, Phone, WhatsApp } from '@psycron/components/icons';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { CONFLICTS } from '@psycron/pages/urls';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { usePatientListPageState } from './hooks/usePatientListPageState';
import {
	AddPatientAction,
	ControlField,
	ControlsBar,
	DuplicateWarningPill,
	EmptyBody,
	EmptyState,
	EmptyTitle,
	FieldGroup,
	FieldLabel,
	IconCell,
	MetaLabel,
	MobileCard,
	MobileCards,
	MobileCardTop,
	MobileMetaGrid,
	MobileMetaItem,
	PatientHeaderCell,
	PatientListLayout,
	PatientTableHeader,
	PatientTableRow,
	PatientTableSurface,
	PrimaryCell,
	PrimaryValue,
	SecondaryValue,
	SimpleValue,
	StatusPill,
	StyledMenuItem,
} from './PatientListPage.styles';

const getDateLocale = (language: string) => (language === 'pt' ? ptBR : enUS);

const formatPatientDate = (
	value: string | null,
	fallback: string,
	language: string
): string => {
	if (!value) return fallback;

	return format(new Date(value), 'PPP', {
		locale: getDateLocale(language),
	});
};

const formatTimezoneLabel = (
	timeZone: string | undefined,
	language: string,
	fallback: string
): string => {
	if (!timeZone) return fallback;

	try {
		const formatter = new Intl.DateTimeFormat(
			language === 'pt' ? 'pt-BR' : 'en-US',
			{
				timeZone,
				timeZoneName: 'longGeneric',
			}
		);
		const part = formatter
			.formatToParts(new Date())
			.find((item) => item.type === 'timeZoneName')?.value;

		return part || timeZone.replaceAll('_', ' ');
	} catch {
		return timeZone.replaceAll('_', ' ');
	}
};

const getPreferredContactIcon = (
	type: string | undefined,
	fallbackLabel: string
) => {
	switch (type) {
		case 'phone':
			return <Phone title={fallbackLabel} />;
		case 'whatsapp':
			return <WhatsApp title={fallbackLabel} />;
		case 'google_meet':
			return <Google title={fallbackLabel} />;
		case 'zoom':
			return <Mail title={fallbackLabel} />;
		default:
			return <Mail title={fallbackLabel} />;
	}
};

export const PatientListPage = () => {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const {
		duplicatePatientIds,
		filteredPatients,
		hasPatients,
		isDesktopTable,
		isLoading,
		openPatientProfile,
		searchQuery,
		setSearchQuery,
		setSortBy,
		setStatusFilter,
		sortBy,
		statusFilter,
	} = usePatientListPageState();

	const goToConflicts = (event: React.MouseEvent) => {
		event.stopPropagation();
		navigate(`/${locale}/${CONFLICTS}?type=PATIENT_DUPLICATE`);
	};

	const emptyTitle = hasPatients
		? t('patients.list.empty.filtered-title')
		: t('patients.list.empty.initial-title');
	const emptyBody = hasPatients
		? t('patients.list.empty.filtered-body')
		: t('patients.list.empty.initial-body');

	return (
		<PageLayout
			title={t('patients.list.title')}
			subTitle={t('patients.list.subtitle')}
			isLoading={isLoading}
		>
			<PatientListLayout>
				<ControlsBar>
					<FieldGroup>
						<FieldLabel>{t('patients.list.search-label')}</FieldLabel>
						<ControlField
							fullWidth
							placeholder={t('patients.list.search-placeholder')}
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
						/>
					</FieldGroup>

					<FieldGroup>
						<FieldLabel>{t('patients.list.status-label')}</FieldLabel>
						<ControlField
							select
							fullWidth
							value={statusFilter}
							onChange={(event) =>
								setStatusFilter(
									event.target.value as 'all' | 'active' | 'inactive'
								)
							}
						>
							<StyledMenuItem value='all'>
								{t('patients.list.status-all')}
							</StyledMenuItem>
							<StyledMenuItem value='active'>
								{t('patients.list.status-active')}
							</StyledMenuItem>
							<StyledMenuItem value='inactive'>
								{t('patients.list.status-inactive')}
							</StyledMenuItem>
						</ControlField>
					</FieldGroup>

					<FieldGroup>
						<FieldLabel>{t('patients.list.sort-label')}</FieldLabel>
						<ControlField
							select
							fullWidth
							value={sortBy}
							onChange={(event) =>
								setSortBy(
									event.target.value as
										| 'name-asc'
										| 'last-appointment-desc'
										| 'total-sessions-desc'
								)
							}
						>
							<StyledMenuItem value='name-asc'>
								{t('patients.list.sort-name')}
							</StyledMenuItem>
							<StyledMenuItem value='last-appointment-desc'>
								{t('patients.list.sort-last-appointment')}
							</StyledMenuItem>
							<StyledMenuItem value='total-sessions-desc'>
								{t('patients.list.sort-total-sessions')}
							</StyledMenuItem>
						</ControlField>
					</FieldGroup>

					<AddPatientAction>
						<AddPatientForm />
					</AddPatientAction>
				</ControlsBar>

				{filteredPatients.length ? (
					isDesktopTable ? (
						<PatientTableSurface>
							<PatientTableHeader>
								<PatientHeaderCell>
									{t('patients.list.columns.patient')}
								</PatientHeaderCell>
								<PatientHeaderCell>
									{t('patients.list.columns.contact')}
								</PatientHeaderCell>
								<PatientHeaderCell>
									{t('patients.list.columns.preferred-contact')}
								</PatientHeaderCell>
								<PatientHeaderCell>
									{t('patients.list.columns.timezone')}
								</PatientHeaderCell>
								<PatientHeaderCell>
									{t('patients.list.columns.last-appointment')}
								</PatientHeaderCell>
								<PatientHeaderCell>
									{t('patients.list.columns.sessions')}
								</PatientHeaderCell>
							</PatientTableHeader>

							{filteredPatients.map((patient) => (
								<PatientTableRow
									key={patient._id}
									type='button'
									onClick={() => openPatientProfile(patient._id)}
								>
									<PrimaryCell>
										<PrimaryValue>{patient.fullName}</PrimaryValue>
										<SecondaryValue>
											{patient.contacts?.email ||
												patient.contacts?.phone ||
												t('patients.list.not-available')}
										</SecondaryValue>
										{duplicatePatientIds.has(patient._id) ? (
											<DuplicateWarningPill onClick={goToConflicts} type='button'>
												{t('patients.list.possible-duplicate')}
											</DuplicateWarningPill>
										) : null}
									</PrimaryCell>
									<PrimaryCell>
										<SimpleValue>
											{patient.contacts?.phone ||
												t('patients.list.not-available')}
										</SimpleValue>
										<SecondaryValue>
											{patient.contacts?.email ||
												t('patients.list.not-available')}
										</SecondaryValue>
									</PrimaryCell>
									<IconCell>
										{getPreferredContactIcon(
											patient.preferredContactType,
											t('patients.list.columns.preferred-contact')
										)}
									</IconCell>
									<SimpleValue>
										{formatTimezoneLabel(
											patient.timeZone,
											i18n.language,
											t('patients.list.not-available')
										)}
									</SimpleValue>
									<SimpleValue>
										{formatPatientDate(
											patient.lastAppointmentDate,
											t('patients.list.no-appointments'),
											i18n.language
										)}
									</SimpleValue>
									<SimpleValue>{patient.totalSessions}</SimpleValue>
								</PatientTableRow>
							))}
						</PatientTableSurface>
					) : (
						<MobileCards>
							{filteredPatients.map((patient) => (
								<MobileCard
									key={patient._id}
									type='button'
									onClick={() => openPatientProfile(patient._id)}
								>
									<MobileCardTop>
										<PrimaryCell>
											<PrimaryValue>{patient.fullName}</PrimaryValue>
											<SecondaryValue>
												{patient.contacts?.email ||
													patient.contacts?.phone ||
													t('patients.list.not-available')}
											</SecondaryValue>
										</PrimaryCell>
										<Box display='flex' gap='4px' alignItems='center' flexWrap='wrap'>
											{duplicatePatientIds.has(patient._id) ? (
												<DuplicateWarningPill onClick={goToConflicts} type='button'>
													{t('patients.list.possible-duplicate')}
												</DuplicateWarningPill>
											) : null}
											<StatusPill active={patient.isActive}>
												{patient.isActive
													? t('patients.list.status-active')
													: t('patients.list.status-inactive')}
											</StatusPill>
										</Box>
									</MobileCardTop>

									<MobileMetaGrid>
										<MobileMetaItem>
											<MetaLabel>{t('patients.list.columns.contact')}</MetaLabel>
											<SimpleValue>
												{patient.contacts?.phone ||
													patient.contacts?.email ||
													t('patients.list.not-available')}
											</SimpleValue>
										</MobileMetaItem>
										<MobileMetaItem>
											<MetaLabel>
												{t('patients.list.columns.preferred-contact')}
											</MetaLabel>
											<Box display='flex' alignItems='center'>
												{getPreferredContactIcon(
													patient.preferredContactType,
													t('patients.list.columns.preferred-contact')
												)}
											</Box>
										</MobileMetaItem>
										<MobileMetaItem>
											<MetaLabel>{t('patients.list.columns.timezone')}</MetaLabel>
											<SimpleValue>
												{formatTimezoneLabel(
													patient.timeZone,
													i18n.language,
													t('patients.list.not-available')
												)}
											</SimpleValue>
										</MobileMetaItem>
										<MobileMetaItem>
											<MetaLabel>
												{t('patients.list.columns.last-appointment')}
											</MetaLabel>
											<SimpleValue>
												{formatPatientDate(
													patient.lastAppointmentDate,
													t('patients.list.no-appointments'),
													i18n.language
												)}
											</SimpleValue>
										</MobileMetaItem>
										<MobileMetaItem>
											<MetaLabel>{t('patients.list.columns.sessions')}</MetaLabel>
											<SimpleValue>{patient.totalSessions}</SimpleValue>
										</MobileMetaItem>
									</MobileMetaGrid>
								</MobileCard>
							))}
						</MobileCards>
					)
				) : (
					<EmptyState>
						<EmptyTitle>{emptyTitle}</EmptyTitle>
						<EmptyBody>{emptyBody}</EmptyBody>
						<Button
							type='button'
							tertiary
							variant='outlined'
							onClick={() => setSearchQuery('')}
							disabled={!hasPatients}
						>
							{t('patients.list.clear-search')}
						</Button>
					</EmptyState>
				)}
			</PatientListLayout>
		</PageLayout>
	);
};

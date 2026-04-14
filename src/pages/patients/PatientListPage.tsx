import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@psycron/components/button/Button';
import { AddPatientForm } from '@psycron/components/form/AddPatient/AddPatientForm';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { CONFLICTS } from '@psycron/pages/urls';
import {
	formatLocalizedDate,
	formatTimezoneLabel,
} from '@psycron/utils/date/date.utils';

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
	MobileCardBadges,
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
import { getPreferredContactIcon } from './PatientListPage.utils';

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
						<AddPatientForm shortButton={false} />
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
											<DuplicateWarningPill
												onClick={goToConflicts}
												type='button'
											>
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
										{getPreferredContactIcon(patient.preferredContactType)}
									</IconCell>
									<SimpleValue>
										{formatTimezoneLabel(
											patient.timeZone,
											i18n.language,
											t('patients.list.not-available')
										)}
									</SimpleValue>
									<SimpleValue>
										{formatLocalizedDate(
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
										<MobileCardBadges>
											{duplicatePatientIds.has(patient._id) ? (
												<DuplicateWarningPill
													onClick={goToConflicts}
													type='button'
												>
													{t('patients.list.possible-duplicate')}
												</DuplicateWarningPill>
											) : null}
											<StatusPill active={patient.isActive}>
												{patient.isActive
													? t('patients.list.status-active')
													: t('patients.list.status-inactive')}
											</StatusPill>
										</MobileCardBadges>
									</MobileCardTop>

									<MobileMetaGrid>
										<MobileMetaItem>
											<MetaLabel>
												{t('patients.list.columns.contact')}
											</MetaLabel>
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
											<IconCell>
												{getPreferredContactIcon(patient.preferredContactType)}
											</IconCell>
										</MobileMetaItem>
										<MobileMetaItem>
											<MetaLabel>
												{t('patients.list.columns.timezone')}
											</MetaLabel>
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
												{formatLocalizedDate(
													patient.lastAppointmentDate,
													t('patients.list.no-appointments'),
													i18n.language
												)}
											</SimpleValue>
										</MobileMetaItem>
										<MobileMetaItem>
											<MetaLabel>
												{t('patients.list.columns.sessions')}
											</MetaLabel>
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

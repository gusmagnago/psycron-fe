import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Tooltip } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { AddPatientForm } from '@psycron/components/form/AddPatient/AddPatientForm';
import { ChevronDown, ChevronUp } from '@psycron/components/icons';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { CONFLICTS } from '@psycron/pages/urls';
import {
	formatLocalizedDate,
	formatTimezoneLabel,
} from '@psycron/utils/date/date.utils';
import { getPatientBillingViewModel } from '@psycron/utils/patient/patient.utils';

import { usePatientListPageState } from './hooks/usePatientListPageState';
import {
	AddPatientAction,
	BillingCell,
	BillingSummary,
	BillingTooltipContent,
	BillingTooltipRow,
	CancellationNoticePill,
	ControlField,
	ControlsBar,
	DuplicateWarningPill,
	EmptyBody,
	EmptyState,
	EmptyTitle,
	FieldGroup,
	FieldLabel,
	IconCell,
	LoadMoreRow,
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
	SortableHeaderButton,
	SortIndicator,
	StatusPill,
	StyledMenuItem,
} from './PatientListPage.styles';
import { getPreferredContactIcon } from './PatientListPage.utils';
import type {
	PatientListSortDirection,
	PatientListSortField,
} from './PatientsPage.types';
import {
	decodePatientListSortValue,
	encodePatientListSortValue,
	getPatientListSortDefaultDirection,
	PATIENT_LIST_SORT_OPTIONS,
} from './PatientsPage.utils';

export const PatientListPage = () => {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const {
		duplicatePatientIds,
		fetchNextPage,
		filteredPatients,
		hasNextPage,
		isDesktopTable,
		isFetchingNextPage,
		isLoading,
		openPatientProfile,
		searchQuery,
		setSearchQuery,
		setSortDirection,
		setSortField,
		setStatusFilter,
		sortDirection,
		sortField,
		statusFilter,
	} = usePatientListPageState();

	const goToConflicts = (event: React.MouseEvent) => {
		event.stopPropagation();
		navigate(`/${locale}/${CONFLICTS}?type=PATIENT_DUPLICATE`);
	};

	const isFiltering = Boolean(searchQuery) || statusFilter !== 'all';
	const emptyTitle = isFiltering
		? t('patients.list.empty.filtered-title')
		: t('patients.list.empty.initial-title');
	const emptyBody = isFiltering
		? t('patients.list.empty.filtered-body')
		: t('patients.list.empty.initial-body');
	const sortValue = encodePatientListSortValue(sortField, sortDirection);
	const handleSortChange = (field: PatientListSortField) => {
		if (sortField === field) {
			setSortDirection((current: PatientListSortDirection) =>
				current === 'asc' ? 'desc' : 'asc'
			);
			return;
		}

		setSortField(field);
		setSortDirection(getPatientListSortDefaultDirection(field));
	};
	const renderSortableHeader = (field: PatientListSortField, label: string) => (
		<SortableHeaderButton
			isActive={sortField === field}
			onClick={() => handleSortChange(field)}
			id={`patients-sort-header-${field}`}
			data-testid={`patients-sort-header-${field}`}
			type='button'
		>
			{label}
			{sortField === field ? (
				<SortIndicator>
					{sortDirection === 'asc' ? <ChevronUp /> : <ChevronDown />}
				</SortIndicator>
			) : null}
		</SortableHeaderButton>
	);
	const renderBillingCell = (patient: (typeof filteredPatients)[number]) => {
		const billingViewModel = getPatientBillingViewModel(
			patient.billing,
			i18n.language,
			t
		);
		const tooltipContent = billingViewModel.isConfigured ? (
			<BillingTooltipContent>
				<BillingTooltipRow>
					<MetaLabel>{t('patients.profile.billing.model')}</MetaLabel>
					<SimpleValue>{billingViewModel.modelLabel}</SimpleValue>
				</BillingTooltipRow>
				<BillingTooltipRow>
					<MetaLabel>{t('patients.profile.billing.category')}</MetaLabel>
					<SimpleValue>{billingViewModel.categoryLabel}</SimpleValue>
				</BillingTooltipRow>
				<BillingTooltipRow>
					<MetaLabel>{t('patients.profile.billing.amount')}</MetaLabel>
					<SimpleValue>{billingViewModel.amountLabel}</SimpleValue>
				</BillingTooltipRow>
			</BillingTooltipContent>
		) : (
			t('patients.list.billing.none')
		);

		return (
			<Tooltip arrow placement='top' title={tooltipContent}>
				<BillingCell>
					<BillingSummary>
						<SimpleValue>{billingViewModel.summaryPrimary}</SimpleValue>
						{billingViewModel.summarySecondary ? (
							<SecondaryValue>
								{billingViewModel.summarySecondary}
							</SecondaryValue>
						) : null}
					</BillingSummary>
				</BillingCell>
			</Tooltip>
		);
	};
	const renderCancellationNotice = (
		patient: (typeof filteredPatients)[number]
	) => {
		if (patient.unresolvedCancelledSessions <= 0) return null;

		const label = t('patients.list.cancellation-follow-up-needed', {
			count: patient.unresolvedCancelledSessions,
		});

		return (
			<Tooltip
				arrow
				placement='top'
				title={t('patients.list.cancellation-follow-up-tooltip', {
					count: patient.unresolvedCancelledSessions,
				})}
			>
				<CancellationNoticePill aria-label={label}>
					{patient.unresolvedCancelledSessions}
				</CancellationNoticePill>
			</Tooltip>
		);
	};
	const renderCancellationStatus = (
		patient: (typeof filteredPatients)[number]
	) => {
		if (patient.unresolvedCancelledSessions > 0) {
			return renderCancellationNotice(patient);
		}

		if (patient.cancelledSessions > 0) {
			return (
				<SecondaryValue>
					{t('patients.list.cancellation-follow-up-resolved')}
				</SecondaryValue>
			);
		}

		return (
			<SecondaryValue>
				{t('patients.list.cancellation-follow-up-none')}
			</SecondaryValue>
		);
	};

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
							id='patients-search'
							data-testid='patients-search'
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
							id='patients-status-filter'
							data-testid='patients-status-filter'
							value={statusFilter}
							onChange={(event) =>
								setStatusFilter(
									event.target.value as 'all' | 'active' | 'inactive'
								)
							}
						>
							<StyledMenuItem value='all' data-testid='patients-status-all'>
								{t('patients.list.status-all')}
							</StyledMenuItem>
							<StyledMenuItem value='active' data-testid='patients-status-active'>
								{t('patients.list.status-active')}
							</StyledMenuItem>
							<StyledMenuItem
								value='inactive'
								data-testid='patients-status-inactive'
							>
								{t('patients.list.status-inactive')}
							</StyledMenuItem>
						</ControlField>
					</FieldGroup>

					<FieldGroup>
						<FieldLabel>{t('patients.list.sort-label')}</FieldLabel>
						<ControlField
							select
							fullWidth
							id='patients-sort'
							data-testid='patients-sort'
							value={sortValue}
							onChange={(event) => {
								const { direction: nextDirection, field: nextField } =
									decodePatientListSortValue(event.target.value);
								setSortField(nextField);
								setSortDirection(nextDirection);
							}}
						>
							{PATIENT_LIST_SORT_OPTIONS.map((option) => (
								<StyledMenuItem
									key={encodePatientListSortValue(
										option.field,
										option.direction
									)}
									data-testid={`patients-sort-${encodePatientListSortValue(
										option.field,
										option.direction
									)}`}
									value={encodePatientListSortValue(
										option.field,
										option.direction
									)}
								>
									{t(option.labelKey)}
								</StyledMenuItem>
							))}
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
									{renderSortableHeader(
										'name',
										t('patients.list.columns.patient')
									)}
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
									{t('patients.list.columns.billing')}
								</PatientHeaderCell>
								<PatientHeaderCell>
									{t('patients.list.columns.recovery')}
								</PatientHeaderCell>
								<PatientHeaderCell>
									{renderSortableHeader(
										'last-appointment',
										t('patients.list.columns.last-appointment')
									)}
								</PatientHeaderCell>
								<PatientHeaderCell>
									{renderSortableHeader(
										'total-sessions',
										t('patients.list.columns.sessions')
									)}
								</PatientHeaderCell>
							</PatientTableHeader>

							{filteredPatients.map((patient) => (
								<PatientTableRow
									key={patient._id}
									type='button'
									id={`patient-row-${patient._id}`}
									data-testid={`patient-row-${patient._id}`}
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
												data-testid={`patient-duplicate-${patient._id}`}
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
									{renderBillingCell(patient)}
									<PrimaryCell>{renderCancellationStatus(patient)}</PrimaryCell>
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
									id={`patient-card-${patient._id}`}
									data-testid={`patient-card-${patient._id}`}
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
													data-testid={`patient-duplicate-mobile-${patient._id}`}
												>
													{t('patients.list.possible-duplicate')}
												</DuplicateWarningPill>
											) : null}
											{renderCancellationNotice(patient)}
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
												{t('patients.list.columns.billing')}
											</MetaLabel>
											<Box>{renderBillingCell(patient)}</Box>
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
							id='patients-clear-search'
							data-testid='patients-clear-search'
							onClick={() => setSearchQuery('')}
							disabled={!isFiltering}
						>
							{t('patients.list.clear-search')}
						</Button>
					</EmptyState>
				)}

				{filteredPatients.length && hasNextPage ? (
					<LoadMoreRow>
						<Button
							type='button'
							secondary
							variant='outlined'
							id='patients-load-more'
							data-testid='patients-load-more'
							loading={isFetchingNextPage}
							onClick={() => fetchNextPage()}
						>
							{t('patients.list.load-more')}
						</Button>
					</LoadMoreRow>
				) : null}
			</PatientListLayout>
		</PageLayout>
	);
};

import type { KeyboardEvent, MouseEvent } from 'react';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { AddPatientForm } from '@psycron/components/form/AddPatient/AddPatientForm';
import {
	AlarmClock,
	CheckSuccess,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	Copy,
	Filter,
	Mail,
	Notifications,
	Patients,
	Phone,
	Settings,
	Wallet,
} from '@psycron/components/icons';
import {
	QueueFilterChip,
	QueueFiltersDrawer,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
} from '@psycron/components/queue-panel';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { CONFLICTS } from '@psycron/pages/urls';
import {
	formatLocalizedDate,
	formatTimezoneLabel,
} from '@psycron/utils/date/date.utils';
import { getPatientBillingViewModel } from '@psycron/utils/patient/patient.utils';

import { usePatientListPageState } from './hooks/usePatientListPageState';
import {
	ActionPill,
	AddPatientAction,
	BillingSummary,
	BillingTooltipContent,
	BillingTooltipRow,
	ColumnOption,
	ColumnsPanel,
	ColumnsWrapper,
	ContactIcon,
	ContactValue,
	ControlField,
	ControlsBar,
	EmptyBody,
	EmptyState,
	EmptyTitle,
	FieldGroup,
	FieldLabel,
	FloatingQueuesPanel,
	FloatingQueuesTrigger,
	FloatingQueuesTriggerCount,
	FloatingQueuesTriggerIcon,
	LoadMoreRow,
	MetaLabel,
	NextSessionValue,
	OpenAction,
	PatientCell,
	PatientHeaderCell,
	PatientListLayout,
	PatientSummary,
	PatientTable,
	PatientTableRow,
	PatientTableSurface,
	PrimaryValue,
	QueueCard,
	QueueCopy,
	QueueCount,
	QueueDescription,
	QueueIcon,
	QueueTitle,
	QueueTop,
	ResultsCount,
	ResultsHeader,
	ResultsHint,
	ResultsTitle,
	ResultsTitleGroup,
	SecondaryValue,
	SectionLabel,
	SectionLabelCopy,
	SectionPurpose,
	SectionTitle,
	SimpleValue,
	SortableHeaderButton,
	SortIndicator,
	StyledMenuItem,
	VisuallyHidden,
	WorkQueues,
	Workspace,
} from './PatientListPage.styles';
import {
	getPatientWorkspaceQueueCount,
	getPreferredContactIcon,
} from './PatientListPage.utils';
import type {
	PatientListSortDirection,
	PatientListSortField,
	PatientWorkQueueCard,
	PatientWorkspaceColumn,
	PatientWorkspaceQueue,
	PatientWorkspaceRow,
} from './PatientsPage.types';
import {
	decodePatientListSortValue,
	encodePatientListSortValue,
	getPatientListSortDefaultDirection,
	getPreferredContactLabelKey,
	PATIENT_LIST_SORT_OPTIONS,
} from './PatientsPage.utils';

const PATIENT_COLUMNS_STORAGE_KEY = '_psy_pc_v1';
const DEFAULT_VISIBLE_COLUMNS: PatientWorkspaceColumn[] = [
	'patient',
	'contact',
	'next-action',
	'next-session',
	'billing',
	'sessions',
];

const OPTIONAL_COLUMNS: Exclude<PatientWorkspaceColumn, 'patient'>[] = [
	'contact',
	'next-action',
	'next-session',
	'billing',
	'sessions',
];

const getInitialVisibleColumns = (): PatientWorkspaceColumn[] => {
	try {
		const storedValue = localStorage.getItem(PATIENT_COLUMNS_STORAGE_KEY);
		if (!storedValue) return DEFAULT_VISIBLE_COLUMNS;

		const parsedValue: unknown = JSON.parse(storedValue);
		if (!Array.isArray(parsedValue)) return DEFAULT_VISIBLE_COLUMNS;

		const validColumns = parsedValue.filter(
			(value): value is PatientWorkspaceColumn =>
				typeof value === 'string' &&
				DEFAULT_VISIBLE_COLUMNS.includes(value as PatientWorkspaceColumn)
		);

		return ['patient', ...validColumns.filter((value) => value !== 'patient')];
	} catch {
		return DEFAULT_VISIBLE_COLUMNS;
	}
};

export const PatientListPage = () => {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const [columnsOpen, setColumnsOpen] = useState(false);
	const [isFloatingQueuesOpen, setIsFloatingQueuesOpen] = useState(false);
	const [isWorkQueuesVisible, setIsWorkQueuesVisible] = useState(true);
	const workQueuesRef = useRef<HTMLElement | null>(null);
	const [visibleColumns, setVisibleColumns] = useState<
		PatientWorkspaceColumn[]
	>(getInitialVisibleColumns);
	const {
		fetchNextPage,
		filteredPatients,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isRefreshingResults,
		openPatientProfile,
		queue,
		searchQuery,
		setQueue,
		setSearchQuery,
		setSortDirection,
		setSortField,
		setStatusFilter,
		sortDirection,
		sortField,
		statusFilter,
		totalPatients,
		workspaceSummary,
	} = usePatientListPageState();

	useEffect(() => {
		localStorage.setItem(
			PATIENT_COLUMNS_STORAGE_KEY,
			JSON.stringify(visibleColumns)
		);
	}, [visibleColumns]);

	useEffect(() => {
		const workQueues = workQueuesRef.current;
		if (!workQueues || typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(([entry]) => {
			const isVisible = entry.isIntersecting;
			setIsWorkQueuesVisible(isVisible);
			if (isVisible) setIsFloatingQueuesOpen(false);
		});

		observer.observe(workQueues);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (
			workspaceSummary &&
			workspaceSummary.duplicate > 0 &&
			queue === 'contact'
		) {
			setQueue('duplicate');
		}
	}, [queue, setQueue, workspaceSummary]);

	useEffect(() => {
		if (
			workspaceSummary &&
			queue !== 'all' &&
			getPatientWorkspaceQueueCount(workspaceSummary, queue) === 0
		) {
			setQueue('all');
		}
	}, [queue, setQueue, workspaceSummary]);

	const visibleColumnSet = new Set(visibleColumns);
	const hasAuthoritativeQueues = Boolean(workspaceSummary);
	const isAllClear = workspaceSummary?.needsAttention === 0;
	const getQueueCount = (
		queueKey: Exclude<PatientWorkspaceQueue, 'all'>
	): number | undefined =>
		workspaceSummary
			? getPatientWorkspaceQueueCount(workspaceSummary, queueKey)
			: undefined;
	const fallbackQueueCard: PatientWorkQueueCard =
		workspaceSummary?.duplicate === 0
			? {
					clearDescriptionKey:
						'patients.list.queues.missing-contact-clear-description',
					count: getQueueCount('contact'),
					descriptionKey: 'patients.list.queues.missing-contact-description',
					icon: <Mail />,
					id: 'patients-queue-missing-contact',
					labelKey: 'patients.list.queues.missing-contact',
					queue: 'contact',
				}
			: {
					clearDescriptionKey:
						'patients.list.queues.duplicate-clear-description',
					count: getQueueCount('duplicate'),
					descriptionKey: 'patients.list.queues.duplicate-description',
					icon: <Copy />,
					id: 'patients-queue-duplicates',
					labelKey: 'patients.list.queues.duplicate',
					queue: 'duplicate',
				};
	const queues: PatientWorkQueueCard[] = [
		{
			clearDescriptionKey:
				'patients.list.queues.needs-attention-clear-description',
			count: getQueueCount('needs-attention'),
			descriptionKey: 'patients.list.queues.needs-attention-description',
			icon: <Patients />,
			id: 'patients-queue-needs-attention',
			labelKey: 'patients.list.queues.needs-attention',
			queue: 'needs-attention',
		},
		{
			clearDescriptionKey:
				'patients.list.queues.recovery-clear-description',
			count: getQueueCount('recovery'),
			descriptionKey: 'patients.list.queues.recovery-description',
			icon: <Notifications />,
			id: 'patients-queue-recovery',
			labelKey: 'patients.list.queues.recovery',
			queue: 'recovery',
		},
		{
			clearDescriptionKey:
				'patients.list.queues.billing-clear-description',
			count: getQueueCount('billing'),
			descriptionKey: 'patients.list.queues.billing-description',
			icon: <Wallet />,
			id: 'patients-queue-billing',
			labelKey: 'patients.list.queues.billing',
			queue: 'billing',
		},
		fallbackQueueCard,
	];
	const activeQueueLabel =
		queues.find((queueItem) => queueItem.queue === queue)?.labelKey ??
		'patients.list.results-title';
	const activeFilterCount = queue === 'all' ? 0 : 1;
	const closeFloatingQueues = (): void => {
		setIsFloatingQueuesOpen(false);
		requestAnimationFrame(() => {
			document
				.getElementById('patients-work-queues-floating-trigger')
				?.focus();
		});
	};
	const showAllPatients = (): void => {
		setQueue('all');
		setSearchQuery('');
		setStatusFilter('all');
	};
	const toggleQueue = (queueKey: PatientWorkQueueCard['queue']): void => {
		if (queue === queueKey) {
			showAllPatients();
			return;
		}
		setQueue(queueKey);
	};
	const selectFloatingQueue = (
		queueKey: PatientWorkspaceQueue
	): void => {
		if (queueKey === 'all') showAllPatients();
		else setQueue(queueKey);
		closeFloatingQueues();
	};

	const goToConflicts = (event: MouseEvent<HTMLElement>) => {
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

	const handleRowKeyDown = (
		event: KeyboardEvent<HTMLTableRowElement>,
		patientId: string
	) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openPatientProfile(patientId);
		}
	};

	const toggleColumn = (column: PatientWorkspaceColumn) => {
		setVisibleColumns((current) =>
			current.includes(column)
				? current.filter((value) => value !== column)
				: [...current, column]
		);
	};

	const renderBillingCell = (patient: PatientWorkspaceRow) => {
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
				<BillingSummary>
					<SimpleValue>{billingViewModel.summaryPrimary}</SimpleValue>
					{billingViewModel.summarySecondary ? (
						<SecondaryValue>{billingViewModel.summarySecondary}</SecondaryValue>
					) : null}
				</BillingSummary>
			</Tooltip>
		);
	};

	const renderNextSession = (patient: PatientWorkspaceRow) => {
		if (!patient.nextSessionDate) {
			return (
				<NextSessionValue data-state='none'>
					{t('patients.list.next-session.none')}
				</NextSessionValue>
			);
		}

		const formattedDate = formatLocalizedDate(
			patient.nextSessionDate,
			t('patients.list.next-session.none'),
			i18n.language,
			'PPp'
		);
		const minutesUntil = Math.max(
			0,
			Math.ceil(
				(new Date(patient.nextSessionDate).getTime() - Date.now()) / 60000
			)
		);
		const label =
			patient.nextSessionState === 'now'
				? t('patients.list.next-session.now')
				: patient.nextSessionState === 'approaching' ||
					  patient.nextSessionState === 'imminent'
					? t('patients.list.next-session.soon', {
							minutes: minutesUntil,
							time: formattedDate,
						})
					: formattedDate;

		return (
			<NextSessionValue data-state={patient.nextSessionState}>
				{patient.nextSessionState !== 'normal' ? <AlarmClock /> : null}
				{label}
			</NextSessionValue>
		);
	};

	return (
		<PageLayout
			title={t('patients.list.title')}
			subTitle={t('patients.list.subtitle')}
			isLoading={isLoading}
		>
			<PatientListLayout data-testid='patients-page'>
				<SectionLabel id='patients-queue-state-label'>
					<SectionLabelCopy>
						<SectionTitle>{t('patients.list.queues.label')}</SectionTitle>
						<SectionPurpose>
							{isAllClear
								? t('patients.list.queues.all-clear-purpose')
								: hasAuthoritativeQueues
									? t('patients.list.queues.purpose')
									: t('patients.list.queues.pending-purpose')}
						</SectionPurpose>
					</SectionLabelCopy>
				</SectionLabel>

				<WorkQueues
					id='patients-work-queues'
					data-testid='patients-work-queues'
					aria-label={t('patients.list.queues.label')}
					ref={workQueuesRef}
				>
					{queues.map((queueItem) => {
						const isClear = queueItem.count === 0;
						const isSelected = queue === queueItem.queue;
						const queueIcon = isClear ? <CheckSuccess /> : queueItem.icon;

						return (
							<QueueCard
								aria-label={
									isClear
										? t('patients.list.queues.all-clear-aria', {
												queue: t(queueItem.labelKey),
											})
										: isSelected
											? t('patients.list.queues.clear-filter', {
													queue: t(queueItem.labelKey),
												})
											: t('patients.list.queues.filter-by', {
													queue: t(queueItem.labelKey),
												})
								}
								aria-pressed={isSelected}
								data-action={
									isClear
										? 'queue-all-clear'
										: isSelected
											? 'show-all-patients'
											: 'filter-patients'
								}
								data-queue={queueItem.queue}
								data-state={isClear ? 'clear' : 'actionable'}
								data-testid={queueItem.id}
								disabled={isClear}
								id={queueItem.id}
								key={queueItem.queue}
								onClick={() => toggleQueue(queueItem.queue)}
								type='button'
							>
								<QueueIcon
									id={`${queueItem.id}-icon`}
									data-testid={`${queueItem.id}-icon`}
								>
									{cloneElement(queueIcon, {
										'data-testid': `${queueItem.id}-icon-svg`,
										id: `${queueItem.id}-icon-svg`,
									})}
								</QueueIcon>
								<QueueCopy
									id={`${queueItem.id}-copy`}
									data-testid={`${queueItem.id}-copy`}
								>
									<QueueTop
										id={`${queueItem.id}-header`}
										data-testid={`${queueItem.id}-header`}
									>
										<QueueTitle
											id={`${queueItem.id}-title`}
											data-testid={`${queueItem.id}-title`}
										>
											{t(queueItem.labelKey)}
										</QueueTitle>
										{queueItem.count !== undefined ? (
											<QueueCount
												id={`${queueItem.id}-count`}
												data-testid={`${queueItem.id}-count`}
											>
												{queueItem.count}
											</QueueCount>
										) : null}
									</QueueTop>
									<QueueDescription
										id={`${queueItem.id}-description`}
										data-testid={`${queueItem.id}-description`}
									>
										{t(
											isClear
												? queueItem.clearDescriptionKey
												: queueItem.descriptionKey
										)}
									</QueueDescription>
								</QueueCopy>
							</QueueCard>
						);
					})}
				</WorkQueues>

				<Workspace
					aria-label={t('patients.list.workspace-label')}
					data-testid='patients-workspace'
					id='patients-workspace'
				>
					<ControlsBar id='patients-workspace-controls'>
						<FieldGroup>
							<FieldLabel htmlFor='patients-workspace-search'>
								{t('patients.list.search-label')}
							</FieldLabel>
							<ControlField
								fullWidth
								id='patients-workspace-search'
								data-testid='patients-workspace-search'
								inputProps={{ autoComplete: 'off' }}
								placeholder={t('patients.list.search-placeholder')}
								type='search'
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
							/>
						</FieldGroup>

						<FieldGroup>
							<FieldLabel htmlFor='patients-workspace-status-filter'>
								{t('patients.list.status-label')}
							</FieldLabel>
							<ControlField
								select
								fullWidth
								id='patients-workspace-status-filter'
								data-testid='patients-workspace-status-filter'
								value={statusFilter}
								onChange={(event) =>
									setStatusFilter(
										event.target.value as 'all' | 'active' | 'inactive'
									)
								}
							>
								<StyledMenuItem
									value='all'
									data-testid='patients-workspace-status-option-all'
								>
									{t('patients.list.status-all')}
								</StyledMenuItem>
								<StyledMenuItem
									value='active'
									data-testid='patients-workspace-status-option-active'
								>
									{t('patients.list.status-active')}
								</StyledMenuItem>
								<StyledMenuItem
									value='inactive'
									data-testid='patients-workspace-status-option-inactive'
								>
									{t('patients.list.status-inactive')}
								</StyledMenuItem>
							</ControlField>
						</FieldGroup>

						<FieldGroup>
							<FieldLabel htmlFor='patients-workspace-sort'>
								{t('patients.list.sort-label')}
							</FieldLabel>
							<ControlField
								select
								fullWidth
								id='patients-workspace-sort'
								data-testid='patients-workspace-sort'
								value={sortValue}
								onChange={(event) => {
									const { direction, field } = decodePatientListSortValue(
										event.target.value
									);
									setSortField(field);
									setSortDirection(direction);
								}}
							>
								{PATIENT_LIST_SORT_OPTIONS.map((option, index) => {
									const optionValue = encodePatientListSortValue(
										option.field,
										option.direction
									);
									return (
										<StyledMenuItem
											data-testid={`patients-workspace-sort-option-${index + 1}`}
											key={optionValue}
											value={optionValue}
										>
											{t(option.labelKey)}
										</StyledMenuItem>
									);
								})}
							</ControlField>
						</FieldGroup>

						<ColumnsWrapper>
							<Button
								aria-controls='patients-workspace-columns-panel'
								aria-expanded={columnsOpen}
								id='patients-workspace-columns-trigger'
								data-testid='patients-workspace-columns-trigger'
								onClick={() => setColumnsOpen((current) => !current)}
								tertiary
								type='button'
								variant='outlined'
							>
								<Settings /> {t('patients.list.columns-control')}
							</Button>
							{columnsOpen ? (
								<ColumnsPanel
									id='patients-workspace-columns-panel'
									data-testid='patients-workspace-columns-panel'
								>
									{OPTIONAL_COLUMNS.map((column) => (
										<ColumnOption key={column}>
											<input
												checked={visibleColumnSet.has(column)}
												data-testid={`patients-workspace-column-toggle-${column}`}
												onChange={() => toggleColumn(column)}
												type='checkbox'
											/>
											{t(`patients.list.columns.${column}`)}
										</ColumnOption>
									))}
								</ColumnsPanel>
							) : null}
						</ColumnsWrapper>

						<AddPatientAction>
							<AddPatientForm
								buttonId='patients-add-action'
								buttonTestId='patients-add-action'
								shortButton={false}
							/>
						</AddPatientAction>
					</ControlsBar>

					<ResultsHeader>
						<ResultsTitleGroup>
							<ResultsTitle id='patients-workspace-results-title'>
								{t(activeQueueLabel)}
							</ResultsTitle>
							<ResultsCount data-testid='patients-workspace-results-count'>
								{totalPatients}
							</ResultsCount>
						</ResultsTitleGroup>
						<ResultsHint>{t('patients.list.results-hint')}</ResultsHint>
						{isRefreshingResults ? (
							<VisuallyHidden aria-live='polite'>
								{t('patients.list.updating-results')}
							</VisuallyHidden>
						) : null}
					</ResultsHeader>

					<PatientTableSurface
						aria-busy={isRefreshingResults}
						data-refreshing={isRefreshingResults}
						id='patients-workspace-results'
						data-testid='patients-workspace-results'
					>
						{filteredPatients.length ? (
							<PatientTable
								aria-labelledby='patients-workspace-results-title'
								id='patients-workspace-table'
								data-testid='patients-workspace-table'
							>
								<thead>
									<tr>
										<PatientHeaderCell
											aria-sort={
												sortField === 'name'
													? sortDirection === 'asc'
														? 'ascending'
														: 'descending'
													: 'none'
											}
											data-testid='patients-workspace-column-patient'
										>
											<SortableHeaderButton
												id='patients-workspace-sort-patient'
												data-testid='patients-workspace-sort-patient'
												onClick={() => handleSortChange('name')}
												type='button'
											>
												{t('patients.list.columns.patient')}
												{sortField === 'name' ? (
													<SortIndicator>
														{sortDirection === 'asc' ? (
															<ChevronUp />
														) : (
															<ChevronDown />
														)}
													</SortIndicator>
												) : null}
											</SortableHeaderButton>
										</PatientHeaderCell>
										{visibleColumnSet.has('contact') ? (
											<PatientHeaderCell data-testid='patients-workspace-column-contact'>
												{t('patients.list.columns.contact')}
											</PatientHeaderCell>
										) : null}
										{visibleColumnSet.has('next-action') ? (
											<PatientHeaderCell data-testid='patients-workspace-column-next-action'>
												{t('patients.list.columns.next-action')}
											</PatientHeaderCell>
										) : null}
										{visibleColumnSet.has('next-session') ? (
											<PatientHeaderCell data-testid='patients-workspace-column-next-session'>
												{t('patients.list.columns.next-session')}
											</PatientHeaderCell>
										) : null}
										{visibleColumnSet.has('billing') ? (
											<PatientHeaderCell data-testid='patients-workspace-column-billing'>
												{t('patients.list.columns.billing')}
											</PatientHeaderCell>
										) : null}
										{visibleColumnSet.has('sessions') ? (
											<PatientHeaderCell
												aria-sort={
													sortField === 'total-sessions'
														? sortDirection === 'asc'
															? 'ascending'
															: 'descending'
														: 'none'
												}
												data-testid='patients-workspace-column-sessions'
											>
												<SortableHeaderButton
													id='patients-workspace-sort-sessions'
													data-testid='patients-workspace-sort-sessions'
													onClick={() => handleSortChange('total-sessions')}
													type='button'
												>
													{t('patients.list.columns.sessions')}
													{sortField === 'total-sessions' ? (
														<SortIndicator>
															{sortDirection === 'asc' ? (
																<ChevronUp />
															) : (
																<ChevronDown />
															)}
														</SortIndicator>
													) : null}
												</SortableHeaderButton>
											</PatientHeaderCell>
										) : null}
										<PatientHeaderCell data-testid='patients-workspace-column-open'>
											<VisuallyHidden>{t('patients.list.open')}</VisuallyHidden>
										</PatientHeaderCell>
									</tr>
								</thead>
								<tbody data-testid='patients-workspace-table-body'>
									{filteredPatients.map((patient) => {
										const rowTestId = `patients-workspace-row-${patient.uiRowKey}`;
										const contactValue =
											patient.contacts?.phone ||
											patient.contacts?.email ||
											patient.contacts?.whatsapp;
										return (
											<PatientTableRow
												aria-label={t('patients.list.open-workflow', {
													patient: patient.fullName,
												})}
												data-testid={rowTestId}
												id={rowTestId}
												key={patient._id}
												onClick={() => openPatientProfile(patient._id)}
												onKeyDown={(event) =>
													handleRowKeyDown(event, patient._id)
												}
												tabIndex={0}
											>
												<PatientCell
													data-column='patient'
													data-label={t('patients.list.columns.patient')}
													data-testid={`${rowTestId}-patient`}
												>
													<PatientSummary
														data-testid={`${rowTestId}-patient-summary`}
													>
														<PrimaryValue>{patient.fullName}</PrimaryValue>
														<SecondaryValue>
															{t(
																getPreferredContactLabelKey(
																	patient.preferredContactType
																)
															)}{' '}
															·{' '}
															{formatTimezoneLabel(
																patient.timeZone,
																i18n.language,
																t('patients.list.not-available')
															)}
														</SecondaryValue>
													</PatientSummary>
												</PatientCell>
												{visibleColumnSet.has('contact') ? (
													<PatientCell
														data-column='contact'
														data-label={t('patients.list.columns.contact')}
														data-testid={`${rowTestId}-contact`}
													>
														<ContactValue
															data-missing={!patient.hasContact}
															data-testid={`${rowTestId}-contact-value`}
															role={!patient.hasContact ? 'status' : undefined}
															aria-label={
																!patient.hasContact
																	? t('patients.list.contact-missing-aria')
																	: undefined
															}
														>
															<ContactIcon>
																{patient.hasContact ? (
																	getPreferredContactIcon(
																		patient.preferredContactType
																	)
																) : (
																	<Phone />
																)}
															</ContactIcon>
															<span>
																{contactValue ||
																	t('patients.list.contact-missing')}
															</span>
														</ContactValue>
													</PatientCell>
												) : null}
												{visibleColumnSet.has('next-action') ? (
													<PatientCell
														data-column='next-action'
														data-label={t('patients.list.columns.next-action')}
														data-testid={`${rowTestId}-next-action`}
													>
														<ActionPill
															data-action={patient.nextAction}
															data-testid={`${rowTestId}-next-action-status`}
															id={`${rowTestId}-next-action-status`}
															onClick={(event) => {
																event.stopPropagation();
																if (patient.nextAction === 'review-duplicate')
																	goToConflicts(event);
																else openPatientProfile(patient._id);
															}}
															type='button'
														>
															{t(
																`patients.list.next-actions.${patient.nextAction}`
															)}
														</ActionPill>
													</PatientCell>
												) : null}
												{visibleColumnSet.has('next-session') ? (
													<PatientCell
														data-column='next-session'
														data-label={t('patients.list.columns.next-session')}
														data-testid={`${rowTestId}-next-session`}
													>
														{renderNextSession(patient)}
													</PatientCell>
												) : null}
												{visibleColumnSet.has('billing') ? (
													<PatientCell
														data-column='billing'
														data-label={t('patients.list.columns.billing')}
														data-testid={`${rowTestId}-billing`}
													>
														{renderBillingCell(patient)}
													</PatientCell>
												) : null}
												{visibleColumnSet.has('sessions') ? (
													<PatientCell
														data-column='sessions'
														data-label={t('patients.list.columns.sessions')}
														data-testid={`${rowTestId}-sessions`}
													>
														<SimpleValue>{patient.totalSessions}</SimpleValue>
													</PatientCell>
												) : null}
												<PatientCell
													data-column='open'
													data-testid={`${rowTestId}-open`}
												>
													<OpenAction
														aria-label={t('patients.list.open-workflow', {
															patient: patient.fullName,
														})}
														data-testid={`${rowTestId}-open-action`}
														id={`${rowTestId}-open-action`}
														onClick={(event) => {
															event.stopPropagation();
															openPatientProfile(patient._id);
														}}
														type='button'
													>
														<ChevronRight />
													</OpenAction>
												</PatientCell>
											</PatientTableRow>
										);
									})}
								</tbody>
							</PatientTable>
						) : (
							<EmptyState aria-live='polite'>
								<EmptyTitle>{emptyTitle}</EmptyTitle>
								<EmptyBody>{emptyBody}</EmptyBody>
								<Button
									id='patients-workspace-clear-search'
									data-testid='patients-workspace-clear-search'
									disabled={!isFiltering}
									onClick={() => setSearchQuery('')}
									tertiary
									type='button'
									variant='outlined'
								>
									{t('patients.list.clear-search')}
								</Button>
							</EmptyState>
						)}
					</PatientTableSurface>

					{filteredPatients.length && hasNextPage ? (
						<LoadMoreRow>
							<Button
								id='patients-workspace-load-more'
								data-testid='patients-workspace-load-more'
								loading={isFetchingNextPage}
								onClick={() => fetchNextPage()}
								secondary
								type='button'
								variant='outlined'
							>
								{t('patients.list.load-more')}
							</Button>
						</LoadMoreRow>
					) : null}
				</Workspace>

				{!isWorkQueuesVisible ? (
					<FloatingQueuesTrigger
						aria-controls='patients-work-queues-floating-panel'
						aria-expanded={isFloatingQueuesOpen}
						aria-haspopup='dialog'
						aria-label={t('patients.list.queues.floating-trigger-aria', {
							count: activeFilterCount,
						})}
						data-testid='patients-work-queues-floating-trigger'
						data-action='open-queue-filters'
						id='patients-work-queues-floating-trigger'
						onClick={() => setIsFloatingQueuesOpen(true)}
						tertiary
						type='button'
					>
						<FloatingQueuesTriggerIcon
							data-testid='patients-work-queues-floating-trigger-icon'
							id='patients-work-queues-floating-trigger-icon'
						>
							<Filter />
						</FloatingQueuesTriggerIcon>
						{t('patients.list.queues.floating-trigger')}
						{activeFilterCount ? (
							<FloatingQueuesTriggerCount
								data-testid='patients-work-queues-floating-trigger-count'
								id='patients-work-queues-floating-trigger-count'
							>
								{totalPatients}
							</FloatingQueuesTriggerCount>
						) : null}
					</FloatingQueuesTrigger>
				) : null}

				<QueueFiltersDrawer
					activeFilterCount={activeFilterCount}
					ariaLabel={t('patients.list.queues.floating-panel-title')}
					isOpen={isFloatingQueuesOpen}
					onClose={closeFloatingQueues}
					summaryActive={t(
						'patients.list.queues.floating-panel-summary-active',
						{
							queue: t(activeQueueLabel),
						}
					)}
					summaryDefault={t(
						'patients.list.queues.floating-panel-summary-default'
					)}
					title={t('patients.list.queues.floating-panel-title')}
				>
					<FloatingQueuesPanel
						data-testid='patients-work-queues-floating-panel'
						id='patients-work-queues-floating-panel'
					>
						<QueueFiltersSection
							data-testid='patients-work-queues-floating-current-view'
							id='patients-work-queues-floating-current-view'
						>
							<QueueFiltersLabel
								data-testid='patients-work-queues-floating-current-view-label'
								id='patients-work-queues-floating-current-view-label'
							>
								{t('patients.list.queues.floating-panel-show')}
							</QueueFiltersLabel>
							<QueueFiltersRow>
								<QueueFilterChip
									data-action='show-all-patients'
									data-testid='patients-work-queues-floating-show-all'
									id='patients-work-queues-floating-show-all'
									isActive={queue === 'all'}
									onClick={() => selectFloatingQueue('all')}
									type='button'
								>
									{t('patients.list.queues.floating-show-all')}
								</QueueFilterChip>
							</QueueFiltersRow>
						</QueueFiltersSection>

						<QueueFiltersSection
							data-testid='patients-work-queues-floating-options'
							id='patients-work-queues-floating-options'
						>
							<QueueFiltersLabel
								data-testid='patients-work-queues-floating-options-label'
								id='patients-work-queues-floating-options-label'
							>
								{t('patients.list.queues.floating-panel-filter')}
							</QueueFiltersLabel>
							<QueueFiltersRow>
								{queues.map((queueItem) => (
									<QueueFilterChip
										aria-label={t(
											queueItem.count === 0
												? 'patients.list.queues.all-clear-aria'
												: 'patients.list.queues.filter-by',
											{ queue: t(queueItem.labelKey) }
										)}
										data-state={
											queueItem.count === 0 ? 'clear' : 'actionable'
										}
										data-action={
											queueItem.count === 0
												? 'queue-all-clear'
												: 'filter-patients'
										}
										data-testid={`patients-work-queues-floating-filter-${queueItem.queue}`}
										disabled={queueItem.count === 0}
										id={`patients-work-queues-floating-filter-${queueItem.queue}`}
										isActive={queue === queueItem.queue}
										key={queueItem.queue}
										onClick={() =>
											selectFloatingQueue(queueItem.queue)
										}
										type='button'
									>
										{t(queueItem.labelKey)} · {queueItem.count ?? '—'}
									</QueueFilterChip>
								))}
							</QueueFiltersRow>
						</QueueFiltersSection>
					</FloatingQueuesPanel>
				</QueueFiltersDrawer>
			</PatientListLayout>
		</PageLayout>
	);
};

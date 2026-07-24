import type { KeyboardEvent, MouseEvent } from 'react';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { InputAdornment, Tooltip } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { AddPatientForm } from '@psycron/components/form/AddPatient/AddPatientForm';
import {
	AlarmClock,
	CheckSuccess,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	Filter,
	Phone,
	Search,
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
import { useReducedMotion } from 'framer-motion';
import {
	ArrowUpDown,
	BookUser,
	Columns3Cog,
	Copy,
	FileExclamationPoint,
	Funnel,
	Minus,
	Plus,
	ReceiptText,
	ScanEye,
} from 'lucide-react';

import { usePatientListPageState } from './hooks/usePatientListPageState';
import { PatientWorkflowDrawer } from './patient-workflow-drawer/PatientWorkflowDrawer';
import {
	patientCardScrollVariants,
	patientCardScrollViewport,
} from './PatientListPage.motion';
import {
	ActionPill,
	AddPatientAction,
	BillingSummary,
	BillingTooltipContent,
	BillingTooltipRow,
	ColumnFilterContent,
	ColumnFilterLabel,
	ColumnFilterPopover,
	ColumnOption,
	ColumnsPanel,
	ColumnsPanelTitle,
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
	FloatingQueuesTriggerIcon,
	HeaderControl,
	HeaderFilterButton,
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
	QueueCollapseContent,
	QueueCollapseRegion,
	QueueCopy,
	QueueCount,
	QueueDescription,
	QueueIcon,
	QueueSection,
	QueueTitle,
	QueueTop,
	QueueVisibilityIcon,
	QueueVisibilityToggle,
	ResultsCount,
	ResultsHeader,
	ResultsHint,
	ResultsTitle,
	ResultsTitleGroup,
	SecondaryValue,
	SectionLabel,
	SectionLabelCopy,
	SectionLabelDivider,
	SectionPurpose,
	SectionTitle,
	SimpleValue,
	SortableHeaderButton,
	SortIndicator,
	StyledMenuItem,
	VisuallyHidden,
	WorkQueues,
	Workspace,
	WorkspaceControlsContent,
	WorkspaceControlsHeader,
	WorkspaceControlsRegion,
	WorkspaceControlsSection,
	WorkspaceControlsTitle,
} from './PatientListPage.styles';
import {
	getPatientWorkspaceQueueCount,
	getPreferredContactIcon,
} from './PatientListPage.utils';
import type {
	PatientListSortDirection,
	PatientWorkQueueCard,
	PatientWorkspaceColumn,
	PatientWorkspaceColumnFilterOption,
	PatientWorkspaceFilterableColumn,
	PatientWorkspaceQueue,
	PatientWorkspaceRow,
	PatientWorkspaceSortState,
} from './PatientsPage.types';
import {
	decodePatientListSortValue,
	encodePatientListSortValue,
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
	const [columnFilterAnchor, setColumnFilterAnchor] =
		useState<HTMLButtonElement | null>(null);
	const [columnFilters, setColumnFilters] = useState<
		Partial<Record<PatientWorkspaceFilterableColumn, string>>
	>({});
	const [filterColumn, setFilterColumn] =
		useState<PatientWorkspaceFilterableColumn | null>(null);
	const [isFloatingQueuesOpen, setIsFloatingQueuesOpen] = useState(false);
	const [isWorkspaceControlsExpanded, setIsWorkspaceControlsExpanded] =
		useState(true);
	const [isWorkQueuesExpanded, setIsWorkQueuesExpanded] = useState(true);
	const [isWorkQueuesVisible, setIsWorkQueuesVisible] = useState(true);
	const [selectedPatient, setSelectedPatient] =
		useState<PatientWorkspaceRow | null>(null);
	const [workspaceSort, setWorkspaceSort] =
		useState<PatientWorkspaceSortState>({
			column: 'patient',
			direction: 'asc',
		});
	const workQueueSectionRef = useRef<HTMLElement | null>(null);
	const [visibleColumns, setVisibleColumns] = useState<
		PatientWorkspaceColumn[]
	>(getInitialVisibleColumns);
	const {
		fetchNextPage,
		filteredPatients,
		hasNextPage,
		isDesktopTable,
		isMobile,
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
	const prefersReducedMotion = useReducedMotion();
	const shouldAnimatePatientCards = isMobile && !prefersReducedMotion;

	useEffect(() => {
		localStorage.setItem(
			PATIENT_COLUMNS_STORAGE_KEY,
			JSON.stringify(visibleColumns)
		);
	}, [visibleColumns]);

	useEffect(() => {
		const workQueueSection = workQueueSectionRef.current;
		if (!workQueueSection || typeof IntersectionObserver === 'undefined')
			return;

		const observer = new IntersectionObserver(([entry]) => {
			const isVisible = entry.isIntersecting;
			setIsWorkQueuesVisible(isVisible);
			if (isVisible) setIsFloatingQueuesOpen(false);
		});

		observer.observe(workQueueSection);
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
					icon: <BookUser />,
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
			icon: <FileExclamationPoint />,
			id: 'patients-queue-needs-attention',
			labelKey: 'patients.list.queues.needs-attention',
			queue: 'needs-attention',
		},
		{
			clearDescriptionKey:
				'patients.list.queues.recovery-clear-description',
			count: getQueueCount('recovery'),
			descriptionKey: 'patients.list.queues.recovery-description',
			icon: <ScanEye />,
			id: 'patients-queue-recovery',
			labelKey: 'patients.list.queues.recovery',
			queue: 'recovery',
		},
		{
			clearDescriptionKey:
				'patients.list.queues.billing-clear-description',
			count: getQueueCount('billing'),
			descriptionKey: 'patients.list.queues.billing-description',
			icon: <ReceiptText />,
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
		setColumnFilters({});
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
	const closePatientWorkflow = (): void => {
		setSelectedPatient(null);
	};
	const openPatientWorkflow = (patient: PatientWorkspaceRow): void => {
		setSelectedPatient(patient);
	};
	const openSelectedPatientProfile = (patientId: string): void => {
		closePatientWorkflow();
		openPatientProfile(patientId);
	};
	const completePatientNextAction = (
		patient: PatientWorkspaceRow
	): void => {
		closePatientWorkflow();
		if (patient.nextAction === 'review-duplicate') {
			navigate(`/${locale}/${CONFLICTS}?type=PATIENT_DUPLICATE`);
			return;
		}
		openPatientProfile(patient._id);
	};

	const activeColumnFilterCount = Object.values(columnFilters).filter(
		Boolean
	).length;
	const isFiltering =
		Boolean(searchQuery) ||
		statusFilter !== 'all' ||
		activeColumnFilterCount > 0;
	const emptyTitle = isFiltering
		? t('patients.list.empty.filtered-title')
		: t('patients.list.empty.initial-title');
	const emptyBody = isFiltering
		? t('patients.list.empty.filtered-body')
		: t('patients.list.empty.initial-body');
	const sortValue = encodePatientListSortValue(sortField, sortDirection);

	const getColumnFilterOption = (
		patient: PatientWorkspaceRow,
		column: PatientWorkspaceColumn
	): PatientWorkspaceColumnFilterOption => {
		switch (column) {
			case 'billing': {
				const billing = getPatientBillingViewModel(
					patient.billing,
					i18n.language,
					t
				);
				const label = [billing.summaryPrimary, billing.summarySecondary]
					.filter(Boolean)
					.join(' ');
				return { label, value: label.toLocaleLowerCase(i18n.language) };
			}
			case 'contact': {
				const contact =
					patient.contacts?.phone ||
					patient.contacts?.email ||
					patient.contacts?.whatsapp ||
					t('patients.list.contact-missing');
				return {
					label: contact,
					value: contact.toLocaleLowerCase(i18n.language),
				};
			}
			case 'next-action':
				return {
					label: t(`patients.list.next-actions.${patient.nextAction}`),
					value: patient.nextAction,
				};
			case 'next-session': {
				const label = patient.nextSessionDate
					? formatLocalizedDate(
							patient.nextSessionDate,
							t('patients.list.next-session.none'),
							i18n.language,
							'PPp'
						)
					: t('patients.list.next-session.none');
				return {
					label,
					value: patient.nextSessionDate ?? 'none',
				};
			}
			case 'sessions':
				return {
					label: String(patient.totalSessions),
					value: String(patient.totalSessions),
				};
			case 'patient':
			default:
				return {
					label: patient.fullName,
					value: patient.fullName.toLocaleLowerCase(i18n.language),
				};
		}
	};

	const getColumnSortValue = (
		patient: PatientWorkspaceRow,
		column: PatientWorkspaceColumn
	): number | string => {
		if (column === 'sessions') return patient.totalSessions;
		if (column === 'next-session') {
			return patient.nextSessionDate
				? new Date(patient.nextSessionDate).getTime()
				: Number.MAX_SAFE_INTEGER;
		}
		return getColumnFilterOption(patient, column).label;
	};

	const workspacePatients = filteredPatients
		.filter((patient) =>
			DEFAULT_VISIBLE_COLUMNS.every((column) => {
				if (column === 'sessions') return true;
				const selectedValue = columnFilters[column];
				return (
					!selectedValue ||
					getColumnFilterOption(patient, column).value === selectedValue
				);
			})
		)
		.sort((firstPatient, secondPatient) => {
			const firstValue = getColumnSortValue(
				firstPatient,
				workspaceSort.column
			);
			const secondValue = getColumnSortValue(
				secondPatient,
				workspaceSort.column
			);
			const comparison =
				typeof firstValue === 'number' && typeof secondValue === 'number'
					? firstValue - secondValue
					: String(firstValue).localeCompare(String(secondValue), i18n.language, {
							numeric: true,
							sensitivity: 'base',
						});
			return workspaceSort.direction === 'asc' ? comparison : -comparison;
		});

	const columnFilterOptions: PatientWorkspaceColumnFilterOption[] =
		filterColumn
			? Array.from(
					new Map(
						filteredPatients.map((patient) => {
							const option = getColumnFilterOption(patient, filterColumn);
							return [option.value, option] as const;
						})
					).values()
				).sort((firstOption, secondOption) =>
					firstOption.label.localeCompare(
						secondOption.label,
						i18n.language,
						{
							numeric: true,
							sensitivity: 'base',
						}
					)
				)
			: [];

	const handleWorkspaceSortChange = (
		column: PatientWorkspaceColumn
	): void => {
		const direction: PatientListSortDirection =
			workspaceSort.column === column && workspaceSort.direction === 'asc'
				? 'desc'
				: 'asc';
		setWorkspaceSort({ column, direction });

		if (column === 'patient') {
			setSortField('name');
			setSortDirection(direction);
		}
		if (column === 'sessions') {
			setSortField('total-sessions');
			setSortDirection(direction);
		}
	};

	const openColumnFilter = (
		event: MouseEvent<HTMLButtonElement>,
		column: PatientWorkspaceFilterableColumn
	): void => {
		event.stopPropagation();
		setColumnFilterAnchor(event.currentTarget);
		setFilterColumn(column);
	};

	const closeColumnFilter = (): void => {
		setColumnFilterAnchor(null);
		setFilterColumn(null);
	};

	const updateColumnFilter = (value: string): void => {
		if (!filterColumn) return;
		setColumnFilters((current) => ({
			...current,
			[filterColumn]: value || undefined,
		}));
		closeColumnFilter();
	};
	const toggleWorkspaceControls = (): void => {
		setIsWorkspaceControlsExpanded((current) => {
			if (current) setColumnsOpen(false);
			return !current;
		});
	};

	const handleRowKeyDown = (
		event: KeyboardEvent<HTMLTableRowElement>,
		patient: PatientWorkspaceRow
	) => {
		if (event.target !== event.currentTarget) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openPatientWorkflow(patient);
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
				<BillingSummary data-configured={billingViewModel.isConfigured}>
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
			actions={
				<AddPatientAction
					id='patients-page-actions'
					data-testid='patients-page-actions'
				>
					<AddPatientForm
						buttonId='patients-add-action'
						buttonTestId='patients-add-action'
						shortButton
					/>
				</AddPatientAction>
			}
			idPrefix='patients-page'
			title={t('patients.list.title')}
			subTitle={t('patients.list.subtitle')}
			isLoading={isLoading}
		>
			<PatientListLayout data-testid='patients-page'>
				<QueueSection
					data-testid='patients-queue-state-label'
					id='patients-queue-state-label'
					ref={workQueueSectionRef}
				>
					<SectionLabel
						data-testid='patients-queue-state-header'
						id='patients-queue-state-header'
					>
						<SectionLabelCopy
							data-testid='patients-queue-state-copy'
							id='patients-queue-state-copy'
						>
							<SectionTitle
								data-testid='patients-queue-state-title'
								id='patients-queue-state-title'
							>
								{t('patients.list.queues.label')}
							</SectionTitle>
							<SectionPurpose
								data-testid='patients-queue-state-purpose'
								id='patients-queue-state-purpose'
							>
								{isAllClear
									? t('patients.list.queues.all-clear-purpose')
									: hasAuthoritativeQueues
										? t('patients.list.queues.purpose')
										: t('patients.list.queues.pending-purpose')}
							</SectionPurpose>
						</SectionLabelCopy>
						<SectionLabelDivider
							aria-hidden='true'
							data-testid='patients-queue-state-divider'
							id='patients-queue-state-divider'
						/>
						<QueueVisibilityToggle
							aria-controls='patients-work-queues'
							aria-expanded={isWorkQueuesExpanded}
							aria-label={t(
								isWorkQueuesExpanded
									? 'common.layout.collapse-queue'
									: 'common.layout.expand-queue'
							)}
							data-action={
								isWorkQueuesExpanded
									? 'collapse-work-queues'
									: 'expand-work-queues'
							}
							data-testid='patients-work-queues-toggle'
							id='patients-work-queues-toggle'
							onClick={() =>
								setIsWorkQueuesExpanded((current) => !current)
							}
							type='button'
						>
							<QueueVisibilityIcon
								data-expanded={isWorkQueuesExpanded}
								data-testid='patients-work-queues-toggle-icon'
								id='patients-work-queues-toggle-icon'
							>
								{isWorkQueuesExpanded ? <Minus /> : <Plus />}
							</QueueVisibilityIcon>
						</QueueVisibilityToggle>
					</SectionLabel>

					<QueueCollapseRegion
						aria-hidden={!isWorkQueuesExpanded}
						data-expanded={isWorkQueuesExpanded}
						data-testid='patients-work-queues-region'
						id='patients-work-queues-region'
						inert={isWorkQueuesExpanded ? undefined : true}
					>
						<QueueCollapseContent>
							<WorkQueues
								id='patients-work-queues'
								data-testid='patients-work-queues'
								aria-label={t('patients.list.queues.label')}
							>
								{queues.map((queueItem) => {
									const isClear = queueItem.count === 0;
									const isSelected = queue === queueItem.queue;
									const queueIcon = isClear ? (
										<CheckSuccess />
									) : (
										queueItem.icon
									);

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
						</QueueCollapseContent>
					</QueueCollapseRegion>
				</QueueSection>

				<Workspace
					aria-label={t('patients.list.workspace-label')}
					data-testid='patients-workspace'
					id='patients-workspace'
				>
					<WorkspaceControlsSection
						data-testid='patients-workspace-controls-section'
						id='patients-workspace-controls-section'
					>
						<WorkspaceControlsHeader
							data-testid='patients-workspace-controls-header'
							id='patients-workspace-controls-header'
						>
							<WorkspaceControlsTitle
								data-testid='patients-workspace-controls-title'
								id='patients-workspace-controls-title'
							>
								{t('patients.list.controls.title')}
							</WorkspaceControlsTitle>
							<QueueVisibilityToggle
								aria-controls='patients-workspace-controls'
								aria-expanded={
									isDesktopTable || isWorkspaceControlsExpanded
								}
								aria-label={t(
									isWorkspaceControlsExpanded
										? 'patients.list.controls.collapse'
										: 'patients.list.controls.expand'
								)}
								data-action={
									isWorkspaceControlsExpanded
										? 'collapse-workspace-controls'
										: 'expand-workspace-controls'
								}
								data-testid='patients-workspace-controls-toggle'
								id='patients-workspace-controls-toggle'
								onClick={toggleWorkspaceControls}
								type='button'
							>
								<QueueVisibilityIcon
									data-expanded={isWorkspaceControlsExpanded}
									data-testid='patients-workspace-controls-toggle-icon'
									id='patients-workspace-controls-toggle-icon'
								>
									{isWorkspaceControlsExpanded ? <Minus /> : <Plus />}
								</QueueVisibilityIcon>
							</QueueVisibilityToggle>
						</WorkspaceControlsHeader>
						<WorkspaceControlsRegion
							aria-hidden={
								!isDesktopTable && !isWorkspaceControlsExpanded
							}
							data-expanded={
								isDesktopTable || isWorkspaceControlsExpanded
							}
							data-testid='patients-workspace-controls-region'
							id='patients-workspace-controls-region'
							inert={
								!isDesktopTable && !isWorkspaceControlsExpanded
									? true
									: undefined
							}
						>
							<WorkspaceControlsContent>
								<ControlsBar
									id='patients-workspace-controls'
									data-testid='patients-controls'
								>
						<FieldGroup
							id='patients-workspace-search-field'
							data-testid='patients-workspace-search-field'
						>
							<FieldLabel
								htmlFor='patients-workspace-search'
								id='patients-workspace-search-label'
								data-testid='patients-workspace-search-label'
							>
								{t('patients.list.search-label')}
							</FieldLabel>
							<ControlField
								fullWidth
								id='patients-workspace-search'
								data-testid='patients-workspace-search'
								inputProps={{
									autoComplete: 'off',
									'data-testid': 'patients-workspace-search-input',
									name: 'patients-search',
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment
											aria-hidden='true'
											id='patients-workspace-search-icon'
											data-testid='patients-workspace-search-icon'
											position='start'
										>
											<Search />
										</InputAdornment>
									),
								}}
								placeholder={t('patients.list.search-placeholder')}
								type='search'
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
							/>
						</FieldGroup>

						<FieldGroup
							id='patients-workspace-status-field'
							data-testid='patients-workspace-status-field'
						>
							<FieldLabel
								htmlFor='patients-workspace-status-filter'
								id='patients-workspace-status-label'
								data-testid='patients-workspace-status-label'
							>
								{t('patients.list.status-label')}
							</FieldLabel>
							<ControlField
								select
								fullWidth
								id='patients-workspace-status-filter'
								data-testid='patients-workspace-status-filter'
								inputProps={{
									'data-testid': 'patients-workspace-status-input',
									name: 'patients-status',
								}}
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

						<FieldGroup
							id='patients-workspace-sort-field'
							data-testid='patients-workspace-sort-field'
						>
							<FieldLabel
								htmlFor='patients-workspace-sort'
								id='patients-workspace-sort-label'
								data-testid='patients-workspace-sort-label'
							>
								{t('patients.list.sort-label')}
							</FieldLabel>
							<ControlField
								select
								fullWidth
								id='patients-workspace-sort'
								data-testid='patients-workspace-sort'
								inputProps={{
									'data-testid': 'patients-workspace-sort-input',
									name: 'patients-sort',
								}}
								value={sortValue}
								onChange={(event) => {
									const { direction, field } = decodePatientListSortValue(
										event.target.value
									);
									setSortField(field);
									setSortDirection(direction);
									if (field === 'name') {
										setWorkspaceSort({ column: 'patient', direction });
									} else if (field === 'total-sessions') {
										setWorkspaceSort({ column: 'sessions', direction });
									}
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

						<ColumnsWrapper
							id='patients-workspace-columns'
							data-testid='patients-workspace-columns'
						>
							<Button
								aria-controls='patients-workspace-columns-panel'
								aria-expanded={columnsOpen}
								aria-label={t('patients.list.columns-control')}
								data-action='toggle-columns'
								id='patients-workspace-columns-trigger'
								data-testid='patients-workspace-columns-trigger'
								onClick={() => setColumnsOpen((current) => !current)}
								tertiary
								type='button'
								variant='outlined'
							>
								<Columns3Cog />
							</Button>
							{columnsOpen ? (
								<ColumnsPanel
									id='patients-workspace-columns-panel'
									data-testid='patients-workspace-columns-panel'
								>
									<ColumnsPanelTitle
										id='patients-workspace-columns-title'
										data-testid='patients-workspace-columns-title'
									>
										{t('patients.list.columns-visible')}
									</ColumnsPanelTitle>
									<ColumnOption
										data-disabled='true'
										id='patients-workspace-column-option-patient'
										data-testid='patients-workspace-column-option-patient'
									>
										<input
											checked
											disabled
											id='patients-workspace-column-toggle-patient'
											data-testid='patients-workspace-column-toggle-patient'
											name='patients-visible-columns'
											readOnly
											type='checkbox'
										/>
										{t('patients.list.columns.patient')}
									</ColumnOption>
									{OPTIONAL_COLUMNS.map((column) => (
										<ColumnOption
											id={`patients-workspace-column-option-${column}`}
											data-testid={`patients-workspace-column-option-${column}`}
											key={column}
										>
											<input
												checked={visibleColumnSet.has(column)}
												id={`patients-workspace-column-toggle-${column}`}
												data-testid={`patients-workspace-column-toggle-${column}`}
												name='patients-visible-columns'
												onChange={() => toggleColumn(column)}
												type='checkbox'
											/>
											{t(`patients.list.columns.${column}`)}
										</ColumnOption>
									))}
								</ColumnsPanel>
							) : null}
						</ColumnsWrapper>
								</ControlsBar>
							</WorkspaceControlsContent>
						</WorkspaceControlsRegion>
					</WorkspaceControlsSection>

					<ResultsHeader>
						<ResultsTitleGroup>
							<ResultsTitle id='patients-workspace-results-title'>
								{t(activeQueueLabel)}
							</ResultsTitle>
							<ResultsCount data-testid='patients-workspace-results-count'>
								{activeColumnFilterCount
									? workspacePatients.length
									: totalPatients}
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
						{workspacePatients.length ? (
							<PatientTable
								aria-labelledby='patients-workspace-results-title'
								id='patients-workspace-table'
								data-testid='patients-workspace-table'
							>
								<thead>
									<tr>
										{DEFAULT_VISIBLE_COLUMNS.filter((column) =>
											visibleColumnSet.has(column)
										).map((column) => {
											const isActiveSort = workspaceSort.column === column;
											const isFilterable = column !== 'sessions';
											const activeFilter = isFilterable
												? Boolean(columnFilters[column])
												: false;

											return (
												<PatientHeaderCell
													aria-sort={
														isActiveSort
															? workspaceSort.direction === 'asc'
																? 'ascending'
																: 'descending'
															: 'none'
													}
													data-testid={`patients-workspace-column-${column}`}
													id={`patients-workspace-column-${column}`}
													key={column}
													scope='col'
												>
													<HeaderControl
														data-testid={`patients-workspace-column-${column}-controls`}
														id={`patients-workspace-column-${column}-controls`}
													>
														<SortableHeaderButton
															data-sort-column={column}
															id={`patients-workspace-sort-${column}`}
															data-testid={`patients-workspace-sort-${column}`}
															onClick={() =>
																handleWorkspaceSortChange(column)
															}
															type='button'
														>
															{t(`patients.list.columns.${column}`)}
															<SortIndicator
																aria-hidden='true'
																id={`patients-workspace-sort-${column}-indicator`}
																data-testid={`patients-workspace-sort-${column}-indicator`}
															>
																{isActiveSort ? (
																	workspaceSort.direction === 'asc' ? (
																		<ChevronUp />
																	) : (
																		<ChevronDown />
																	)
																) : (
																	<ArrowUpDown />
																)}
															</SortIndicator>
														</SortableHeaderButton>
														{isFilterable ? (
															<HeaderFilterButton
																aria-controls='patients-workspace-column-filter-popover'
																aria-expanded={
																	filterColumn === column &&
																	Boolean(columnFilterAnchor)
																}
																aria-label={t(
																	'patients.list.column-filter.open',
																	{
																		column: t(
																			`patients.list.columns.${column}`
																		),
																	}
																)}
																data-active={activeFilter}
																data-filter-column={column}
																id={`patients-workspace-filter-${column}`}
																data-testid={`patients-workspace-filter-${column}`}
																onClick={(event) =>
																	openColumnFilter(event, column)
																}
																type='button'
															>
																<Filter />
															</HeaderFilterButton>
														) : null}
													</HeaderControl>
												</PatientHeaderCell>
											);
										})}
										<PatientHeaderCell
											data-testid='patients-workspace-column-open'
											id='patients-workspace-column-open'
											scope='col'
										>
											<VisuallyHidden>{t('patients.list.open')}</VisuallyHidden>
										</PatientHeaderCell>
									</tr>
								</thead>
								<tbody data-testid='patients-workspace-table-body'>
									{workspacePatients.map((patient, patientIndex) => {
										const rowTestId = `patients-workspace-row-${patient.uiRowKey}`;
										const contactValue =
											patient.contacts?.phone ||
											patient.contacts?.email ||
											patient.contacts?.whatsapp;
										const contactIconType = patient.contacts?.phone
											? 'phone'
											: patient.contacts?.email
												? 'email'
												: patient.contacts?.whatsapp
													? 'whatsapp'
													: patient.preferredContactType;
										return (
											<PatientTableRow
												aria-label={t('patients.list.open-workflow', {
													patient: patient.fullName,
												})}
												custom={patientIndex}
												data-testid={rowTestId}
												id={rowTestId}
												initial={
													shouldAnimatePatientCards ? 'hidden' : false
												}
												key={patient._id}
												layout={shouldAnimatePatientCards ? 'position' : false}
												data-selected={
													selectedPatient?._id === patient._id
												}
												onClick={() => openPatientWorkflow(patient)}
												onKeyDown={(event) =>
													handleRowKeyDown(event, patient)
												}
												tabIndex={0}
												variants={patientCardScrollVariants}
												viewport={patientCardScrollViewport}
												whileInView={
													shouldAnimatePatientCards ? 'visible' : undefined
												}
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
															<ContactIcon
																id={`${rowTestId}-contact-icon`}
																data-testid={`${rowTestId}-contact-icon`}
															>
																{patient.hasContact ? (
																	getPreferredContactIcon(
																		contactIconType
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
																else openPatientWorkflow(patient);
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
															openPatientWorkflow(patient);
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
									onClick={() => {
										setSearchQuery('');
										setColumnFilters({});
									}}
									tertiary
									type='button'
									variant='outlined'
								>
									{t('patients.list.clear-filters')}
								</Button>
							</EmptyState>
						)}
					</PatientTableSurface>

					<ColumnFilterPopover
						anchorEl={columnFilterAnchor}
						anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
						id='patients-workspace-column-filter-popover'
						data-testid='patients-workspace-column-filter-popover'
						open={Boolean(columnFilterAnchor && filterColumn)}
						onClose={closeColumnFilter}
						transformOrigin={{ horizontal: 'left', vertical: 'top' }}
					>
						{filterColumn ? (
							<ColumnFilterContent
								id='patients-workspace-column-filter-content'
								data-testid='patients-workspace-column-filter-content'
							>
								<ColumnFilterLabel
									htmlFor='patients-workspace-column-filter-select'
									id='patients-workspace-column-filter-label'
									data-testid='patients-workspace-column-filter-label'
								>
									{t('patients.list.column-filter.label', {
										column: t(`patients.list.columns.${filterColumn}`),
									})}
								</ColumnFilterLabel>
								<ControlField
									select
									fullWidth
									id='patients-workspace-column-filter-select'
									data-testid='patients-workspace-column-filter-select'
									inputProps={{
										name: 'patients-column-filter',
									}}
									value={columnFilters[filterColumn] ?? ''}
									onChange={(event) =>
										updateColumnFilter(event.target.value)
									}
								>
									<StyledMenuItem
										data-testid='patients-workspace-column-filter-option-all'
										value=''
									>
										{t('patients.list.column-filter.all-values')}
									</StyledMenuItem>
									{columnFilterOptions.map((option, index) => (
										<StyledMenuItem
											data-testid={`patients-workspace-column-filter-option-${index + 1}`}
											key={option.value}
											value={option.value}
										>
											{option.label}
										</StyledMenuItem>
									))}
								</ControlField>
							</ColumnFilterContent>
						) : null}
					</ColumnFilterPopover>

					{hasNextPage ? (
						<LoadMoreRow>
							<Button
								aria-label={t('patients.list.load-more')}
								id='patients-workspace-load-more'
								data-testid='patients-workspace-load-more'
								loading={isFetchingNextPage}
								onClick={() => fetchNextPage()}
								tertiary
								type='button'
								variant='outlined'
							>
								<ChevronDown />
							</Button>
						</LoadMoreRow>
					) : null}
				</Workspace>

				{selectedPatient ? (
					<PatientWorkflowDrawer
						onClose={closePatientWorkflow}
						onCompleteNextAction={completePatientNextAction}
						onOpenProfile={openSelectedPatientProfile}
						patient={selectedPatient}
					/>
				) : null}

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
							<Funnel />
						</FloatingQueuesTriggerIcon>
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

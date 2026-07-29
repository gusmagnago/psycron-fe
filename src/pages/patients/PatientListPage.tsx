import type { KeyboardEvent, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { AddPatientForm } from '@psycron/components/form/AddPatient/AddPatientForm';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { CONFLICTS } from '@psycron/pages/urls';
import { useReducedMotion } from 'framer-motion';
import {
	BookUser,
	Copy,
	FileExclamationPoint,
	ReceiptText,
	ScanEye,
} from 'lucide-react';

import { FloatingQueues } from './floating-queues/FloatingQueues';
import { usePatientListPageState } from './hooks/usePatientListPageState';
import { usePatientListUiPreferences } from './hooks/usePatientListUiPreferences';
import {
	DEFAULT_VISIBLE_COLUMNS,
	usePatientWorkspaceColumns,
} from './hooks/usePatientWorkspaceColumns';
import { useWorkspaceRows } from './hooks/useWorkspaceRows';
import { PatientTable } from './patient-table/PatientTable';
import { PatientWorkQueues } from './patient-work-queues/PatientWorkQueues';
import { PatientWorkflowDrawer } from './patient-workflow-drawer/PatientWorkflowDrawer';
import { WorkspaceControls } from './workspace-controls/WorkspaceControls';
import {
	AddPatientAction,
	PatientListLayout,
	Workspace,
} from './PatientListPage.styles';
import { getPatientWorkspaceQueueCount } from './PatientListPage.utils';
import type {
	PatientListSortDirection,
	PatientListSortField,
	PatientWorkQueueCard,
	PatientWorkspaceColumn,
	PatientWorkspaceFilterableColumn,
	PatientWorkspaceQueue,
	PatientWorkspaceRow,
	PatientWorkspaceSortState,
} from './PatientsPage.types';
import {
	decodePatientListSortValue,
	encodePatientListSortValue,
} from './PatientsPage.utils';

// Columns the backend can order authoritatively across all pages. Others sort
// only the loaded rows (see the patient workspace sort/filter decision).
const SERVER_SORTABLE_COLUMNS: Partial<
	Record<PatientWorkspaceColumn, PatientListSortField>
> = {
	billing: 'billing',
	contact: 'contact',
	'next-action': 'next-action',
	'next-session': 'next-session',
	patient: 'name',
	sessions: 'total-sessions',
};

export const PatientListPage = () => {
	const { t } = useTranslation();
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
	const [isWorkQueuesVisible, setIsWorkQueuesVisible] = useState(true);
	const [selectedPatient, setSelectedPatient] =
		useState<PatientWorkspaceRow | null>(null);
	const [workspaceSort, setWorkspaceSort] = useState<PatientWorkspaceSortState>(
		{
			column: 'patient',
			direction: 'asc',
		}
	);
	const workQueueSectionRef = useRef<HTMLElement | null>(null);
	const { toggleColumn, visibleColumnSet } = usePatientWorkspaceColumns();
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
	const {
		isWorkspaceControlsExpanded,
		isWorkQueuesExpanded,
		setIsWorkspaceControlsExpanded,
		setIsWorkQueuesExpanded,
	} = usePatientListUiPreferences({ isDesktopTable });
	const prefersReducedMotion = useReducedMotion();
	const shouldAnimatePatientCards = isMobile && !prefersReducedMotion;

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
			clearDescriptionKey: 'patients.list.queues.recovery-clear-description',
			count: getQueueCount('recovery'),
			descriptionKey: 'patients.list.queues.recovery-description',
			icon: <ScanEye />,
			id: 'patients-queue-recovery',
			labelKey: 'patients.list.queues.recovery',
			queue: 'recovery',
		},
		{
			clearDescriptionKey: 'patients.list.queues.billing-clear-description',
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
			document.getElementById('patients-work-queues-floating-trigger')?.focus();
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
			capture(PostHogEvent.PatientCenterQueueSelected, {
				queue: 'all',
				source: 'queue-card',
			});
			return;
		}
		setQueue(queueKey);
		capture(PostHogEvent.PatientCenterQueueSelected, {
			queue: queueKey,
			source: 'queue-card',
		});
	};
	const selectFloatingQueue = (queueKey: PatientWorkspaceQueue): void => {
		if (queueKey === 'all') showAllPatients();
		else setQueue(queueKey);
		capture(PostHogEvent.PatientCenterQueueSelected, {
			queue: queueKey,
			source: 'floating',
		});
		closeFloatingQueues();
	};

	const goToDuplicateConflicts = (): void => {
		navigate(`/${locale}/${CONFLICTS}?type=PATIENT_DUPLICATE`);
	};
	const goToConflicts = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		goToDuplicateConflicts();
	};
	const closePatientWorkflow = (): void => {
		setSelectedPatient(null);
	};
	const openPatientWorkflow = (patient: PatientWorkspaceRow): void => {
		setSelectedPatient(patient);
		capture(PostHogEvent.PatientCenterWorkflowOpened, {
			next_action: patient.nextAction,
		});
	};
	const openSelectedPatientProfile = (patientId: string): void => {
		closePatientWorkflow();
		openPatientProfile(patientId);
	};
	const completePatientNextAction = (patient: PatientWorkspaceRow): void => {
		closePatientWorkflow();
		if (patient.nextAction === 'review-duplicate') {
			goToDuplicateConflicts();
			return;
		}
		openPatientProfile(patient._id);
	};

	const activeColumnFilterCount =
		Object.values(columnFilters).filter(Boolean).length;
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

	// When the active column has a server-authoritative sort key the query already
	// returns globally-correct order; re-sorting the loaded window client-side
	// would fight (and scramble) it, so we preserve server order in that case.
	const isServerSorted = Boolean(SERVER_SORTABLE_COLUMNS[workspaceSort.column]);

	const { columnFilterOptions, rows: workspacePatients } = useWorkspaceRows({
		columnFilters,
		filterColumn,
		isServerSorted,
		patients: filteredPatients,
		workspaceSort,
	});

	const handleSortSelectChange = (value: string): void => {
		const { direction, field } = decodePatientListSortValue(value);
		setSortField(field);
		setSortDirection(direction);
		if (field === 'name') {
			setWorkspaceSort({ column: 'patient', direction });
		} else if (field === 'total-sessions') {
			setWorkspaceSort({ column: 'sessions', direction });
		} else if (field === 'next-session') {
			setWorkspaceSort({ column: 'next-session', direction });
		}
	};

	const handleWorkspaceSortChange = (column: PatientWorkspaceColumn): void => {
		const direction: PatientListSortDirection =
			workspaceSort.column === column && workspaceSort.direction === 'asc'
				? 'desc'
				: 'asc';
		setWorkspaceSort({ column, direction });

		// Columns with a server-authoritative sort key drive the query so
		// ordering holds across pages; the rest refine the loaded rows only.
		const serverSortField = SERVER_SORTABLE_COLUMNS[column];
		if (serverSortField) {
			setSortField(serverSortField);
			setSortDirection(direction);
		}
		capture(PostHogEvent.PatientCenterColumnSortChanged, {
			column,
			direction,
			scope: serverSortField ? 'server' : 'client',
		});
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
				<PatientWorkQueues
					hasAuthoritativeQueues={hasAuthoritativeQueues}
					isAllClear={isAllClear}
					isWorkQueuesExpanded={isWorkQueuesExpanded}
					onToggleQueue={toggleQueue}
					queue={queue}
					queues={queues}
					sectionRef={workQueueSectionRef}
					setIsWorkQueuesExpanded={setIsWorkQueuesExpanded}
				/>

				<Workspace
					aria-label={t('patients.list.workspace-label')}
					data-testid='patients-workspace'
					id='patients-workspace'
				>
					<WorkspaceControls
						columnsOpen={columnsOpen}
						isWorkspaceControlsExpanded={isWorkspaceControlsExpanded}
						onSearchChange={setSearchQuery}
						onSortChange={handleSortSelectChange}
						onStatusChange={setStatusFilter}
						onToggleColumn={toggleColumn}
						onToggleColumns={() => setColumnsOpen((current) => !current)}
						onToggleControls={toggleWorkspaceControls}
						searchQuery={searchQuery}
						sortValue={sortValue}
						statusFilter={statusFilter}
						visibleColumnSet={visibleColumnSet}
					/>

					<PatientTable
						activeColumnFilterCount={activeColumnFilterCount}
						activeQueueLabel={activeQueueLabel}
						columnFilterAnchor={columnFilterAnchor}
						columnFilterOptions={columnFilterOptions}
						columnFilters={columnFilters}
						columnOrder={DEFAULT_VISIBLE_COLUMNS}
						emptyBody={emptyBody}
						emptyTitle={emptyTitle}
						filterColumn={filterColumn}
						hasNextPage={hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						isFiltering={isFiltering}
						isRefreshingResults={isRefreshingResults}
						onClearFilters={() => {
							// `isFiltering` also counts the status filter, so clearing must
							// reset it too — otherwise the button is enabled but inert for a
							// status-only filter.
							setSearchQuery('');
							setStatusFilter('all');
							setColumnFilters({});
						}}
						onCloseColumnFilter={closeColumnFilter}
						onGoToConflicts={goToConflicts}
						onLoadMore={() => fetchNextPage()}
						onOpenColumnFilter={openColumnFilter}
						onOpenWorkflow={openPatientWorkflow}
						onRowKeyDown={handleRowKeyDown}
						onSortChange={handleWorkspaceSortChange}
						onUpdateColumnFilter={updateColumnFilter}
						rows={workspacePatients}
						selectedPatientId={selectedPatient?._id}
						shouldAnimate={shouldAnimatePatientCards}
						totalPatients={totalPatients}
						visibleColumnSet={visibleColumnSet}
						workspaceSort={workspaceSort}
					/>
				</Workspace>

				{selectedPatient ? (
					<PatientWorkflowDrawer
						onClose={closePatientWorkflow}
						onCompleteNextAction={completePatientNextAction}
						onOpenProfile={openSelectedPatientProfile}
						patient={selectedPatient}
					/>
				) : null}

				<FloatingQueues
					activeFilterCount={activeFilterCount}
					activeQueueLabel={activeQueueLabel}
					isFloatingQueuesOpen={isFloatingQueuesOpen}
					isWorkQueuesVisible={isWorkQueuesVisible}
					onClose={closeFloatingQueues}
					onOpen={() => setIsFloatingQueuesOpen(true)}
					onSelectQueue={selectFloatingQueue}
					queue={queue}
					queues={queues}
				/>
			</PatientListLayout>
		</PageLayout>
	);
};

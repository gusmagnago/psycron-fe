import type { KeyboardEvent,MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { ChevronDown, ChevronUp, Filter } from '@psycron/components/icons';
import { ArrowUpDown } from 'lucide-react';

import {
	ColumnFilterContent,
	ColumnFilterLabel,
	ColumnFilterPopover,
	ControlField,
	EmptyBody,
	EmptyState,
	EmptyTitle,
	HeaderControl,
	HeaderFilterButton,
	LoadMoreRow,
	PatientHeaderCell,
	PatientTable as PatientTableElement,
	PatientTableSurface,
	ResultsCount,
	ResultsHeader,
	ResultsHint,
	ResultsTitle,
	ResultsTitleGroup,
	SortableHeaderButton,
	SortIndicator,
	StyledMenuItem,
	VisuallyHidden,
} from '../PatientListPage.styles';
import type {
	PatientWorkspaceColumn,
	PatientWorkspaceColumnFilterOption,
	PatientWorkspaceFilterableColumn,
	PatientWorkspaceRow,
	PatientWorkspaceSortState,
} from '../PatientsPage.types';

import { PatientRow } from './PatientRow';

interface PatientTableProps {
	activeColumnFilterCount: number;
	activeQueueLabel: string;
	columnFilterAnchor: HTMLButtonElement | null;
	columnFilterOptions: PatientWorkspaceColumnFilterOption[];
	columnFilters: Partial<Record<PatientWorkspaceFilterableColumn, string>>;
	columnOrder: PatientWorkspaceColumn[];
	emptyBody: string;
	emptyTitle: string;
	filterColumn: PatientWorkspaceFilterableColumn | null;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	isFiltering: boolean;
	isRefreshingResults: boolean;
	onClearFilters: () => void;
	onCloseColumnFilter: () => void;
	onGoToConflicts: (event: MouseEvent<HTMLElement>) => void;
	onLoadMore: () => void;
	onOpenColumnFilter: (
		event: MouseEvent<HTMLButtonElement>,
		column: PatientWorkspaceFilterableColumn
	) => void;
	onOpenWorkflow: (patient: PatientWorkspaceRow) => void;
	onRowKeyDown: (
		event: KeyboardEvent<HTMLTableRowElement>,
		patient: PatientWorkspaceRow
	) => void;
	onSortChange: (column: PatientWorkspaceColumn) => void;
	onUpdateColumnFilter: (value: string) => void;
	rows: PatientWorkspaceRow[];
	selectedPatientId?: string;
	shouldAnimate: boolean;
	totalPatients: number;
	visibleColumnSet: Set<PatientWorkspaceColumn>;
	workspaceSort: PatientWorkspaceSortState;
}

export const PatientTable = ({
	activeColumnFilterCount,
	activeQueueLabel,
	columnFilterAnchor,
	columnFilterOptions,
	columnFilters,
	columnOrder,
	emptyBody,
	emptyTitle,
	filterColumn,
	hasNextPage,
	isFetchingNextPage,
	isFiltering,
	isRefreshingResults,
	onClearFilters,
	onCloseColumnFilter,
	onGoToConflicts,
	onLoadMore,
	onOpenColumnFilter,
	onOpenWorkflow,
	onRowKeyDown,
	onSortChange,
	onUpdateColumnFilter,
	rows,
	selectedPatientId,
	shouldAnimate,
	totalPatients,
	visibleColumnSet,
	workspaceSort,
}: PatientTableProps) => {
	const { t } = useTranslation();

	return (
		<>
			<ResultsHeader>
				<ResultsTitleGroup>
					<ResultsTitle id='patients-workspace-results-title'>
						{t(activeQueueLabel)}
					</ResultsTitle>
					<ResultsCount data-testid='patients-workspace-results-count'>
						{activeColumnFilterCount ? rows.length : totalPatients}
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
				{rows.length ? (
					<PatientTableElement
						aria-labelledby='patients-workspace-results-title'
						id='patients-workspace-table'
						data-testid='patients-workspace-table'
					>
						<thead>
							<tr>
								{columnOrder
									.filter((column) => visibleColumnSet.has(column))
									.map((column) => {
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
														onClick={() => onSortChange(column)}
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
															aria-label={t('patients.list.column-filter.open', {
																column: t(`patients.list.columns.${column}`),
															})}
															data-active={activeFilter}
															data-filter-column={column}
															id={`patients-workspace-filter-${column}`}
															data-testid={`patients-workspace-filter-${column}`}
															onClick={(event) =>
																onOpenColumnFilter(
																	event,
																	column as PatientWorkspaceFilterableColumn
																)
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
							{rows.map((patient, patientIndex) => (
								<PatientRow
									isSelected={selectedPatientId === patient._id}
									key={patient._id}
									onGoToConflicts={onGoToConflicts}
									onOpenWorkflow={onOpenWorkflow}
									onRowKeyDown={onRowKeyDown}
									patient={patient}
									patientIndex={patientIndex}
									shouldAnimate={shouldAnimate}
									visibleColumnSet={visibleColumnSet}
								/>
							))}
						</tbody>
					</PatientTableElement>
				) : (
					<EmptyState aria-live='polite'>
						<EmptyTitle>{emptyTitle}</EmptyTitle>
						<EmptyBody>{emptyBody}</EmptyBody>
						<Button
							id='patients-workspace-clear-search'
							data-testid='patients-workspace-clear-search'
							disabled={!isFiltering}
							onClick={onClearFilters}
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
				onClose={onCloseColumnFilter}
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
							onChange={(event) => onUpdateColumnFilter(event.target.value)}
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
						onClick={onLoadMore}
						tertiary
						type='button'
						variant='outlined'
					>
						<ChevronDown />
					</Button>
				</LoadMoreRow>
			) : null}
		</>
	);
};

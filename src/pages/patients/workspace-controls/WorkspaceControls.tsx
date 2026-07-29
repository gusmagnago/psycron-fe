import { useTranslation } from 'react-i18next';
import { InputAdornment } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import {
	Columns3Cog,
	Minus,
	Plus,
	Search,
} from '@psycron/components/icons';

import { OPTIONAL_COLUMNS } from '../hooks/usePatientWorkspaceColumns';
import {
	ColumnOption,
	ColumnsPanel,
	ColumnsPanelTitle,
	ColumnsWrapper,
	ControlField,
	ControlsBar,
	FieldGroup,
	FieldLabel,
	QueueVisibilityIcon,
	QueueVisibilityToggle,
	StyledMenuItem,
	WorkspaceControlsContent,
	WorkspaceControlsHeader,
	WorkspaceControlsRegion,
	WorkspaceControlsSection,
	WorkspaceControlsTitle,
} from '../PatientListPage.styles';
import type { PatientListStatusFilter } from '../PatientsPage.types';
import {
	encodePatientListSortValue,
	PATIENT_LIST_SORT_OPTIONS,
} from '../PatientsPage.utils';

import type { WorkspaceControlsProps } from './WorkspaceControls.types';

export const WorkspaceControls = ({
	columnsOpen,
	isWorkspaceControlsExpanded,
	onSearchChange,
	onSortChange,
	onStatusChange,
	onToggleColumn,
	onToggleColumns,
	onToggleControls,
	searchQuery,
	sortValue,
	statusFilter,
	visibleColumnSet,
}: WorkspaceControlsProps) => {
	const { t } = useTranslation();

	return (
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
					aria-expanded={isWorkspaceControlsExpanded}
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
					onClick={onToggleControls}
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
				aria-hidden={!isWorkspaceControlsExpanded}
				data-expanded={isWorkspaceControlsExpanded}
				data-testid='patients-workspace-controls-region'
				id='patients-workspace-controls-region'
				inert={isWorkspaceControlsExpanded ? undefined : ''}
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
								onChange={(event) => onSearchChange(event.target.value)}
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
									onStatusChange(event.target.value as PatientListStatusFilter)
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
								onChange={(event) => onSortChange(event.target.value)}
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
								onClick={onToggleColumns}
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
												onChange={() => onToggleColumn(column)}
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
	);
};

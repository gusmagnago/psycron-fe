import { useTranslation } from 'react-i18next';
import { Checkbox, TextField } from '@mui/material';
import type { ImportCandidatePatient } from '@psycron/api/practice-import';

import {
	CandidateBody,
	CandidateMeta,
	CandidateRow,
	ConfidenceBadge,
	NameRow,
} from './PracticeImportReview.styles';

export interface RowState {
	firstName: string;
	include: boolean;
	lastName: string;
}

/** Initial editable state for a candidate row: included, name pre-filled. */
export const defaultRowState = (c: ImportCandidatePatient): RowState => ({
	include: true,
	firstName: c.firstName,
	lastName: c.lastName,
});

interface PracticeImportCandidateRowProps {
	candidate: ImportCandidatePatient;
	onPatch: (patch: Partial<RowState>) => void;
	row: RowState;
	rowId: string;
}

export const PracticeImportCandidateRow = ({
	candidate,
	row,
	rowId,
	onPatch,
}: PracticeImportCandidateRowProps) => {
	const { t } = useTranslation();

	return (
		<CandidateRow included={row.include} data-testid={rowId} id={rowId}>
			<Checkbox
				id={`${rowId}-include`}
				data-testid={`${rowId}-include`}
				checked={row.include}
				onChange={(e) => onPatch({ include: e.target.checked })}
				inputProps={{
					'aria-label': t('practice-import.include-aria', {
						name: `${candidate.firstName} ${candidate.lastName}`.trim(),
					}),
				}}
			/>
			<CandidateBody>
				<NameRow>
					<TextField
						id={`${rowId}-first-name`}
						data-testid={`${rowId}-first-name`}
						size='small'
						value={row.firstName}
						disabled={!row.include}
						onChange={(e) => onPatch({ firstName: e.target.value })}
						label={t('practice-import.first-name')}
					/>
					<TextField
						id={`${rowId}-last-name`}
						data-testid={`${rowId}-last-name`}
						size='small'
						value={row.lastName}
						disabled={!row.include}
						onChange={(e) => onPatch({ lastName: e.target.value })}
						label={t('practice-import.last-name')}
					/>
				</NameRow>
				<CandidateMeta data-testid={`${rowId}-meta`} id={`${rowId}-meta`}>
					<ConfidenceBadge
						tone={candidate.confidence}
						data-testid={`${rowId}-confidence`}
						id={`${rowId}-confidence`}
					>
						{t(`practice-import.confidence-${candidate.confidence}`)}
					</ConfidenceBadge>
					<span data-testid={`${rowId}-sessions`} id={`${rowId}-sessions`}>
						{t('practice-import.sessions', { count: candidate.sessionCount })}
					</span>
					{candidate.contact?.email && (
						<span data-testid={`${rowId}-email`} id={`${rowId}-email`}>
							{candidate.contact.email}
						</span>
					)}
				</CandidateMeta>
			</CandidateBody>
		</CandidateRow>
	);
};

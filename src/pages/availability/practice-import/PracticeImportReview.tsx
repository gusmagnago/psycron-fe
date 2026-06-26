import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, TextField } from '@mui/material';
import type {
	ImportCandidatePatient,
	ImportDecision,
} from '@psycron/api/practice-import';
import { Modal } from '@psycron/components/modal/Modal';

import {
	CandidateBody,
	CandidateList,
	CandidateMeta,
	CandidateRow,
	ConfidenceBadge,
	EmptyState,
	NameRow,
	ReviewIntro,
} from './PracticeImportReview.styles';
import { usePracticeImport } from './usePracticeImport';

interface PracticeImportReviewProps {
	onClose: () => void;
	open: boolean;
	therapistId?: string;
}

interface RowState {
	firstName: string;
	include: boolean;
	lastName: string;
}

const candidateKey = (c: ImportCandidatePatient): string =>
	c.sourceEventIds.join(',') || `${c.firstName}|${c.lastName}`;

export const PracticeImportReview = ({
	open,
	onClose,
	therapistId,
}: PracticeImportReviewProps) => {
	const { t } = useTranslation();
	const { preview, commit } = usePracticeImport(therapistId);

	const candidates = useMemo(
		() => preview.data?.candidates ?? [],
		[preview.data]
	);

	// Per-candidate row state: included by default, name editable.
	const [rows, setRows] = useState<Record<string, RowState>>({});

	// (Re)seed row state whenever the candidate set changes.
	const seededFor = candidates.map(candidateKey).join('|');
	useEffect(() => {
		const next: Record<string, RowState> = {};
		for (const c of candidates) {
			next[candidateKey(c)] = {
				include: true,
				firstName: c.firstName,
				lastName: c.lastName,
			};
		}
		setRows(next);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seededFor]);

	const setRow = (key: string, patch: Partial<RowState>) =>
		setRows((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

	const includedCount = candidates.filter(
		(c) => rows[candidateKey(c)]?.include
	).length;

	const handleConfirm = () => {
		const decisions: ImportDecision[] = candidates.map((c) => {
			const key = candidateKey(c);
			const row = rows[key];
			if (!row?.include) return { proposal: c, action: 'reject' };
			const editedName =
				row.firstName !== c.firstName || row.lastName !== c.lastName;
			return {
				proposal: c,
				action: 'accept',
				...(editedName && {
					edited: { firstName: row.firstName, lastName: row.lastName },
				}),
			};
		});
		commit.mutate(decisions, { onSuccess: () => onClose() });
	};

	const isLoading = preview.isLoading;
	const isEmpty = !isLoading && candidates.length === 0;

	return (
		<Modal
			openModal={open}
			onClose={onClose}
			id='practice-import-review'
			title={t('practice-import.title')}
			isLoading={isLoading}
			cardActionsProps={{
				actionName: t('practice-import.confirm', { count: includedCount }),
				onClick: handleConfirm,
				disabled: includedCount === 0 || commit.isPending || isEmpty,
				loading: commit.isPending,
				hasSecondAction: true,
				secondActionName: t('practice-import.cancel'),
				secondAction: onClose,
			}}
		>
			{isEmpty ? (
				<EmptyState
					data-testid='practice-import-empty'
					id='practice-import-empty'
				>
					{t('practice-import.empty')}
				</EmptyState>
			) : (
				<>
					<ReviewIntro
						data-testid='practice-import-intro'
						id='practice-import-intro'
					>
						{t('practice-import.subtitle', { count: candidates.length })}
					</ReviewIntro>
					<CandidateList
						data-testid='practice-import-candidate-list'
						id='practice-import-candidate-list'
					>
						{candidates.map((c, index) => {
							const key = candidateKey(c);
							const rowId = `practice-import-candidate-${index}`;
							const row = rows[key] ?? {
								include: true,
								firstName: c.firstName,
								lastName: c.lastName,
							};
							return (
								<CandidateRow
									key={key}
									included={row.include}
									data-testid={rowId}
									id={rowId}
								>
									<Checkbox
										id={`${rowId}-include`}
										data-testid={`${rowId}-include`}
										checked={row.include}
										onChange={(e) => setRow(key, { include: e.target.checked })}
										inputProps={{
											'aria-label': t('practice-import.include-aria', {
												name: `${c.firstName} ${c.lastName}`.trim(),
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
												onChange={(e) =>
													setRow(key, { firstName: e.target.value })
												}
												label={t('practice-import.first-name')}
											/>
											<TextField
												id={`${rowId}-last-name`}
												data-testid={`${rowId}-last-name`}
												size='small'
												value={row.lastName}
												disabled={!row.include}
												onChange={(e) =>
													setRow(key, { lastName: e.target.value })
												}
												label={t('practice-import.last-name')}
											/>
										</NameRow>
										<CandidateMeta
											data-testid={`${rowId}-meta`}
											id={`${rowId}-meta`}
										>
											<ConfidenceBadge
												tone={c.confidence}
												data-testid={`${rowId}-confidence`}
												id={`${rowId}-confidence`}
											>
												{t(`practice-import.confidence-${c.confidence}`)}
											</ConfidenceBadge>
											<span
												data-testid={`${rowId}-sessions`}
												id={`${rowId}-sessions`}
											>
												{t('practice-import.sessions', {
													count: c.sessionCount,
												})}
											</span>
											{c.contact?.email && (
												<span
													data-testid={`${rowId}-email`}
													id={`${rowId}-email`}
												>
													{c.contact.email}
												</span>
											)}
										</CandidateMeta>
									</CandidateBody>
								</CandidateRow>
							);
						})}
					</CandidateList>
				</>
			)}
		</Modal>
	);
};

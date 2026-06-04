import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
	ImportCandidatePatient,
	ImportDecision,
} from '@psycron/api/practice-import';
import {
	commitPracticeImport,
	getPracticeImportPreview,
} from '@psycron/api/practice-import';
import { Button } from '@psycron/components/button/Button';
import { Cat, CheckSuccess, Close } from '@psycron/components/icons';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
	Badge,
	Card,
	CatAvatar,
	CommitBar,
	Header,
	List,
	Meta,
	PatientName,
	RejectButton,
	Row,
	Summary,
	Title,
} from './PracticeImportReview.styles';

const WEEKDAYS = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const keyOf = (c: ImportCandidatePatient): string =>
	c.sourceEventIds[0] ?? `${c.firstName}-${c.lastName}`;

export const PracticeImportReview = () => {
	const { t } = useTranslation();
	const therapistId = useTherapistId();
	const { showAlert } = useAlert();
	const [rejected, setRejected] = useState<Set<string>>(new Set());

	const { data, isLoading } = useQuery({
		queryKey: ['practiceImportPreview', therapistId],
		queryFn: () => getPracticeImportPreview(therapistId!),
		enabled: !!therapistId,
		staleTime: 1000 * 60 * 5,
	});

	const commit = useMutation({
		mutationFn: (decisions: ImportDecision[]) =>
			commitPracticeImport(therapistId!, decisions),
		onSuccess: (r) =>
			showAlert({
				message: t('practiceImport.imported', {
					created: r.created,
					skipped: r.skipped,
				}),
				severity: 'success',
			}),
		onError: () =>
			showAlert({ message: t('practiceImport.error'), severity: 'error' }),
	});

	const candidates = useMemo(() => data?.candidates ?? [], [data]);
	const acceptedCount = useMemo(
		() => candidates.filter((c) => !rejected.has(keyOf(c))).length,
		[candidates, rejected]
	);

	const toggle = (key: string): void =>
		setRejected((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});

	const onCommit = (): void => {
		const decisions: ImportDecision[] = candidates.map((c) => ({
			proposal: c,
			action: rejected.has(keyOf(c)) ? 'reject' : 'accept',
		}));
		commit.mutate(decisions);
	};

	return (
		<PageLayout title='' isLoading={isLoading}>
			<Card>
				<Header>
					<CatAvatar>
						<Cat />
					</CatAvatar>
					<div>
						<Title>{t('practiceImport.title')}</Title>
						{data ? (
							<Summary>
								{t('practiceImport.summary', {
									patients: data.summary.patientsFound,
									sessions: data.summary.sessionsFound,
									events: data.summary.sourceEvents,
								})}
							</Summary>
						) : null}
					</div>
				</Header>

				<List>
					{candidates.map((c) => {
						const key = keyOf(c);
						const isRejected = rejected.has(key);
						const when = c.recurrence
							? `${WEEKDAYS[c.recurrence.weekday]} ${c.recurrence.startTime}`
							: t('practiceImport.one-off');
						return (
							<Row key={key} rejected={isRejected}>
								<div>
									<PatientName>
										{c.firstName} {c.lastName}
									</PatientName>
									<Meta>
										{c.sessionCount}× · {when} ·{' '}
										{c.contact?.email ?? t('practiceImport.no-contact')}
									</Meta>
								</div>
								<Badge level={c.confidence}>{c.confidence}</Badge>
								<Meta>{c.modality ?? ''}</Meta>
								<RejectButton
									rejected={isRejected}
									onClick={() => toggle(key)}
									aria-label={
										isRejected
											? t('practiceImport.include')
											: t('practiceImport.exclude')
									}
								>
									{isRejected ? <Close /> : <CheckSuccess />}
								</RejectButton>
							</Row>
						);
					})}
				</List>

				<CommitBar>
					<Summary>
						{t('practiceImport.willImport', {
							accepted: acceptedCount,
							total: candidates.length,
						})}
					</Summary>
					<Button
						tertiary
						onClick={onCommit}
						loading={commit.isPending}
						disabled={!candidates.length}
					>
						{t('practiceImport.import-cta', { count: acceptedCount })}
					</Button>
				</CommitBar>
			</Card>
		</PageLayout>
	);
};

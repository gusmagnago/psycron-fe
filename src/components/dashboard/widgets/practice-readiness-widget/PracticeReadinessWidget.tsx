import { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { Available, Phone, SaveUser, Wallet } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
	ReadinessBar,
	ReadinessBarFill,
	ReadinessIcon,
	ReadinessRingValue,
	ReadinessRingWrap,
	ReadinessRoot,
	ReadinessRow,
	ReadinessRowSub,
	ReadinessRowText,
	ReadinessRowTitle,
	ReadinessSegments,
} from './PracticeReadinessWidget.styles';
import type {
	PracticeReadinessWidgetProps,
	ReadinessSegmentId,
	ReadinessSegmentView,
} from './PracticeReadinessWidget.types';
import {
	getPrimarySegment,
	getSegmentTone,
	getWeightedReadiness,
} from './PracticeReadinessWidget.utils';

const SEGMENT_ICON: Record<ReadinessSegmentId, ReactElement> = {
	availability: <Available />,
	billing: <Wallet />,
	contacts: <Phone />,
};

const RING_RADIUS = 23;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const PracticeReadinessWidget = ({
	billingConfigured,
	billingPercentage,
	billingTotal,
	contactsConfigured,
	contactsTotal,
	hasAvailability,
	importCandidateCount = 0,
	isLoading,
	onImportAction,
	onSegmentAction,
}: PracticeReadinessWidgetProps) => {
	const { t } = useTranslation();
	const showImportRow = importCandidateCount > 0 && Boolean(onImportAction);

	const contactsPct =
		contactsTotal > 0 ? (contactsConfigured / contactsTotal) * 100 : 0;
	const availabilityPct = hasAvailability ? 100 : 0;

	const percentages = useMemo(
		() => ({
			availability: availabilityPct,
			billing: billingPercentage,
			contacts: contactsPct,
		}),
		[availabilityPct, billingPercentage, contactsPct]
	);

	// Pending imports count as an incomplete (0%) readiness item that drags the
	// overall ring down until the therapist reviews/adds them. Folded in with a
	// fixed weight, normalized — so with no pending imports the ring is unchanged.
	const importPct = 0;
	const IMPORT_WEIGHT = 0.25;
	const baseOverall = getWeightedReadiness(percentages);
	const overall = showImportRow
		? Math.round((baseOverall + importPct * IMPORT_WEIGHT) / (1 + IMPORT_WEIGHT))
		: baseOverall;
	const primary = getPrimarySegment(percentages);

	const headerActions = useMemo(
		() => (
			<ReadinessRingWrap>
				<svg height='52' width='52'>
					<circle
						cx='26'
						cy='26'
						fill='none'
						r={RING_RADIUS}
						stroke={palette.gray['01']}
						strokeWidth='6'
					/>
					<circle
						cx='26'
						cy='26'
						fill='none'
						r={RING_RADIUS}
						stroke={palette.brand.purple}
						strokeDasharray={`${(overall / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
						strokeLinecap='round'
						strokeWidth='6'
					/>
				</svg>
				<ReadinessRingValue>{`${overall}%`}</ReadinessRingValue>
			</ReadinessRingWrap>
		),
		[overall]
	);

	const segments = useMemo<ReadinessSegmentView[]>(
		() => [
			{
				id: 'contacts',
				percentage: contactsPct,
				subtitle:
					contactsTotal === 0
						? t('page.dashboard.widgets.practice-readiness.contacts.empty')
						: t('page.dashboard.widgets.practice-readiness.contacts.sub', {
								configured: contactsConfigured,
								total: contactsTotal,
							}),
				title: t('page.dashboard.widgets.practice-readiness.contacts.title'),
			},
			{
				id: 'availability',
				percentage: availabilityPct,
				subtitle: hasAvailability
					? t('page.dashboard.widgets.practice-readiness.availability.done')
					: t('page.dashboard.widgets.practice-readiness.availability.todo'),
				title: t(
					'page.dashboard.widgets.practice-readiness.availability.title'
				),
			},
			{
				id: 'billing',
				percentage: billingPercentage,
				subtitle: t('page.dashboard.widgets.practice-readiness.billing.sub', {
					configured: billingConfigured,
					total: billingTotal,
				}),
				title: t('page.dashboard.widgets.practice-readiness.billing.title'),
			},
		],
		[
			availabilityPct,
			billingConfigured,
			billingPercentage,
			billingTotal,
			contactsConfigured,
			contactsPct,
			contactsTotal,
			hasAvailability,
			t,
		]
	);

	const body = isLoading ? (
		<ReadinessRoot
			data-testid='dashboard-practice-readiness-actions'
			id='dashboard-practice-readiness-actions'
		>
			<Skeleton height={56} width='100%' />
			<Skeleton height={56} width='100%' />
			<Skeleton height={56} width='100%' />
		</ReadinessRoot>
	) : (
		<ReadinessRoot
			data-testid='dashboard-practice-readiness-actions'
			id='dashboard-practice-readiness-actions'
		>
			<ReadinessSegments>
				{showImportRow && (
					<ReadinessRow
						aria-label={t('practice-import.action-label')}
						data-testid='dashboard-practice-readiness-segment-import'
						id='dashboard-practice-readiness-segment-import'
						onClick={onImportAction}
						type='button'
					>
						<ReadinessIcon
							$tone={getSegmentTone(importPct)}
							data-testid='dashboard-practice-readiness-segment-import-icon'
							id='dashboard-practice-readiness-segment-import-icon'
						>
							<SaveUser />
						</ReadinessIcon>
						<ReadinessRowText>
							<ReadinessRowTitle
								data-testid='dashboard-practice-readiness-segment-import-title'
								id='dashboard-practice-readiness-segment-import-title'
							>
								{t('practice-import.action-label')}
							</ReadinessRowTitle>
							<ReadinessRowSub
								data-testid='dashboard-practice-readiness-segment-import-sub'
								id='dashboard-practice-readiness-segment-import-sub'
							>
								{t('practice-import.action-meta', {
									count: importCandidateCount,
								})}
							</ReadinessRowSub>
							<ReadinessBar
								data-testid='dashboard-practice-readiness-segment-import-bar'
								id='dashboard-practice-readiness-segment-import-bar'
							>
								<ReadinessBarFill
									$pct={importPct}
									$tone={getSegmentTone(importPct)}
								/>
							</ReadinessBar>
						</ReadinessRowText>
					</ReadinessRow>
				)}
				{segments.map((segment) => {
					const tone = getSegmentTone(segment.percentage);
					return (
						<ReadinessRow
							aria-label={segment.title}
							data-testid={`dashboard-practice-readiness-segment-${segment.id}`}
							id={`dashboard-practice-readiness-segment-${segment.id}`}
							key={segment.id}
							onClick={() => onSegmentAction(segment.id)}
							type='button'
						>
							<ReadinessIcon $tone={tone}>
								{SEGMENT_ICON[segment.id]}
							</ReadinessIcon>
							<ReadinessRowText>
								<ReadinessRowTitle>{segment.title}</ReadinessRowTitle>
								<ReadinessRowSub>{segment.subtitle}</ReadinessRowSub>
								<ReadinessBar>
									<ReadinessBarFill $pct={segment.percentage} $tone={tone} />
								</ReadinessBar>
							</ReadinessRowText>
						</ReadinessRow>
					);
				})}
			</ReadinessSegments>
		</ReadinessRoot>
	);

	return (
		<WidgetLayout
			actions={
				!isLoading && primary ? (
					<Button
						tertiary
						variant='contained'
						onClick={() => onSegmentAction(primary)}
					>
						{`${t(`page.dashboard.widgets.practice-readiness.cta.${primary}`)} →`}
					</Button>
				) : undefined
			}
			body={body}
			headerActions={headerActions}
			title={t('page.dashboard.widgets.practice-readiness.label')}
		/>
	);
};

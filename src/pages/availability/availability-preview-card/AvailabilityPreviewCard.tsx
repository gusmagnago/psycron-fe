import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { palette } from '@psycron/theme/palette/palette.theme';

import { StatusNote } from '../jupiter-conversation/status-note/StatusNote';

import {
	ButtonGroup,
	PreviewCardWrapper,
	PreviewDot,
	PreviewFooter,
	PreviewHeader,
	PreviewLabel,
	PreviewRow,
	PreviewStatusPill,
	PreviewTitle,
	PreviewValue,
	PublishButton,
	ResetButton,
} from './AvailabilityPreviewCard.styles';
import type { IAvailabilityPreviewCardProps } from './AvailabilityPreviewCard.types';

type PublishState = 'idle' | 'publishing' | 'success' | 'sync-pending';

export const AvailabilityPreviewCard = ({
	answers,
	detectedTimezone,
	isPublishing,
	onContinueWithoutSync,
	onPublish,
	onReset,
	onRetrySync,
}: IAvailabilityPreviewCardProps) => {
	const { t } = useTranslation();
	const [publishState, setPublishState] = useState<PublishState>('idle');

	const source =
		answers.availabilitySource ??
		(answers.calendarChoice === 'google' ? 'google-manual' : 'manual');
	const hasGoogleSource = source !== 'manual';
	const calendarName = hasGoogleSource
		? answers.selectedCalendarName ?? t('jupiter.preview.calendar-fallback')
		: t('jupiter.preview.no-calendar');

	const canPublish = !!(
		answers.workingDays?.length &&
		answers.timeRange &&
		answers.sessionDuration &&
		answers.sessionType &&
		answers.timezone &&
		answers.recurrencePattern
	);
	const isPublishBusy = publishState === 'publishing' || isPublishing;
	const isPublishSuccess = publishState === 'success';
	const isSyncPending = publishState === 'sync-pending';

	const daysDisplay =
		answers.workingDays?.map((day) => t(`jupiter.days.${day}`)).join(', ') ??
		'—';

	const rows = useMemo(
		() => [
			{
				dotColor: palette.brand.google,
				key: 'calendar',
				label: t('jupiter.preview.label-calendar'),
				value: calendarName,
			},
			{
				dotColor: palette.primary.main,
				key: 'days',
				label: t('jupiter.preview.label-days'),
				value: daysDisplay,
			},
			{
				dotColor: palette.secondary.main,
				key: 'hours',
				label: t('jupiter.preview.label-hours'),
				value: answers.timeRange ?? '—',
			},
			{
				dotColor: palette.tertiary.main,
				key: 'duration',
				label: t('jupiter.preview.label-duration'),
				value: answers.sessionDuration ?? '—',
			},
			{
				dotColor: palette.success.main,
				key: 'session-type',
				label: t('jupiter.preview.label-session-type'),
				value: answers.sessionType
					? t(`jupiter.session-type.${answers.sessionType}`)
					: '—',
			},
			{
				dotColor: palette.info.main,
				key: 'timezone',
				label: t('jupiter.preview.label-timezone'),
				value: answers.timezone ?? detectedTimezone,
			},
			{
				dotColor: palette.warning.main,
				key: 'recurrence',
				label: t('jupiter.preview.label-recurrence'),
				value: answers.recurrencePattern
					? t(
							`jupiter.recurrence-pattern.value-${answers.recurrencePattern.toLowerCase()}`
						)
					: '—',
			},
		],
		[answers, calendarName, detectedTimezone, daysDisplay, t]
	);

	const handlePublishClick = useCallback(async () => {
		if (!canPublish || isPublishBusy || isPublishSuccess) return;
		setPublishState('publishing');
		const outcome = await onPublish();
		if (outcome === 'published') setPublishState('success');
		else if (outcome === 'sync-pending') setPublishState('sync-pending');
		else setPublishState('idle');
	}, [canPublish, isPublishBusy, isPublishSuccess, onPublish]);

	const handleRetryClick = useCallback(async () => {
		if (isPublishBusy) return;
		setPublishState('publishing');
		const synced = await onRetrySync();
		setPublishState(synced ? 'success' : 'sync-pending');
	}, [isPublishBusy, onRetrySync]);

	// In the sync-pending state the primary button retries the Google sync; the
	// idle/publishing/success states keep their source-aware publish copy.
	const publishLabel = (() => {
		if (!canPublish) return t('jupiter.preview.publish.blocked');
		if (isSyncPending) return t('jupiter.preview.sync.retry');
		return t(`jupiter.preview.publish.${source}.${publishState}`);
	})();

	return (
		<PreviewCardWrapper
			data-testid='jupiter-onboarding-preview-card'
			id='jupiter-onboarding-preview-card'
		>
			<PreviewHeader>
				<PreviewTitle>{t('jupiter.preview.title')}</PreviewTitle>
				<PreviewStatusPill data-testid='jupiter-onboarding-preview-status'>
					{t(`jupiter.preview.status.${source}`)}
				</PreviewStatusPill>
			</PreviewHeader>

			{rows.map(({ dotColor, key, label, value }) => (
				<PreviewRow key={key} data-testid={`jupiter-onboarding-preview-row-${key}`}>
					<PreviewDot dotColor={dotColor} />
					<PreviewLabel>{label}</PreviewLabel>
					<PreviewValue data-testid={`jupiter-onboarding-preview-value-${key}`}>
						{value}
					</PreviewValue>
				</PreviewRow>
			))}

			<PreviewFooter data-testid='jupiter-onboarding-preview-footer'>
				{t(`jupiter.preview.footer.${source}`, { calendar: calendarName })}
			</PreviewFooter>

			{isSyncPending ? (
				<StatusNote
					testId='jupiter-onboarding-preview-sync-pending'
					text={t('jupiter.preview.sync.pending')}
					type='warning'
				/>
			) : null}

			<ButtonGroup>
				<PublishButton
					aria-busy={isPublishBusy}
					aria-disabled={!canPublish || isPublishBusy || isPublishSuccess}
					aria-live='polite'
					disabled={!canPublish || isPublishBusy || isPublishSuccess}
					fullWidth
					loading={isPublishBusy}
					data-testid='jupiter-onboarding-preview-publish'
					data-publish-state={publishState}
					onClick={isSyncPending ? handleRetryClick : handlePublishClick}
				>
					{publishLabel}
				</PublishButton>
				<ResetButton
					onClick={isSyncPending ? onContinueWithoutSync : onReset}
					fullWidth
					tertiary
					data-testid={
						isSyncPending
							? 'jupiter-onboarding-preview-continue'
							: 'jupiter-onboarding-preview-reset'
					}
				>
					{isSyncPending
						? t('jupiter.preview.sync.continue')
						: t('jupiter.preview.reset')}
				</ResetButton>
			</ButtonGroup>
		</PreviewCardWrapper>
	);
};

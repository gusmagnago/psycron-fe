import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
	ButtonGroup,
	PreviewCardWrapper,
	PreviewDot,
	PreviewFooter,
	PreviewLabel,
	PreviewRow,
	PreviewTitle,
	PreviewValue,
	PublishButton,
	ResetButton,
} from './AvailabilityPreviewCard.styles';
import type { IAvailabilityPreviewCardProps } from './AvailabilityPreviewCard.types';

export const AvailabilityPreviewCard = ({
	answers,
	detectedTimezone,
	isPublishing,
	onPublish,
	onReset,
}: IAvailabilityPreviewCardProps) => {
	const { t } = useTranslation();

	const daysDisplay =
		answers.workingDays?.map((day) => t(`jupiter.days.${day}`)).join(', ') ??
		'—';

	const rows = useMemo(
		() => [
			{
				dotColor: palette.primary.main,
				label: t('jupiter.preview.label-days'),
				value: daysDisplay,
			},
			{
				dotColor: palette.secondary.main,
				label: t('jupiter.preview.label-hours'),
				value: answers.timeRange ?? '—',
			},
			{
				dotColor: palette.tertiary.main,
				label: t('jupiter.preview.label-duration'),
				value: answers.sessionDuration ?? '—',
			},
			{
				dotColor: palette.success.main,
				label: t('jupiter.preview.label-session-type'),
				value: answers.sessionType
				? t(`jupiter.session-type.${answers.sessionType}`)
				: '—',
			},
			{
				dotColor: palette.info.main,
				label: t('jupiter.preview.label-timezone'),
				value: answers.timezone ?? detectedTimezone,
			},
			{
				dotColor: palette.warning.main,
				label: t('jupiter.preview.label-recurrence'),
				value: answers.recurrencePattern
					? t(`jupiter.recurrence-pattern.value-${answers.recurrencePattern.toLowerCase()}`)
					: '—',
			},
		],
		[answers, detectedTimezone, daysDisplay, t]
	);

	return (
		<PreviewCardWrapper>
			<PreviewTitle>{t('jupiter.preview.title')}</PreviewTitle>

			{rows.map(({ dotColor, label, value }) => (
				<PreviewRow key={label}>
					<PreviewDot dotColor={dotColor} />
					<PreviewLabel>{label}</PreviewLabel>
					<PreviewValue>{value}</PreviewValue>
				</PreviewRow>
			))}

			<PreviewFooter>{t('jupiter.preview.footer')}</PreviewFooter>

			<ButtonGroup>
				<PublishButton onClick={onPublish} loading={isPublishing} fullWidth>
					{t('jupiter.preview.cta')}
				</PublishButton>
				<ResetButton onClick={onReset} fullWidth tertiary>
					{t('jupiter.preview.reset')}
				</ResetButton>
			</ButtonGroup>
		</PreviewCardWrapper>
	);
};

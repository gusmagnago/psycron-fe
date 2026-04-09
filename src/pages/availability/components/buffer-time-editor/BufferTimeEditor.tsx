import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@psycron/i18n';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import { BufferTimeAdviceLoading } from './BufferTimeAdviceLoading';
import {
	BufferEditorWrapper,
	BufferHelper,
	BufferOptionChip,
	BufferOptionChips,
	BufferPanel,
	BufferPanelText,
	BufferPanelTitle,
} from './BufferTimeEditor.styles';
import type { IBufferTimeEditorProps } from './BufferTimeEditor.types';
import { BUFFER_TIME_OPTIONS } from './BufferTimeEditor.utils';
import { useBufferTimeAdvice } from './useBufferTimeAdvice';

const formatDuration = (
	minutes: number,
	t: (key: string, options?: Record<string, unknown>) => string
): string => {
	if (minutes <= 0) return t('jupiter.post-publish.buffer-impact-minutes-value', { minutes: 0 });

	const locale = i18n.language.startsWith('pt') ? 'pt-PT' : 'en-GB';
	const hoursFormatter = new Intl.NumberFormat(locale, {
		style: 'unit',
		unit: 'hour',
		unitDisplay: 'short',
	});
	const minutesFormatter = new Intl.NumberFormat(locale, {
		style: 'unit',
		unit: 'minute',
		unitDisplay: 'short',
	});
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours > 0 && remainingMinutes > 0) {
		return `${hoursFormatter.format(hours)} ${minutesFormatter.format(
			remainingMinutes
		)}`;
	}

	if (hours > 0) {
		return hoursFormatter.format(hours);
	}

	return minutesFormatter.format(minutes);
};

export const BufferTimeEditor = ({
	adviceRequest,
	bufferInput,
	insights,
	onChange,
}: IBufferTimeEditorProps) => {
	const { t } = useTranslation();
	const dateLocale = i18n.language.startsWith('pt') ? ptBR : enGB;
	const { data: aiAdvice, isError, isFetching, isLoading } =
		useBufferTimeAdvice(adviceRequest);

	const packedDayLabel = useMemo(
		() =>
			insights.packedDay
				? format(parseISO(insights.packedDay.date), 'EEEE', {
						locale: dateLocale,
					})
				: null,
		[dateLocale, insights.packedDay]
	);
	const fallbackWarningSummary =
		insights.warningLevel === 'strong'
			? t('jupiter.post-publish.buffer-warning-strong-weekly')
			: insights.warningLevel === 'soft'
				? t('jupiter.post-publish.buffer-warning-soft-weekly')
				: null;
	const warningSummary = aiAdvice?.warningSummary ?? fallbackWarningSummary;
	const isThinking = !!adviceRequest && !aiAdvice && (isLoading || isFetching);
	const recommendationSummary = aiAdvice?.recommendationSummary ?? null;
	const packedDaySummary = aiAdvice?.packedDaySummary ?? null;
	const lightDaySummary = aiAdvice?.lightDaySummary ?? null;

	return (
		<BufferEditorWrapper>
			<BufferOptionChips
				aria-label={t('jupiter.post-publish.buffer-drawer-title')}
				role='radiogroup'
			>
				{BUFFER_TIME_OPTIONS.map((minutes) => (
					<BufferOptionChip
						key={minutes}
						aria-checked={bufferInput === String(minutes)}
						isSelected={bufferInput === String(minutes)}
						onClick={() => onChange(String(minutes))}
						role='radio'
					>
						{minutes} min
					</BufferOptionChip>
				))}
			</BufferOptionChips>

			<BufferHelper>{t('jupiter.post-publish.buffer-range-helper')}</BufferHelper>

			<BufferPanel>
				<BufferPanelTitle>
					{t('jupiter.post-publish.buffer-impact-title')}
				</BufferPanelTitle>
				<BufferPanelText>
					{insights.highlightDay
						? t('jupiter.post-publish.buffer-impact-day', {
								value: formatDuration(
									insights.highlightDay?.capacityImpactMinutes ?? 0,
									t
								),
						  })
						: t('jupiter.post-publish.buffer-impact-empty')}
				</BufferPanelText>
				<BufferPanelText>
					{t('jupiter.post-publish.buffer-impact-week', {
						value: formatDuration(insights.weeklyImpactMinutes, t),
					})}
				</BufferPanelText>
			</BufferPanel>

			<BufferPanel>
				<BufferPanelTitle>
					{t('jupiter.post-publish.buffer-jupiter-title')}
				</BufferPanelTitle>
				{isThinking ? (
					<BufferPanelText>
						<BufferTimeAdviceLoading />
					</BufferPanelText>
				) : recommendationSummary ? (
					<BufferPanelText>{recommendationSummary}</BufferPanelText>
				) : (
					<BufferPanelText>
						{isError
							? t('jupiter.post-publish.buffer-jupiter-unavailable')
							: t('jupiter.post-publish.buffer-jupiter-empty')}
					</BufferPanelText>
				)}
				{packedDaySummary && <BufferPanelText>{packedDaySummary}</BufferPanelText>}
				{lightDaySummary && <BufferPanelText>{lightDaySummary}</BufferPanelText>}
			</BufferPanel>

			{(insights.warningLevel !== 'none' || warningSummary) && (
				<BufferPanel
					severity={insights.warningLevel === 'strong' ? 'strong' : 'soft'}
				>
					<BufferPanelTitle>
						{t('jupiter.post-publish.buffer-warning-title')}
					</BufferPanelTitle>
					{insights.warningLevel === 'strong' && packedDayLabel ? (
						<BufferPanelText>
							{t('jupiter.post-publish.buffer-warning-overflow', {
								day: packedDayLabel,
							})}
						</BufferPanelText>
					) : null}
					{warningSummary && <BufferPanelText>{warningSummary}</BufferPanelText>}
				</BufferPanel>
			)}
		</BufferEditorWrapper>
	);
};

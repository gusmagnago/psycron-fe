import styled from '@emotion/styled';
import { Box, ButtonBase, TextField } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { QueueCardTone } from '../types/QueuePanel.types';

const getToneColor = (tone: QueueCardTone) => {
	switch (tone) {
		case 'error':
			return palette.error.main;
		case 'info':
			return palette.info.main;
		case 'success':
			return palette.success.main;
		case 'warning':
			return palette.warning.main;
		case 'neutral':
		default:
			return palette.gray['04'];
	}
};

export const QueueDetailLayout = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isExpanded',
})<{ isExpanded?: boolean }>`
	align-items: start;
	display: grid;
	flex: 1;
	gap: ${spacing.medium};
	grid-template-columns: ${({ isExpanded }) =>
		isExpanded ? 'minmax(0, 1fr)' : 'minmax(22rem, 2fr) minmax(0, 3fr)'};
	height: 100%;
	min-height: 0;
	overflow: hidden;

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr;
		height: auto;
		overflow: visible;
	}
`;

export const QueueDetailSidebar = styled(Box)`
	background: linear-gradient(
		180deg,
		${hexToRgba(palette.background.paper, 0.98)} 0%,
		${hexToRgba(palette.background.paper, 0.94)} 100%
	);
	border-radius: ${spacing.large};
	box-shadow: ${shadowMedium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	height: 100%;
	min-height: 0;
	overflow: hidden;
	padding: ${spacing.medium};

	${isSmallerThanTabletMedia} {
		height: auto;
	}
`;

export const QueueSidebarHeaderWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const QueueSidebarTitleRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	justify-content: space-between;
`;

export const QueueSidebarTitle = styled(Text)`
	font-size: 1.1rem;
	font-weight: 700;
`;

export const QueueSidebarCount = styled(Box)`
	align-items: center;
	color: var(--feature-page-accent, ${palette.secondary.main});
	display: inline-flex;
	font-size: 0.8rem;
	font-weight: 700;
	height: 1.8rem;
	justify-content: center;
	min-width: 1.8rem;
	padding: 0 ${spacing.xs};
`;

export const QueueSidebarSubtitle = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.9rem;
	line-height: 1.5;
`;

export const QueueFiltersSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const QueueFiltersToggleButton = styled(ButtonBase)`
	align-items: center;
	cursor: pointer;
	display: flex;
	gap: ${spacing.xs};
	justify-content: space-between;
	padding: ${spacing.xs};
	text-align: left;
	width: 100%;
	border-radius: ${spacing.mediumSmall};

	&:hover {
		background: ${hexToRgba(palette.gray['04'], 0.12)};
	}
`;

export const QueueFiltersToggleContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const QueueFiltersToggleTitle = styled(Text)`
	font-size: 0.92rem;
	font-weight: 700;
`;

export const QueueFiltersToggleSubtitle = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.8rem;
	line-height: 1.45;
`;

export const QueueFiltersLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.06em;
	text-transform: uppercase;
`;

export const QueueFiltersRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const QueueFilterChip = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	background: ${({ isActive }) =>
		isActive
			? `linear-gradient(135deg, var(--feature-page-accent-soft, ${hexToRgba(
					palette.secondary.main,
					0.14
				)}) 0%, var(--feature-page-accent-strong-soft, ${hexToRgba(
					palette.secondary.main,
					0.22
				)}) 100%)`
			: palette.background.default};
	border: 1px solid
		${({ isActive }) =>
			isActive
				? `var(--feature-page-accent-selected-border, ${hexToRgba(
						palette.secondary.main,
						0.28
					)})`
				: hexToRgba(palette.gray['04'], 0.18)};
	border-radius: 999px;
	box-shadow: ${({ isActive }) => (isActive ? shadowSmall : 'none')};
	color: ${({ isActive }) =>
		isActive ? palette.text.primary : palette.gray['06']};
	cursor: pointer;
	font-size: 0.85rem;
	font-weight: 600;
	height: 2.35rem;
	padding: 0 ${spacing.small};
	transition:
		border-color 160ms ease,
		box-shadow 160ms ease,
		transform 160ms ease;

	&:hover {
		border-color: var(
			--feature-page-accent-hover-border,
			${hexToRgba(palette.secondary.main, 0.24)}
		);
		transform: translateY(-1px);
	}
`;

export const QueueList = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xs};
	min-height: 0;
	overflow: auto;
	padding: ${spacing.xs};
	padding-top: 0;

	${isMobileMedia} {
		flex: none;
		height: auto;
		overflow: visible;
	}
`;

export const QueueStatsGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(auto-fit, minmax(3.5rem, 1fr));
`;

export const QueueStatCard = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const QueueStatLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const QueueStatValue = styled(Text)`
	font-size: 1.2rem;
	font-weight: 700;
`;

export const QueueEmptyState = styled(Box)`
	align-items: center;
	background: linear-gradient(
		180deg,
		${hexToRgba(palette.background.paper, 0.94)} 0%,
		${hexToRgba(palette.background.default, 0.9)} 100%
	);
	border: 1px dashed ${hexToRgba(palette.gray['04'], 0.25)};
	border-radius: ${spacing.large};
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xs};
	justify-content: center;
	min-height: 18rem;
	padding: ${spacing.large};
	text-align: center;

	${isMobileMedia} {
		min-height: 16rem;
		padding: ${spacing.medium};
	}
`;

export const QueueEmptyStateText = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.95rem;
	line-height: 1.55;
	max-width: 26rem;
`;

export const QueueSelectableCard = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'tone',
})<{ isSelected: boolean; tone?: QueueCardTone }>`
	align-items: flex-start;
	background: ${({ isSelected }) =>
		isSelected
			? `linear-gradient(180deg, var(--feature-page-accent-soft, ${hexToRgba(
					palette.secondary.main,
					0.14
				)}) 0%, var(--feature-page-accent-softer, ${hexToRgba(
					palette.secondary.main,
					0.04
				)}) 100%)`
			: palette.background.paper};
	border: 1px solid
		${({ isSelected, tone = 'neutral' }) =>
			isSelected
				? `var(--feature-page-accent-selected-border, ${hexToRgba(
						palette.secondary.main,
						0.3
					)})`
				: hexToRgba(getToneColor(tone), tone === 'neutral' ? 0.18 : 0.16)};
	border-radius: ${spacing.large};
	box-shadow: ${({ isSelected }) => (isSelected ? shadowMedium : shadowSmall)};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small};
	text-align: left;
	transition:
		border-color 180ms ease,
		box-shadow 180ms ease,
		transform 180ms ease;

	&:hover {
		border-color: var(
			--feature-page-accent-hover-border,
			${hexToRgba(palette.secondary.main, 0.22)}
		);
		transform: translateY(-1px);
	}

	${isMobileMedia} {
		border-radius: ${spacing.medium};
	}
`;

export const QueueSelectableCardMetaRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	justify-content: space-between;
	width: 100%;

	${isMobileMedia} {
		align-items: flex-start;
		flex-direction: column;
	}
`;

export const QueueSearchField = styled(TextField)`
	.MuiInputBase-root {
		background: ${palette.background.default};
		border-radius: ${spacing.medium};
		font-size: 0.9rem;
	}
`;

export const QueueDetailPanel = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.mediumSmall};
	min-height: 0;
`;

export const QueueDetailHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const QueueDetailEyebrow = styled(Text)`
	color: var(--feature-page-accent, ${palette.secondary.main});
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
`;

export const QueueDetailTitleRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	justify-content: space-between;
`;

export const QueueDetailTitle = styled(Text)`
	font-size: 1.4rem;
	font-weight: 700;
`;

export const QueueDetailSubtitle = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.92rem;
	line-height: 1.5;
`;

export const QueueDetailGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(2, minmax(0, 1fr));

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const QueueDetailCard = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.small};

	${isMobileMedia} {
		padding: 0;
	}
`;

export const QueueDetailLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
`;

export const QueueDetailValue = styled(Text)`
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.5;
	overflow-wrap: anywhere;
`;

export const QueueDetailMessage = styled(Text)`
	background: ${palette.background.default};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.16)};
	border-radius: ${spacing.medium};
	color: ${palette.text.primary};
	font-size: 0.92rem;
	line-height: 1.6;
	padding: ${spacing.medium};
	white-space: pre-wrap;
`;

export const QueueActionsRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};
	margin-top: auto;
`;

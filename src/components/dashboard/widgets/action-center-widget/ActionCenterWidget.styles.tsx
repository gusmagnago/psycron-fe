import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

type ActionCenterTone = 'danger' | 'info' | 'success' | 'today' | 'warning';

const getToneColor = (tone: ActionCenterTone): string => {
	switch (tone) {
		case 'danger':
			return palette.error.main;
		case 'info':
			return dashboardAccents.info.main;
		case 'today':
			return dashboardAccents.today.main;
		case 'warning':
			return palette.warning.main;
		case 'success':
			return palette.success.main;
	}
};

export const ActionCenterRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	height: 100%;
	min-width: 0;
`;

export const ActionCenterSummaryPanel = styled(Box)`
	align-items: center;
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: auto minmax(0, 1fr);
	min-width: 0;
	padding-top: ${spacing.xxs};
`;

export const ActionCenterSummaryCount = styled(Text)`
	color: ${palette.text.primary};
	font-size: 3.1rem;
	font-weight: 900;
	letter-spacing: 0;
	line-height: 0.9;
`;

export const ActionCenterSummaryText = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const ActionCenterSummaryTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.95rem;
	font-weight: 800;
`;

export const ActionCenterSummaryBody = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.8rem;
	font-weight: 650;
	line-height: 1.35;
`;

export const ActionCenterBreakdown = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xxs};
	margin-top: auto;
	min-width: 0;
`;

export const ActionCenterItemList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	min-width: 0;
`;

export const ActionCenterItemCard = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: Exclude<ActionCenterTone, 'success'> }>`
	align-items: center;
	background: ${({ tone }) => hexToRgba(getToneColor(tone), 0.08)};
	border: 1px solid ${({ tone }) => hexToRgba(getToneColor(tone), 0.18)};
	border-radius: ${spacing.extraSmall};
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: minmax(0, 1fr) auto;
	min-width: 0;
	padding: ${spacing.xs};
`;

export const ActionCenterItemText = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	min-width: 0;
`;

export const ActionCenterItemTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.78rem;
	font-weight: 800;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const ActionCenterItemMeta = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.72rem;
	font-weight: 700;
`;

export const ActionCenterItemButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: Exclude<ActionCenterTone, 'success'> }>`
	align-items: center;
	background: ${palette.white};
	border: 1px solid ${({ tone }) => hexToRgba(getToneColor(tone), 0.34)};
	border-radius: 999px;
	color: ${({ tone }) => getToneColor(tone)};
	cursor: pointer;
	display: inline-flex;
	font: inherit;
	font-size: 0.72rem;
	font-weight: 850;
	justify-content: center;
	min-height: 2rem;
	padding: ${spacing.space} ${spacing.xs};
	white-space: nowrap;

	&:hover {
		background: ${({ tone }) => hexToRgba(getToneColor(tone), 0.08)};
	}

	&:focus-visible {
		outline: 2px solid ${({ tone }) => getToneColor(tone)};
		outline-offset: 2px;
	}
`;

export const ActionCenterBreakdownItem = styled('span', {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: Exclude<ActionCenterTone, 'success'> }>`
	align-items: center;
	background: ${({ tone }) => hexToRgba(getToneColor(tone), 0.1)};
	border: 1px solid ${({ tone }) => hexToRgba(getToneColor(tone), 0.18)};
	border-radius: 999px;
	color: ${({ tone }) => getToneColor(tone)};
	display: inline-flex;
	font-size: 0.72rem;
	font-weight: 800;
	gap: ${spacing.xxs};
	line-height: 1;
	max-width: 100%;
	min-width: 0;
	padding: 0.28rem ${spacing.xs};

	span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

export const ActionCenterEmpty = styled(Box)`
	align-items: center;
	color: ${palette.text.secondary};
	display: flex;
	flex: 1;
	font-size: 0.875rem;
	font-weight: 700;
	justify-content: center;
	min-height: 2rem;
	text-align: center;
`;

export const ActionCenterSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;

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

export const ActionCenterHeader = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.small};
	justify-content: space-between;
	min-width: 0;
	padding-top: ${spacing.xxs};
`;

export const ActionCenterHeaderTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 1rem;
	font-weight: 850;
`;

export const ActionCenterHeaderChip = styled(Box)`
	align-items: center;
	background: ${palette.white};
	border-radius: 999px;
	box-shadow: 0 2px 8px rgba(14, 18, 22, 0.08);
	color: ${palette.text.primary};
	display: inline-flex;
	flex-shrink: 0;
	font-size: 0.75rem;
	font-weight: 850;
	justify-content: center;
	min-height: 1.9rem;
	min-width: 4rem;
	padding: 0 ${spacing.small};
	white-space: nowrap;
`;

export const ActionCenterBody = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xs};
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

export const ActionCenterItemTone = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: Exclude<ActionCenterTone, 'success'> }>`
	background: ${({ tone }) => getToneColor(tone)};
	border-radius: 999px;
	flex-shrink: 0;
	height: 0.5rem;
	width: 0.5rem;
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
	background: ${palette.white};
	border-radius: ${spacing.small};
	box-shadow: 0 2px 10px rgba(14, 18, 22, 0.08);
	color: ${palette.text.secondary};
	display: flex;
	flex: 1;
	flex-direction: column;
	font-size: 0.875rem;
	font-weight: 700;
	justify-content: center;
	gap: ${spacing.xxs};
	min-height: 13rem;
	padding: ${spacing.large};
	text-align: center;
`;

export const ActionCenterEmptyIcon = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.brand.purple, 0.1)};
	border-radius: 999px;
	color: ${palette.brand.purple};
	display: inline-flex;
	height: 2.5rem;
	justify-content: center;
	width: 2.5rem;
`;

export const ActionCenterEmptyTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 1rem;
	font-weight: 850;
`;

export const ActionCenterEmptyBody = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.85rem;
	font-weight: 650;
	line-height: 1.4;
	max-width: 22rem;
`;

export const ActionCenterSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;

import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const ActionsList = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isWide',
})<{ isWide?: boolean }>`
	display: grid;
	grid-template-columns: ${({ isWide }) => (isWide ? 'repeat(2, 1fr)' : '1fr')};
	gap: ${spacing.xs};
`;

export const ActionSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;

export const ActionButton = styled(motion.button)`
	all: unset;
	display: grid;
	grid-template-columns: auto minmax(0, 1fr) auto auto;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xs} 0;
	border-bottom: 1px solid ${palette.gray['01']};
	background: transparent;
	cursor: pointer;
	transition:
		color 0.16s ease,
		opacity 0.16s ease;
	position: relative;

	&:hover {
		color: ${palette.text.primary};
	}

	&:hover [data-chevron] {
		opacity: 0.65;
		transform: translateX(2px);
	}

	&:focus-visible {
		outline: 2px solid ${dashboardAccents.info.main};
		outline-offset: 2px;
		border-radius: ${spacing.xs};
	}
`;

export const ActionText = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const ActionLabel = styled(Text)`
	font-size: 0.875rem;
	font-weight: 800;
	color: ${palette.text.primary};
	overflow: hidden;
	text-align: left;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const ActionDescription = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 700;
	overflow: hidden;
	text-align: left;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const ActionChevron = styled(Box)`
	display: flex;
	align-items: center;
	color: ${palette.text.secondary};
	opacity: 0.35;
	flex-shrink: 0;
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
`;

export const Badge = styled(Box)`
	background: ${dashboardAccents.warning.surface};
	border: 1px solid ${dashboardAccents.warning.border};
	color: ${dashboardAccents.warning.contrast};
	font-size: 11px;
	font-weight: 700;
	border-radius: 99px;
	min-width: 18px;
	height: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 ${spacing.space};
`;

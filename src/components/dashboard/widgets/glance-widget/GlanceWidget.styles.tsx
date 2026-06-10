import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowDashboardTile, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const GlanceRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	height: 100%;
	min-height: 0;
`;

export const GlanceStatCard = styled(motion.button)`
	all: unset;
	align-items: center;
	background: ${palette.white};
	border-radius: ${spacing.mediumSmall};
	box-shadow: ${shadowDashboardTile};
	display: flex;
	flex: 1;
	gap: ${spacing.small};
	min-width: 0;
	min-height: 0;
	padding: ${spacing.small} ${spacing.mediumSmall};
	width: 100%;
	transition:
		box-shadow 0.22s ease,
		transform 0.22s ease;
	cursor: pointer;
	text-align: left;

	&:hover {
		box-shadow: ${shadowSmall};
		transform: translateY(-3px);
	}

	&:focus-visible {
		outline: 2px solid ${palette.tertiary.main};
		outline-offset: 2px;
	}
`;

export const GlanceIconBox = styled('span', {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: DashboardAccentTone }>`
	align-items: center;
	background: ${palette.white};
	border-radius: 12px;
	box-shadow: ${shadowSmall};
	color: ${({ tone }) => dashboardAccents[tone].main};
	display: inline-flex;
	flex-shrink: 0;
	height: 40px;
	justify-content: center;
	width: 40px;

	& svg {
		height: 23px;
		width: 23px;
	}
`;

export const GlanceCopy = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const GlanceValue = styled(Text)`
	color: ${palette.text.primary};
	font-size: 1.25rem;
	font-weight: 700;
	line-height: 1.1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const GlanceLabel = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 600;
	line-height: 1.2;
`;

export const GlanceSkeleton = styled(Skeleton)`
	border-radius: ${spacing.small};
	flex: 1;
	min-height: 4.5rem;
`;

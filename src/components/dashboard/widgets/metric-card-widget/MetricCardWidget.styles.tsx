import styled from '@emotion/styled';
import { Avatar as MUIAvatar, Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const MetricRoot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isInteractive',
})<{ isInteractive?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	height: 100%;
	cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};

	&:focus-visible {
		outline: ${({ isInteractive }) =>
			isInteractive ? `2px solid ${palette.primary.main}` : 'none'};
		outline-offset: 2px;
		border-radius: ${spacing.extraSmall};
	}
`;

export const MetricTopRow = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
`;

export const MetricIconBadge = styled(Box)`
	width: 36px;
	height: 36px;
	border-radius: 10px;
	background: ${palette.primary.surface.light};
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${palette.primary.dark};
	flex-shrink: 0;
`;

export const MetricValue = styled(motion.span)`
	font-size: 40px;
	font-weight: 800;
	letter-spacing: -0.03em;
	color: ${palette.text.primary};
	line-height: 1;
`;

export const MetricLabel = styled(Text)`
	font-size: 13px;
	font-weight: 500;
	color: ${palette.text.secondary};
`;

export const MetricSubLabel = styled(Text)`
	font-size: 12px;
	color: ${palette.text.disabled};
`;

export const DeltaChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isPositive',
})<{ isPositive: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: ${spacing.space};
	font-size: 12px;
	font-weight: 600;
	padding: ${spacing.space} ${spacing.xs};
	border-radius: 99px;
	background: ${({ isPositive }) =>
		isPositive ? palette.success.surface.light : palette.error.surface.light};
	color: ${({ isPositive }) =>
		isPositive ? palette.success.dark : palette.error.dark};
`;

export const StyledAvatar = styled(MUIAvatar, {
	shouldForwardProp: (prop) => prop !== 'avatarColor',
})<{ avatarColor: string }>`
	background-color: ${({ avatarColor }) => avatarColor};
	border: 2px solid ${palette.white};
	font-size: 11px;
	font-weight: 700;
	height: 28px;
	width: 28px;

	&:not(:first-of-type) {
		margin-left: -${spacing.xs};
	}
`;

export const AvatarStack = styled(Box)`
	display: flex;
	align-items: center;
`;

export const OverflowBadge = styled(Box)`
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: ${palette.gray['02']};
	border: 2px solid ${palette.white};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	font-weight: 700;
	color: ${palette.text.secondary};
	margin-left: -${spacing.xs};
`;

export const SparklineWrapper = styled(Box)`
	flex: 1;
	display: flex;
	align-items: flex-end;
	min-height: 40px;
`;

export const MetricBottomRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.xs};
	margin-top: auto;
`;

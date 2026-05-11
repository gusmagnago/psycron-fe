import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowInnerPress,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const ScheduleRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	gap: ${spacing.xs};
`;

export const SkeletonList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const SlotSkeleton = styled(Skeleton)`
	border-radius: ${spacing.extraSmall};
`;

export const ScheduleScrollBox = styled(Box)`
	overflow-y: auto;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2px;

	scrollbar-width: thin;
	scrollbar-color: ${palette.gray['02']} transparent;
`;

export const EmptyState = styled(Box)`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.5;
	font-size: 0.875rem;
	text-align: center;
	padding: ${spacing.large} ${spacing.small};
	color: ${palette.text.secondary};
`;

export const SlotRow = styled(motion.div, {
	shouldForwardProp: (prop) => prop !== 'isLive',
})<{ isLive: boolean }>`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xs} ${spacing.extraSmall};
	border-radius: ${spacing.xs};
	background: ${({ isLive }) =>
		isLive
			? `color-mix(in oklab, ${palette.success.main} 6%, transparent)`
			: 'transparent'};
	border: 1px solid
		${({ isLive }) => (isLive ? palette.success.main : 'transparent')};
	transition: background 0.2s ease;

	&:hover {
		background: ${palette.gray['01']};
	}
`;

export const SlotTime = styled.span`
	font-size: 0.8125rem;
	font-weight: 600;
	color: ${palette.text.secondary};
	min-width: 44px;
	flex-shrink: 0;
	font-variant-numeric: tabular-nums;
`;

export const SlotBody = styled(Box)`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 1px;
`;

export const SlotPatientName = styled.span`
	font-size: 0.875rem;
	font-weight: 600;
	color: ${palette.text.primary};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const SlotMeta = styled.span`
	display: flex;
	align-items: center;
	gap: ${spacing.space};
	font-size: 0.75rem;
	color: ${palette.text.secondary};
`;

export const StatusChip = styled.span<{
	status: 'confirmed' | 'done' | 'live' | 'pending';
}>`
	font-size: 0.6875rem;
	font-weight: 700;
	padding: ${spacing.space} ${spacing.xs};
	border-radius: 99px;
	flex-shrink: 0;

	${({ status }) => {
		if (status === 'live')
			return css`
				background: ${palette.success.main};
				color: ${palette.white};
				animation: livePulse 2s ease-in-out infinite;
				@keyframes livePulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.7;
					}
				}
			`;
		if (status === 'confirmed')
			return css`
				background: ${palette.primary.surface.light};
				color: ${palette.primary.dark};
			`;
		if (status === 'pending')
			return css`
				background: ${palette.alert.surface.light};
				color: ${palette.alert.dark};
			`;
		return css`
			background: ${palette.gray['01']};
			color: ${palette.gray['07']};
		`;
	}}
`;

export const ProgressBarWrapper = styled(Box)`
	margin-top: ${spacing.xs};
	border-radius: 99px;
	background: ${palette.gray['01']};
	height: ${spacing.space};
	overflow: hidden;
`;

export const ProgressBarFill = styled(motion.div)`
	height: 100%;
	background: linear-gradient(
		90deg,
		${palette.success.main},
		${palette.primary.main}
	);
	border-radius: 99px;
`;

export const WidgetHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: ${spacing.xs};
	flex-shrink: 0;
`;

export const WidgetTitle = styled.h2`
	margin: 0;
	font-size: 0.9375rem;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const CountBadge = styled.div`
	font-size: 0.8125rem;
	color: ${palette.text.secondary};
`;

export const CountHighlight = styled.span`
	font-size: 1.75rem;
	font-weight: 800;
	color: ${palette.text.primary};
	line-height: 1;
`;

export const SlotDateLabel = styled.span`
	font-size: 0.6875rem;
	font-weight: 600;
	color: ${palette.text.disabled};
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const ScheduleSwitcher = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.space};
	background: ${palette.gray['01']};
	border-radius: ${spacing.small};
	padding: ${spacing.space};
	box-shadow: ${shadowInnerPress};
`;

export const SwitcherOption = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	all: unset;
	position: relative;
	display: flex;
	align-items: center;
	gap: ${spacing.space};
	padding: ${spacing.space} ${spacing.xs};
	border-radius: ${spacing.small};
	font-size: 0.75rem;
	font-weight: 600;
	cursor: pointer;
	overflow: hidden;
	white-space: nowrap;
	transition:
		background 0.2s ease,
		color 0.2s ease;

	background: ${({ isActive }) =>
		isActive ? palette.primary.main : 'transparent'};
	color: ${({ isActive }) =>
		isActive ? palette.text.primary : palette.text.secondary};
	box-shadow: ${({ isActive }) => (isActive ? shadowSmall : 'none')};

	&:hover {
		color: ${palette.text.primary};
	}

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 2px;
	}
`;


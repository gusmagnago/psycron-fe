import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Chip } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const ScheduleScrollBox = styled(Box)`
	overflow-y: auto;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2px;

	scrollbar-width: thin;
	scrollbar-color: ${palette.gray['02']} transparent;
`;

export const SlotRow = styled(motion.div, {
	shouldForwardProp: (prop) => prop !== 'isLive',
})<{ isLive: boolean }>`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: 10px ${spacing.extraSmall};
	border-radius: 10px;
	background: ${({ isLive }) =>
		isLive ? 'rgba(0, 199, 119, 0.06)' : 'transparent'};
	border: 1px solid
		${({ isLive }) => (isLive ? palette.success.main : 'transparent')};
	transition: background 0.2s ease;

	&:hover {
		background: ${palette.gray['01']};
	}
`;

export const SlotTime = styled.span`
	font-size: 13px;
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
	font-size: 14px;
	font-weight: 600;
	color: ${palette.text.primary};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const SlotMeta = styled.span`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: ${palette.text.secondary};
`;

export const StatusChip = styled.span<{ status: 'confirmed' | 'done' | 'live' | 'pending' }>`
	font-size: 11px;
	font-weight: 700;
	padding: 2px 8px;
	border-radius: 99px;
	flex-shrink: 0;
	${({ status }) => {
		if (status === 'live')
			return css`
				background: ${palette.success.main};
				color: #fff;
				animation: livePulse 2s ease-in-out infinite;
				@keyframes livePulse {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.7; }
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
	height: 4px;
	overflow: hidden;
`;

export const ProgressBarFill = styled(motion.div)`
	height: 100%;
	background: linear-gradient(90deg, ${palette.success.main}, ${palette.primary.main});
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
	font-size: 15px;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const CountBadge = styled.div`
	font-size: 13px;
	color: ${palette.text.secondary};
`;

export const CountHighlight = styled.span`
	font-size: 28px;
	font-weight: 800;
	color: ${palette.text.primary};
	line-height: 1;
`;

export const ViewWeekLink = styled.a`
	font-size: 13px;
	font-weight: 600;
	color: ${palette.primary.dark};
	text-decoration: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 3px;

	&:hover {
		color: ${palette.tertiary.main};
	}
`;

// suppress unused export warning — used for reuse in other widgets
export const LiveChip = styled(Chip)`
	height: 20px;
	font-size: 10px;
	font-weight: 700;
	background: ${palette.success.main};
	color: #fff;
	letter-spacing: 0.05em;
`;

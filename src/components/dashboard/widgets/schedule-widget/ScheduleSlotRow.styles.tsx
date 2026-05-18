import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

import type { SlotStatusChip } from './ScheduleWidget.types';

const accentColor = (status: SlotStatusChip): string => {
	if (status === 'live') return palette.success.main;
	if (status === 'confirmed') return palette.primary.main;
	if (status === 'pending') return palette.alert.main;
	return palette.gray['03'];
};

export const SlotRowRoot = styled(motion.div, {
	shouldForwardProp: (prop) => prop !== 'status',
})<{ status: SlotStatusChip }>`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xs} ${spacing.extraSmall};
	border-radius: ${spacing.small};
	border: 1px solid ${palette.gray['01']};
	box-shadow: inset 3px 0 0 ${({ status }) => accentColor(status)};
	cursor: pointer;
	transition:
		background 0.2s ease,
		box-shadow 0.2s ease;

	${({ status }) =>
		status === 'live' &&
		css`
			background: color-mix(in oklab, ${palette.success.main} 6%, transparent);
			border-color: ${palette.success.main};
		`}

	&:hover {
		box-shadow:
			inset 3px 0 0 ${({ status }) => accentColor(status)},
			${shadowSmall};
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
	text-align: left;
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

export const SlotDateLabel = styled.span`
	font-size: 0.6875rem;
	font-weight: 600;
	color: ${palette.text.disabled};
	text-transform: uppercase;
	letter-spacing: 0.05em;
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

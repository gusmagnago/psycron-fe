import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

import type { ScheduleSlotStatus } from './ScheduleWidget.types';

export const SlotRowRoot = styled(motion.button, {
	shouldForwardProp: (prop) => prop !== 'status',
})<{ status: ScheduleSlotStatus }>`
	all: unset;
	display: flex;
	align-items: center;
	width: 100%;
	gap: ${spacing.xs};
	padding: ${spacing.small} 0;
	background: ${({ status }) =>
		status === 'cancelled' ? palette.warning.surface.light : palette.white};
	border: 0;
	border-bottom: 1px solid ${palette.gray['01']};
	cursor: pointer;
	transition:
		background 0.2s ease,
		box-shadow 0.2s ease,
		transform 0.2s ease;

	${({ status }) =>
		status === 'cancelled' &&
		css`
			border-bottom-color: ${palette.warning.surface.dark};
		`}

	&:last-of-type {
		border-bottom: 0;
	}

	&:hover {
		box-shadow: 0 1px 2px rgba(20, 24, 33, 0.04),
			0 8px 24px -12px rgba(20, 24, 33, 0.1);
		transform: translateY(-1px);
	}

	&:focus-visible {
		outline: 2px solid ${palette.brand.purple};
		outline-offset: 2px;
	}
`;

export const SlotTime = styled.span`
	font-size: 0.8125rem;
	font-weight: 600;
	color: ${palette.text.secondary};
	min-width: 48px;
	flex-shrink: 0;
	font-variant-numeric: tabular-nums;
`;

export const SlotBody = styled(Box)`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: ${spacing.xs};
	text-align: left;
`;

export const SlotPatientName = styled.span`
	font-size: 0.875rem;
	font-weight: 700;
	color: ${palette.text.primary};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const SlotMeta = styled.span`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	font-size: 0.6875rem;
	color: ${palette.text.secondary};
	white-space: nowrap;
`;

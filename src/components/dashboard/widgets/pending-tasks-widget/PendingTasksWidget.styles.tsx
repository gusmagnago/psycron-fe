import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

import type { PendingTaskType } from './PendingTasksWidget.types';

const taskColors: Record<PendingTaskType, { bg: string; color: string }> = {
	'cancellation-followups': {
		bg: palette.alert.surface.light,
		color: palette.alert.dark,
	},
	'missing-billing': {
		bg: palette.primary.surface.light,
		color: palette.primary.dark,
	},
	'missing-contact': {
		bg: palette.tertiary.surface.light,
		color: palette.tertiary.dark,
	},
	'reminder-delivery': {
		bg: palette.error.surface.light,
		color: palette.error.dark,
	},
	'setup-availability': {
		bg: palette.success.surface.light,
		color: palette.success.dark,
	},
};

export const TasksList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const EmptyTasksState = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 14px;
	line-height: 1.4;
	padding: ${spacing.small} 0;
`;

export const TaskRow = styled(motion.button, {
	shouldForwardProp: (prop) => prop !== 'taskType',
})<{ taskType: PendingTaskType }>`
	all: unset;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${spacing.extraSmall} ${spacing.small};
	border-radius: 12px;
	cursor: pointer;
	width: 100%;
	box-sizing: border-box;
	transition: opacity 0.15s ease;

	${({ taskType }) => css`
		background: ${taskColors[taskType].bg};
		color: ${taskColors[taskType].color};
	`}

	&:hover {
		opacity: 0.85;
	}

	&:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}
`;

export const TaskLabel = styled.span`
	font-size: 14px;
	font-weight: 600;
`;

export const TaskCount = styled.span`
	font-size: 18px;
	font-weight: 800;
	line-height: 1;
`;

import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const TasksList = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isWide',
})<{ isWide?: boolean }>`
	display: grid;
	grid-template-columns: ${({ isWide }) => (isWide ? 'repeat(2, 1fr)' : '1fr')};
	gap: 0;
`;

export const EmptyTasksState = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	gap: ${spacing.xs};
	justify-content: center;
	min-height: 5rem;
	text-align: center;
`;

export const EmptyTasksIcon = styled(Box)`
	display: flex;
	align-items: center;
	color: ${palette.success.main};
	margin-bottom: ${spacing.xxs};

	& svg {
		width: 50px;
		height: 50px;
	}
`;

export const EmptyTasksHeading = styled.span`
	font-size: 14px;
	font-weight: 700;
	color: ${palette.text.primary};
	text-align: left;
`;

export const EmptyTasksSubText = styled.span`
	font-size: 12px;
	color: ${palette.text.secondary};
	text-align: center;
	line-height: 1.4;
`;

export const TaskSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;

export const TaskRow = styled(motion.button)`
	all: unset;
	display: grid;
	align-items: center;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: ${spacing.small};
	padding: ${spacing.xs} 0;
	border-bottom: 1px solid ${palette.gray['01']};
	cursor: pointer;
	width: 100%;
	box-sizing: border-box;
	transition: color 0.15s ease;

	&:hover {
		color: ${palette.text.primary};
	}

	&:focus-visible {
		border-radius: ${spacing.xs};
		outline: 2px solid ${dashboardAccents.info.main};
		outline-offset: 2px;
	}
`;

export const TaskText = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const TaskLabel = styled.span`
	color: ${palette.text.primary};
	font-size: 0.875rem;
	font-weight: 800;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const TaskDescription = styled.span`
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 700;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

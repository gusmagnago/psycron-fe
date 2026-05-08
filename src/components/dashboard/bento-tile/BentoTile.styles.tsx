import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const glassTile = css`
	background: rgba(255, 255, 255, 0.55);
	backdrop-filter: blur(20px) saturate(140%);
	-webkit-backdrop-filter: blur(20px) saturate(140%);
	border: 1px solid color-mix(in oklab, white 40%, transparent);
	border-radius: 24px;
	box-shadow:
		0 8px 32px rgba(6, 11, 14, 0.06),
		0 1px 0 rgba(255, 255, 255, 0.6) inset;
	overflow: hidden;
	position: relative;
	transition:
		box-shadow 0.2s ease,
		border-color 0.2s ease;

	&:hover {
		box-shadow:
			0 12px 40px rgba(6, 11, 14, 0.1),
			0 1px 0 rgba(255, 255, 255, 0.6) inset;
	}

	@media (prefers-color-scheme: dark) {
		background: rgba(6, 11, 14, 0.45);
		border-color: rgba(255, 255, 255, 0.08);
	}
`;

export const editModeStyles = css`
	border: 2px dashed ${palette.tertiary.main};
	cursor: grab;

	&:active {
		cursor: grabbing;
	}
`;

export const draggingStyles = css`
	opacity: 0.5;
	scale: 0.97;
`;

export const hiddenStyles = css`
	opacity: 0.4;
	pointer-events: none;
`;

export const BentoTileRoot = styled('div', {
	shouldForwardProp: (prop) =>
		prop !== 'isDragging' &&
		prop !== 'isEditMode' &&
		prop !== 'isHidden' &&
		prop !== 'colSpan' &&
		prop !== 'rowSpan',
})<{
	colSpan?: number;
	isDragging?: boolean;
	isEditMode?: boolean;
	isHidden?: boolean;
	rowSpan?: number;
}>`
	grid-column: span ${({ colSpan }) => colSpan ?? 1};
	grid-row: span ${({ rowSpan }) => rowSpan ?? 1};
	min-height: 0;
	${({ isDragging }) => isDragging && draggingStyles}
	${({ isHidden }) => isHidden && hiddenStyles}
`;

export const jupiterTile = css`
	background: linear-gradient(
		135deg,
		${palette.tertiary.light} 0%,
		rgba(191, 167, 255, 0.35) 40%,
		rgba(255, 153, 200, 0.25) 100%
	);
	border: 1px solid rgba(191, 167, 255, 0.4);
	backdrop-filter: blur(20px) saturate(140%);
	-webkit-backdrop-filter: blur(20px) saturate(140%);
`;

export const BentoTileMotionBox = styled(motion.div, {
	shouldForwardProp: (prop) => prop !== 'isEditMode' && prop !== 'variant',
})<{ isEditMode?: boolean; variant?: string }>`
	${glassTile}
	${({ variant }) => variant === 'jupiter' && jupiterTile}
	${({ isEditMode }) => isEditMode && editModeStyles}
	height: 100%;
	position: relative;
`;

export const BentoTileInner = styled(Box)`
	height: 100%;
	padding: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const BentoTileControls = styled(Box)`
	position: absolute;
	top: ${spacing.small};
	right: ${spacing.small};
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	z-index: 2;
`;

export const DragHandle = styled(Box)`
	cursor: grab;
	color: ${palette.gray['05']};
	font-size: 18px;
	line-height: 1;
	user-select: none;
	padding: 2px 4px;
	border-radius: 4px;
	transition: color 0.15s ease;

	&:hover {
		color: ${palette.tertiary.main};
	}

	&:active {
		cursor: grabbing;
	}
`;

export const VisibilityButton = styled(Box)`
	cursor: pointer;
	color: ${palette.gray['05']};
	display: flex;
	align-items: center;
	padding: 2px;
	border-radius: 4px;
	transition: color 0.15s ease;

	&:hover {
		color: ${palette.tertiary.main};
	}
`;

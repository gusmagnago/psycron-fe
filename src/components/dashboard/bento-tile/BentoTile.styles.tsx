import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { bentoTileTheme } from '@psycron/theme/dashboard/bentoTile.theme';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowDashboardTile,
	shadowSmallPurple,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const glassTile = css`
	background: ${palette.white};
	border-radius: ${bentoTileTheme.radius.tile};
	box-shadow: ${shadowDashboardTile};
	overflow: hidden;
	position: relative;
	transition: ${bentoTileTheme.motion.tileTransition};

	&:hover {
		box-shadow: ${shadowSmallPurple};
	}

	@media (prefers-color-scheme: dark) {
		background: ${bentoTileTheme.color.darkBackground};
		border-color: ${bentoTileTheme.color.darkBorder};
	}
`;

export const editModeStyles = css`
	border: ${bentoTileTheme.border.tileEdit} dashed ${palette.tertiary.main};
	cursor: grab;

	&:active {
		cursor: grabbing;
	}
`;

export const hiddenStyles = css`
	opacity: ${bentoTileTheme.opacity.hidden};
`;

export const BentoTileRoot = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'isEditMode' &&
		prop !== 'isHidden' &&
		prop !== 'colSpan' &&
		prop !== 'rowSpan',
})<{
	colSpan?: number;
	isEditMode?: boolean;
	isHidden?: boolean;
	rowSpan?: number;
}>`
	grid-column: span ${({ colSpan }) => colSpan ?? 1};
	grid-row: span ${({ rowSpan }) => rowSpan ?? 1};
	min-height: 0;
	min-width: 0;
	${({ isHidden }) => isHidden && hiddenStyles}
	${({ isHidden, isEditMode }) =>
		isHidden &&
		!isEditMode &&
		css`
			display: none;
		`}
`;

export const DropTargetOverlay = styled('div')`
	position: absolute;
	inset: ${spacing.none};
	border-radius: ${bentoTileTheme.radius.dropTarget};
	border: ${bentoTileTheme.border.tileEdit} dashed ${palette.success.main};
	background: color-mix(
		in oklab,
		${palette.success.main} 10%,
		${palette.white} 90%
	);
	pointer-events: none;
	z-index: ${bentoTileTheme.elevation.overlay};

	@media (prefers-color-scheme: dark) {
		background: color-mix(
			in oklab,
			${palette.success.main} 10%,
			${palette.black} 90%
		);
	}
`;

export const jupiterTile = css`
	background-color: ${palette.brand.light};
	backdrop-filter: blur(${bentoTileTheme.backdrop.blur})
		saturate(${bentoTileTheme.backdrop.saturation});
	-webkit-backdrop-filter: blur(${bentoTileTheme.backdrop.blur})
		saturate(${bentoTileTheme.backdrop.saturation});
`;

export const greetingTile = css`
	background: ${palette.white};
`;

export const glanceTile = css`
	background: transparent;
	box-shadow: none;
	overflow: visible;

	&:hover {
		box-shadow: none;
	}
`;

export const BentoTileMotionBox = styled(motion.div, {
	shouldForwardProp: (prop) => prop !== 'isEditMode' && prop !== 'variant',
})<{ isEditMode?: boolean; variant?: string }>`
	${glassTile}
	${({ variant }) => variant === 'glance' && glanceTile}
	${({ variant }) => variant === 'jupiter' && jupiterTile}
	${({ variant }) => variant === 'greeting' && greetingTile}
	${({ isEditMode }) => isEditMode && editModeStyles}
	height: 100%;
	position: relative;
`;

export const BentoTileInner = styled(Box, {
	shouldForwardProp: (prop: string) =>
		prop !== 'hasFooterChrome' && prop !== 'hasHeaderChrome',
})<{ hasFooterChrome: boolean; hasHeaderChrome: boolean }>`
	height: 100%;
	min-height: 0;
	padding: ${spacing.mediumSmall};
	display: grid;
	grid-template-rows: ${({ hasFooterChrome, hasHeaderChrome }) => {
		if (hasHeaderChrome && hasFooterChrome) return 'auto minmax(0, 1fr) auto';
		if (hasHeaderChrome) return 'auto minmax(0, 1fr)';
		if (hasFooterChrome) return 'minmax(0, 1fr) auto';
		return 'minmax(0, 1fr)';
	}};
	gap: 0;
`;

export const BentoTileHeaderIdentity = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	min-width: 0;
`;

export const BentoTileHeaderIcon = styled(Box)`
	align-items: center;
	color: ${palette.brand.purple};
	display: inline-flex;
	flex-shrink: 0;
	justify-content: center;
`;

export const BentoTileHeaderTitle = styled(Box)`
	color: ${palette.text.primary};
	font-size: ${bentoTileTheme.size.headerTitleFont};
	font-weight: 700;
	line-height: 1.2;
	min-width: 0;
`;

export const BentoTileEditFloat = styled(motion.div)`
	height: 100%;
	width: 100%;
	position: relative;
`;

export const BentoTileBody = styled(Box)`
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
`;

export const TileControlIconWrap = styled('span')`
	color: ${bentoTileTheme.color.control};
	align-items: center;
	display: inline-flex;
	justify-content: center;
	padding: ${bentoTileTheme.space.controlInset};
	border-radius: ${bentoTileTheme.radius.control};
	transition: ${bentoTileTheme.motion.colorTransition};

	&:hover {
		color: ${bentoTileTheme.color.controlHover};
	}

	&:focus-visible {
		outline: ${bentoTileTheme.border.focus} solid ${palette.tertiary.main};
		outline-offset: ${bentoTileTheme.border.focus};
	}

	& svg {
		height: ${spacing.small};
		width: ${spacing.small};
	}
`;

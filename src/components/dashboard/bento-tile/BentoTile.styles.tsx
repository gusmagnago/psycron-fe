import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { bentoTileTheme } from '@psycron/theme/dashboard/bentoTile.theme';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowGlassShimmer,
	shadowMedium,
	shadowSmallPurple,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const glassTile = css`
	background: ${palette.background.default};
	backdrop-filter: blur(${bentoTileTheme.backdrop.blur})
		saturate(${bentoTileTheme.backdrop.saturation});
	border-radius: ${bentoTileTheme.radius.tile};
	box-shadow: ${shadowMedium}, ${shadowGlassShimmer};
	overflow: hidden;
	position: relative;
	transition: ${bentoTileTheme.motion.tileTransition};

	&:hover {
		box-shadow: ${shadowSmallPurple}, ${shadowGlassShimmer};
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
	pointer-events: none;
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
	background: linear-gradient(
		135deg,
		${palette.tertiary.light} 0%,
		${bentoTileTheme.jupiter.tertiaryStop} 40%,
		${bentoTileTheme.jupiter.secondaryStop} 100%
	);
	backdrop-filter: blur(${bentoTileTheme.backdrop.blur})
		saturate(${bentoTileTheme.backdrop.saturation});
	-webkit-backdrop-filter: blur(${bentoTileTheme.backdrop.blur})
		saturate(${bentoTileTheme.backdrop.saturation});
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

export const BentoTileInner = styled(Box, {
	shouldForwardProp: (prop: string) =>
		prop !== 'hasFooterChrome' && prop !== 'hasHeaderChrome',
})<{ hasFooterChrome: boolean; hasHeaderChrome: boolean }>`
	height: 100%;
	min-height: 0;
	padding: ${spacing.medium};
	display: grid;
	grid-template-rows: ${({ hasFooterChrome, hasHeaderChrome }) => {
		if (hasHeaderChrome && hasFooterChrome) return 'auto minmax(0, 1fr) auto';
		if (hasHeaderChrome) return 'auto minmax(0, 1fr)';
		if (hasFooterChrome) return 'minmax(0, 1fr) auto';
		return 'minmax(0, 1fr)';
	}};
	gap: ${({ hasFooterChrome, hasHeaderChrome }) =>
		hasFooterChrome || hasHeaderChrome ? spacing.small : 0};
`;

export const BentoTileHeader = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.xs};
	justify-content: space-between;
	min-width: 0;
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

export const BentoTileHeaderActions = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.xs};
`;

export const BentoTileBody = styled(Box)`
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
`;

export const BentoTileFooter = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.small};
	justify-content: space-between;
	min-height: ${bentoTileTheme.footer.minHeight};
`;

export const BentoTileFooterSlot = styled(Box)`
	align-items: center;
	display: flex;
	min-width: 0;
`;

export const BentoTileActionsSlot = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	justify-content: flex-end;
	min-width: 0;
`;

export const BentoTileModalPanel = styled(motion.div)`
	${glassTile}
	background: ${palette.background.default};
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	gap: ${spacing.small};
	left: 50%;
	max-height: ${bentoTileTheme.size.modalMaxHeight};
	max-width: ${bentoTileTheme.size.modalMaxWidth};
	padding: ${spacing.medium};
	position: fixed;
	top: 50%;
	width: 100%;
	z-index: ${bentoTileTheme.elevation.overlay};
	pointer-events: auto;
`;

export const BentoTileModalFrame = styled(Box)`
	inset: ${spacing.none};
	pointer-events: none;
	position: fixed;
`;

export const BentoTileExpandedHeader = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: space-between;
	min-width: 0;
`;

export const BentoTileExpandedBody = styled(Box)`
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
`;

export const BentoTileExpandedFooter = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	justify-content: space-between;
	min-height: ${bentoTileTheme.footer.minHeight};
`;

export const BentoTileControls = styled(Box)`
	position: absolute;
	top: ${spacing.small};
	right: ${spacing.small};
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	z-index: ${bentoTileTheme.elevation.chrome};
`;

export const ResizeControls = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${bentoTileTheme.space.controlPairGap};
`;

export const DragHandle = styled(Box)`
	cursor: grab;
	color: ${bentoTileTheme.color.control};
	font-size: ${bentoTileTheme.size.dragHandleFont};
	line-height: 1;
	user-select: none;
	padding: ${bentoTileTheme.space.controlInset} ${spacing.xxs};
	border-radius: ${bentoTileTheme.radius.control};
	transition: ${bentoTileTheme.motion.colorTransition};

	&:hover {
		color: ${bentoTileTheme.color.controlHover};
	}

	&:active {
		cursor: grabbing;
	}
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
`;

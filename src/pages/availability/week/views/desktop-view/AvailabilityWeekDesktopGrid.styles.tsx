import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover, zIndexSticky } from '@psycron/theme/zIndex';

import {
	BUFFER_COLORS,
	getSlotBorder,
	getSlotTextColor,
	hasPersistentSlotShadow,
	isClickableStatus,
	SLOT_COLORS,
} from '../../AvailabilityWeekPage.styles';
import type { SlotStatus } from '../../AvailabilityWeekPage.types';

export const WeekGridWrapper = styled(Box)`
	flex: 1;
	min-height: 0;
	overflow: auto;
	padding-bottom: ${spacing.xs};
`;

export const WeekGrid = styled(Box)`
	display: grid;
	grid-template-columns: 64px repeat(7, minmax(0, 1fr));
	grid-template-rows: 88px auto;
	column-gap: 0;
	row-gap: 0;
	min-width: 560px;
	align-items: start;
`;

export const WeekGridCorner = styled(Box)`
	grid-column: 1;
	grid-row: 1;
	height: 88px;
	position: sticky;
	top: 0;
	left: 0;
	z-index: ${zIndexSticky};
	background: ${palette.background.default};
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.85)};
`;

export const DayHeader = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'columnIndex' &&
		prop !== 'isDisabled' &&
		prop !== 'isInteractive' &&
		prop !== 'isToday' &&
		prop !== 'isPast' &&
		prop !== 'isFullyBlocked',
})<{
	columnIndex: number;
	isDisabled?: boolean;
	isFullyBlocked?: boolean;
	isInteractive?: boolean;
	isPast?: boolean;
	isToday?: boolean;
}>`
	grid-column: ${({ columnIndex }) => columnIndex};
	grid-row: 1;
	height: 88px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${spacing.xxs};
	position: sticky;
	top: 0;
	z-index: ${zIndexSticky};
	backdrop-filter: blur(5px);
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.85)};
	border-left: 1px solid ${hexToRgba(palette.gray['02'], 0.7)};
	background: ${({ isDisabled, isFullyBlocked, isPast, isToday }) => {
		if (isDisabled || isFullyBlocked || isPast) {
			return hexToRgba(palette.gray['02'], 0.24);
		}
		if (isToday) return hexToRgba(palette.secondary.main, 0.12);
		return hexToRgba(palette.background.default, 0.64);
	}};
	cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
	transition: background 0.15s ease;

	&:hover {
		background: ${({ isDisabled, isFullyBlocked, isPast, isToday }) =>
			isDisabled || isFullyBlocked || isPast
				? hexToRgba(palette.gray['02'], 0.45)
				: isToday
					? hexToRgba(palette.secondary.main, 0.1)
					: hexToRgba(palette.brand.purple, 0.05)};
	}
`;

export const DayName = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
	font-weight: 500;
	margin-bottom: ${spacing.space};
`;

export const DayNumber = styled(Text)`
	font-size: 18px;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const TimeAxis = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'timelineHeight',
})<{ timelineHeight: number }>`
	grid-column: 1;
	grid-row: 1 / span 2;
	position: sticky;
	left: 0;
	z-index: ${zIndexSticky};
	height: ${({ timelineHeight }) => `${timelineHeight}px`};
	background: ${palette.background.default};

	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 1px;
		background: ${palette.gray['02']};
	}
`;

export const TimeLabel = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isFirst' && prop !== 'top',
})<{ isFirst?: boolean; top: number }>`
	position: absolute;
	left: 0;
	right: ${spacing.small};
	top: ${({ top }) => `${top}px`};
	display: flex;
	justify-content: flex-end;
	transform: ${({ isFirst }) => (isFirst ? 'none' : 'translateY(-50%)')};
`;

export const TimeLabelText = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
	font-weight: 500;
	white-space: nowrap;
`;

export const DayColumn = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'columnIndex' &&
		prop !== 'isDisabled' &&
		prop !== 'isInteractive' &&
		prop !== 'isToday' &&
		prop !== 'isPast' &&
		prop !== 'isFullyBlocked' &&
		prop !== 'timelineHeight',
})<{
	columnIndex: number;
	isDisabled?: boolean;
	isFullyBlocked?: boolean;
	isInteractive?: boolean;
	isPast?: boolean;
	isToday?: boolean;
	timelineHeight: number;
}>`
	grid-column: ${({ columnIndex }) => columnIndex};
	grid-row: 1 / span 2;
	position: relative;
	height: ${({ timelineHeight }) => `${timelineHeight}px`};
	background: ${({ isDisabled, isFullyBlocked, isPast, isToday }) => {
		if (isDisabled || isPast) return hexToRgba(palette.gray['02'], 0.22);
		if (isFullyBlocked) {
			return hexToRgba(palette.gray['02'], 0.32);
		}
		if (isToday) return hexToRgba(palette.secondary.main, 0.12);
		return palette.background.default;
	}};
	border-left: 1px solid
		${({ isToday }) =>
			isToday ? palette.secondary.main : hexToRgba(palette.gray['02'], 0.85)};
	border-right: 1px solid
		${({ isToday }) => (isToday ? palette.secondary.main : 'transparent')};
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.85)};
	overflow: clip;
	cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
`;

export const HourGridLine = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'top',
})<{ top: number }>`
	position: absolute;
	left: 0;
	right: 0;
	top: ${({ top }) => `${top}px`};
	border-top: 1px solid ${hexToRgba(palette.gray['02'], 0.9)};
`;

export const HalfHourGridLine = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'top',
})<{ top: number }>`
	position: absolute;
	left: 0;
	right: 0;
	top: ${({ top }) => `${top}px`};
	border-top: 1px dashed ${hexToRgba(palette.gray['02'], 0.5)};
`;

export const CurrentTimeLine = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'top',
})<{ top: number }>`
	position: absolute;
	left: 0;
	right: 0;
	top: ${({ top }) => `${top}px`};
	height: 2px;
	background: ${palette.error.main};
	z-index: ${zIndexHover};
	pointer-events: none;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 10px;
		height: 10px;
		border-radius: 999px;
		background: ${palette.error.main};
		transform: translate(-50%, -50%);
	}
`;

export const SlotCell = styled(ButtonBase, {
	shouldForwardProp: (prop) =>
		prop !== 'blockHeight' &&
		prop !== 'isCompact' &&
		prop !== 'stackOrder' &&
		prop !== 'slotStatus' &&
		prop !== 'top',
})<{
	blockHeight: number;
	isCompact: boolean;
	slotStatus: SlotStatus;
	stackOrder: number;
	top: number;
}>`
	position: absolute;
	left: ${spacing.xs};
	right: ${spacing.xs};
	top: ${({ top }) => `${top}px`};
	height: ${({ blockHeight }) => `${blockHeight}px`};
	border-radius: 14px;
	padding: ${({ isCompact }) =>
		isCompact
			? `${spacing.xxs} ${spacing.xs}`
			: `${spacing.xs} ${spacing.small}`};
	font-size: 13px;
	font-weight: 500;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	overflow: hidden;
	z-index: ${({ stackOrder }) => stackOrder};
	text-align: left;
	background-color: ${({ slotStatus }) =>
		slotStatus === 'blocked' ? 'transparent' : SLOT_COLORS[slotStatus]};
	color: ${({ slotStatus }) => getSlotTextColor(slotStatus)};
	border: ${({ slotStatus }) => getSlotBorder(slotStatus)};
	cursor: ${({ slotStatus }) =>
		isClickableStatus(slotStatus) ? 'pointer' : 'default'};
	box-shadow: ${({ slotStatus }) =>
		hasPersistentSlotShadow(slotStatus) ? shadowMedium : 'none'};
	transition:
		box-shadow 0.15s ease,
		transform 0.15s ease,
		background-color 0.15s ease;

	&:hover {
		z-index: ${zIndexHover};
		box-shadow: ${({ slotStatus }) =>
			hasPersistentSlotShadow(slotStatus)
				? shadowSmall
				: isClickableStatus(slotStatus)
					? shadowSmall
					: 'none'};
		transform: ${({ slotStatus }) =>
			isClickableStatus(slotStatus) ? 'translateY(-1px)' : 'none'};
		background-color: ${({ slotStatus }) =>
			slotStatus === 'blocked'
				? hexToRgba(palette.warning.surface.light, 0.58)
				: slotStatus === 'cancelled'
					? SLOT_COLORS.cancelled
					: SLOT_COLORS[slotStatus]};
		border: ${({ slotStatus }) =>
			slotStatus === 'blocked'
				? `1px solid ${palette.error.main}`
				: getSlotBorder(slotStatus)};
	}

	${({ slotStatus }) =>
		slotStatus === 'cancelled'
			? `opacity: 0.78;
		text-decoration: line-through;
		text-decoration-color: ${palette.warning.dark};
		text-decoration-thickness: 1px;`
			: ''}

	& [data-blocked-hover-label='true'] {
		opacity: 0;
		transform: translateY(2px);
	}

	&:hover [data-blocked-hover-label='true'] {
		opacity: 1;
		transform: translateY(0);
	}

	& [data-cancelled-hover-label='true'] {
		opacity: 0;
		transform: translateY(2px);
	}

	&:hover [data-cancelled-hover-label='true'] {
		opacity: 1;
		transform: translateY(0);
	}
`;

export const BlockedSlotHoverLabel = styled(Text)`
	font-size: 11px;
	font-weight: 700;
	line-height: 1.2;
	color: ${palette.error.main};
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
`;

export const CancelledSlotHoverLabel = styled(Text)`
	font-size: 11px;
	font-weight: 700;
	line-height: 1.2;
	color: ${palette.warning.dark};
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
`;

export const SlotCellBuffer = styled(ButtonBase, {
	shouldForwardProp: (prop) =>
		prop !== 'blockHeight' &&
		prop !== 'bufferFor' &&
		prop !== 'stackOrder' &&
		prop !== 'top',
})<{
	blockHeight: number;
	bufferFor: 'booked-google' | 'booked-jupiter';
	stackOrder: number;
	top: number;
}>`
	position: absolute;
	left: ${spacing.xs};
	right: ${spacing.xs};
	top: ${({ top }) => `${top}px`};
	height: ${({ blockHeight }) => `${blockHeight}px`};
	border-radius: 999px;
	padding: 0 ${spacing.xs};
	display: flex;
	align-items: center;
	justify-content: flex-start;
	z-index: ${({ stackOrder }) => stackOrder};
	border-left: 3px solid ${({ bufferFor }) => BUFFER_COLORS[bufferFor]};
	background:
		repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 3px,
			${({ bufferFor }) => hexToRgba(BUFFER_COLORS[bufferFor], 0.08)} 3px,
			${({ bufferFor }) => hexToRgba(BUFFER_COLORS[bufferFor], 0.08)} 6px
		),
		${({ bufferFor }) => hexToRgba(BUFFER_COLORS[bufferFor], 0.12)};
	cursor: pointer;
	transition:
		box-shadow 0.15s ease,
		transform 0.15s ease,
		background-color 0.15s ease;

	&:hover {
		z-index: ${zIndexHover};
		box-shadow: ${shadowSmall};
		transform: translateY(-1px);
	}
`;

export const SlotPatientName = styled(Text, {
	shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>`
	font-size: ${({ isCompact }) => (isCompact ? '11px' : '12px')};
	font-weight: 700;
	line-height: 1.2;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

export const SlotTimeMeta = styled(Text, {
	shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>`
	font-size: ${({ isCompact }) => (isCompact ? '9px' : '10px')};
	font-weight: 500;
	line-height: 1.2;
	opacity: 0.92;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

export const SlotTherapyType = styled(Text, {
	shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>`
	font-size: ${({ isCompact }) => (isCompact ? '9px' : '10px')};
	font-weight: 400;
	opacity: 0.8;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

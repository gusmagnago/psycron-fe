import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
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
	padding-bottom: 0;
`;

export const WeekGrid = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'dayCount',
})<{ dayCount: number }>`
	display: grid;
	grid-template-columns: 72px
		repeat(${({ dayCount }) => dayCount}, minmax(118px, 1fr));
	grid-template-rows: 50px auto;
	column-gap: 0;
	row-gap: 0;
	min-width: ${({ dayCount }) => (dayCount === 1 ? '0' : '960px')};
	align-items: start;
	background: ${palette.background.default};
	position: relative;
`;

export const WeekGridCorner = styled(Box)`
	grid-column: 1;
	grid-row: 1;
	height: 50px;
	position: sticky;
	top: 0;
	left: 0;
	z-index: ${zIndexSticky};
	background:
		linear-gradient(
			135deg,
			${hexToRgba(palette.white, 0.74)},
			${hexToRgba(palette.white, 0.42)}
		),
		${hexToRgba(palette.background.default, 0.55)};
	backdrop-filter: blur(16px) saturate(1.2);
	-webkit-backdrop-filter: blur(16px) saturate(1.2);
	border-right: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
	box-shadow: inset 0 1px 0 ${hexToRgba(palette.white, 0.8)};
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
	height: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0;
	position: sticky;
	top: 0;
	z-index: ${zIndexSticky};
	backdrop-filter: blur(16px) saturate(1.2);
	-webkit-backdrop-filter: blur(16px) saturate(1.2);
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
	border-left: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
	background: ${({ isDisabled, isFullyBlocked, isPast, isToday }) => {
		if (isDisabled || isFullyBlocked || isPast) {
			return hexToRgba(palette.gray['02'], 0.24);
		}
		if (isToday) return hexToRgba(palette.secondary.main, 0.12);
		return `linear-gradient(135deg, ${hexToRgba(palette.white, 0.74)}, ${hexToRgba(palette.white, 0.42)}), ${hexToRgba(palette.background.default, 0.55)}`;
	}};
	box-shadow: ${({ isToday }) =>
		isToday
			? `inset 0 0 0 100px ${hexToRgba(palette.secondary.main, 0.12)}, inset 0 -2px 0 ${palette.secondary.main}, inset 0 1px 0 ${hexToRgba(palette.white, 0.8)}`
			: `inset 0 1px 0 ${hexToRgba(palette.white, 0.8)}`};
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

export const DayName = styled('span')`
	display: block;
	font-size: 12px;
	color: ${palette.gray['08']};
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const DayNumber = styled('span')`
	display: block;
	font-size: 20px;
	line-height: 1;
	font-weight: 800;
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
	border-right: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};

	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 1px;
		background: ${hexToRgba(palette.gray['02'], 0.78)};
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

export const TimeLabelText = styled('span')`
	display: block;
	font-size: 12px;
	color: ${palette.gray['08']};
	font-weight: 800;
	white-space: nowrap;
`;

export const DayColumn = styled(Box, {
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
	grid-row: 1 / span 2;
	position: relative;
	/* Fill the grid track — the TimeAxis defines the timeline height. */
	height: 100%;
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
			isToday ? palette.secondary.main : hexToRgba(palette.gray['02'], 0.78)};
	border-right: 1px solid
		${({ isToday }) => (isToday ? palette.secondary.main : 'transparent')};
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
	overflow: clip;
	cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};

	/* Days before today render their events in a disabled color — history,
	   not actionable schedule. */
	${({ isPast }) =>
		isPast
			? `& [id^='availability-slot-'] {
					opacity: 0.5;
					filter: saturate(0.35);
				}`
			: ''}
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

export const HourHitArea = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'isDisabledCell' && prop !== 'top',
})<{
	// Past time or time already occupied by a slot — no hover CTA, no click.
	isDisabledCell: boolean;
	top: number;
}>`
	position: absolute;
	left: 0;
	right: 0;
	top: ${({ top }) => `${top}px`};
	height: 60px;
	border: 0;
	border-radius: 0;
	background: transparent;
	z-index: 1;
	cursor: ${({ isDisabledCell }) => (isDisabledCell ? 'default' : 'pointer')};
	pointer-events: ${({ isDisabledCell }) => (isDisabledCell ? 'none' : 'auto')};

	&:hover,
	&:focus-visible {
		background: ${({ isDisabledCell }) =>
			isDisabledCell ? 'transparent' : hexToRgba(palette.brand.purple, 0.06)};
		z-index: ${({ isDisabledCell }) => (isDisabledCell ? 1 : 7)};
	}

	&:hover [data-hour-hit-label='true'],
	&:focus-visible [data-hour-hit-label='true'] {
		opacity: ${({ isDisabledCell }) => (isDisabledCell ? 0 : 1)};
	}
`;

export const HourHitLabel = styled('span')`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	white-space: nowrap;
	min-height: 28px;
	display: inline-flex;
	align-items: center;
	padding: 5px ${spacing.extraSmall};
	border-radius: 999px;
	color: ${palette.brand.dark};
	background: ${palette.brand.light};
	font-size: 12px;
	font-weight: 800;
	box-shadow: ${shadowSmall};
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.15s ease;
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
		prop !== 'googleColor' &&
		prop !== 'googleTextColor' &&
		prop !== 'hasConflict' &&
		prop !== 'isCompact' &&
		prop !== 'stackOrder' &&
		prop !== 'slotStatus' &&
		prop !== 'top',
})<{
	blockHeight: number;
	// Real Google event color (+ contrast text) — set only for booked-google,
	// so the cell renders like the same event in Google Calendar.
	googleColor?: string;
	googleTextColor?: string;
	hasConflict: boolean;
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
	background: ${({ googleColor, slotStatus }) =>
		slotStatus === 'blocked'
			? 'transparent'
			: slotStatus === 'booked-google'
				? (googleColor ?? SLOT_COLORS[slotStatus])
				: SLOT_COLORS[slotStatus]};
	color: ${({ googleTextColor, slotStatus }) =>
		slotStatus === 'booked-google' && googleTextColor
			? googleTextColor
			: getSlotTextColor(slotStatus)};
	border: ${({ slotStatus }) => getSlotBorder(slotStatus)};
	/* Conflict signals via a strong left border — never via box-shadow. */
	border-left: ${({ hasConflict, slotStatus }) =>
		hasConflict
			? `4px solid ${palette.error.main}`
			: slotStatus === 'available'
				? `3px solid ${hexToRgba(palette.brand.purple, 0.28)}`
				: getSlotBorder(slotStatus)};
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
			slotStatus !== 'booked-google' && isClickableStatus(slotStatus)
				? 'translateY(-1px)'
				: 'none'};
		background: ${({ googleColor, slotStatus }) =>
			slotStatus === 'blocked'
				? hexToRgba(palette.warning.surface.light, 0.58)
				: slotStatus === 'booked-google'
					? (googleColor ?? SLOT_COLORS[slotStatus])
					: slotStatus === 'cancelled'
						? SLOT_COLORS.cancelled
						: SLOT_COLORS[slotStatus]};
		border: ${({ slotStatus }) =>
			slotStatus === 'blocked'
				? `1px solid ${palette.error.main}`
				: getSlotBorder(slotStatus)};
		border-left: ${({ hasConflict, slotStatus }) =>
			hasConflict
				? `4px solid ${palette.error.main}`
				: slotStatus === 'available'
					? `3px solid ${hexToRgba(palette.brand.purple, 0.28)}`
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

	& [data-available-hover-label='true'] {
		opacity: 0;
		transform: translateY(2px);
	}

	&:hover [data-available-hover-label='true'],
	&:focus-visible [data-available-hover-label='true'] {
		opacity: 1;
		transform: translateY(0);
	}
`;

export const BlockedSlotHoverLabel = styled('span')`
	display: block;
	font-size: 11px;
	font-weight: 700;
	line-height: 1.2;
	color: ${palette.error.main};
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
`;

export const CancelledSlotHoverLabel = styled('span')`
	display: block;
	font-size: 11px;
	font-weight: 700;
	line-height: 1.2;
	color: ${palette.warning.dark};
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
`;

export const AvailableSlotHoverLabel = styled('span')`
	align-self: center;
	padding: 5px ${spacing.extraSmall};
	border-radius: 999px;
	background: ${palette.brand.light};
	color: ${palette.brand.dark};
	font-size: 12px;
	font-weight: 800;
	line-height: 1.2;
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

export const SlotPatientName = styled('span', {
	shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>`
	display: block;
	font-size: ${({ isCompact }) => (isCompact ? '11px' : '12px')};
	font-weight: 700;
	line-height: 1.2;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

export const SlotTimeMeta = styled('span', {
	shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>`
	display: block;
	font-size: ${({ isCompact }) => (isCompact ? '9px' : '10px')};
	font-weight: 500;
	line-height: 1.2;
	opacity: 0.92;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

export const SlotTherapyType = styled('span', {
	shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>`
	display: block;
	font-size: ${({ isCompact }) => (isCompact ? '9px' : '10px')};
	font-weight: 400;
	opacity: 0.8;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

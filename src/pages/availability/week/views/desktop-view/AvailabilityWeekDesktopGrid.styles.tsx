import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

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
	overflow-y: auto;
	overflow-x: auto;
	padding-bottom: ${spacing.xs};
`;

export const WeekGrid = styled(Box)`
	display: grid;
	grid-template-columns: 64px repeat(7, 1fr);
	gap: ${spacing.xs};
	min-width: 560px;
`;

export const WeekGridCorner = styled(Box)`
	height: 60px;
	position: sticky;
	top: 0;
	left: 0;
	z-index: ${zIndexSticky};
	background: ${palette.background.default};
`;

// ─── Day column header ─────────────────────────────────────────────────────────

export const DayHeader = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'isDisabled' && prop !== 'isToday' && prop !== 'isFullyBlocked',
})<{ isDisabled?: boolean; isFullyBlocked?: boolean; isToday?: boolean }>`
	height: 60px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: ${spacing.extraSmall};
	border: 2px solid
		${({ isFullyBlocked, isToday }) =>
			isFullyBlocked
				? palette.gray['02']
				: isToday
					? palette.secondary.main
					: hexToRgba(palette.background.default, 0.2)};
	border-radius: ${spacing.xs};
	position: sticky;
	top: 0;
	z-index: ${zIndexSticky};
	backdrop-filter: blur(10px);
	background: ${({ isFullyBlocked }) =>
		isFullyBlocked
			? palette.gray['02']
			: hexToRgba(palette.background.default, 0.2)};
	opacity: 1;
	cursor: pointer;
	transition: background 0.15s ease;

	&:hover {
		background: ${({ isFullyBlocked }) =>
			isFullyBlocked
				? palette.gray['02']
				: hexToRgba(palette.brand.purple, 0.06)};
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

export const TimeLabel = styled(Box)`
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-right: ${spacing.small};
	position: sticky;
	left: 0;
	z-index: ${zIndexSticky};
	background: ${palette.background.default};
`;

export const TimeLabelText = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
	font-weight: 500;
	white-space: nowrap;
`;

// ─── Desktop slot cell ─────────────────────────────────────────────────────────

export const SlotCell = styled(ButtonBase, {
	shouldForwardProp: (prop) =>
		prop !== 'slotStatus' && prop !== 'isToday' && prop !== 'isOddRow',
})<{ isOddRow?: boolean; isToday?: boolean; slotStatus: SlotStatus }>`
	height: 60px;
	width: 100%;
	border-radius: 12px;
	padding: ${spacing.xs} ${spacing.small};
	font-size: 13px;
	font-weight: 500;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	overflow: hidden;
	position: relative;

	background-color: ${({ slotStatus }) => SLOT_COLORS[slotStatus]};
	color: ${({ slotStatus }) => getSlotTextColor(slotStatus)};
	border: ${({ slotStatus }) => getSlotBorder(slotStatus)};
	opacity: 1;
	cursor: ${({ slotStatus }) =>
		isClickableStatus(slotStatus) ? 'pointer' : 'default'};
	box-shadow: ${({ slotStatus }) =>
		hasPersistentSlotShadow(slotStatus) ? shadowMedium : 'none'};
	transition:
		box-shadow 0.15s ease,
		transform 0.15s ease,
		background-color 0.15s ease;

	&:hover {
		box-shadow: ${({ slotStatus }) =>
			hasPersistentSlotShadow(slotStatus)
				? shadowSmall
				: isClickableStatus(slotStatus)
					? shadowSmall
					: 'none'};
		transform: ${({ slotStatus }) =>
			isClickableStatus(slotStatus) ? 'translateY(-1px)' : 'none'};
	}

	${({ slotStatus }) =>
		slotStatus === 'cancelled'
			? `opacity: 0.78;
		text-decoration: line-through;
		text-decoration-color: ${palette.warning.dark};
		text-decoration-thickness: 1px;`
			: ''}
	text-align: left;

	${({ isOddRow }) =>
		isOddRow
			? `&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.3);
		border-radius: inherit;
		pointer-events: none;
	}`
			: ''}
`;

export const SlotCellDisabled = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isToday' && prop !== 'isOddRow',
})<{ isOddRow?: boolean; isToday?: boolean }>`
	height: 60px;
	width: 100%;
	border-radius: 12px;
	background-color: ${palette.gray['02']};
	position: relative;

	${({ isOddRow }) =>
		isOddRow
			? `&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.4);
		border-radius: inherit;
		pointer-events: none;
	}`
			: ''}

	${({ isToday }) =>
		isToday
			? `&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(221, 147, 255, 0.15);
		border-radius: inherit;
		pointer-events: none;
	}`
			: ''}
`;

export const SlotCellBuffer = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'bufferFor',
})<{ bufferFor: 'booked-google' | 'booked-jupiter' }>`
	height: 60px;
	width: 100%;
	border-radius: 12px;
	padding: ${spacing.xs} ${spacing.small};
	display: flex;
	align-items: center;
	border-left: 3px solid ${({ bufferFor }) => BUFFER_COLORS[bufferFor]};
	background: ${({ bufferFor }) => hexToRgba(BUFFER_COLORS[bufferFor], 0.07)};
	cursor: pointer;
	transition:
		box-shadow 0.15s ease,
		transform 0.15s ease,
		background-color 0.15s ease;

	&:hover {
		box-shadow: ${shadowSmall};
		transform: translateY(-1px);
	}
`;

export const SlotPatientName = styled(Text)`
	font-size: 12px;
	font-weight: 700;
	line-height: 1.2;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

export const SlotTherapyType = styled(Text)`
	font-size: 10px;
	font-weight: 400;
	opacity: 0.8;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

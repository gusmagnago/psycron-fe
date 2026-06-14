import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import {
	BUFFER_COLORS,
	getSlotBorder,
	getSlotTextColor,
	hasPersistentSlotShadow,
	isClickableStatus,
	SLOT_COLORS,
} from '../../AvailabilityWeekPage.styles';
import type { SlotStatus } from '../../AvailabilityWeekPage.types';
import { getBufferHeight } from '../../AvailabilityWeekPage.utils';

export const MobileDayList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding-bottom: ${spacing.small};
`;

export const MobileDayCard = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'isToday' && prop !== 'isFullyBlocked' && prop !== 'isPastDay',
})<{ isFullyBlocked?: boolean; isPastDay?: boolean; isToday?: boolean }>`
	background: ${({ isFullyBlocked, isPastDay }) =>
		isFullyBlocked
			? palette.gray['02']
			: isPastDay
				? palette.gray['02']
				: palette.white};
	border-radius: ${spacing.mediumSmall};
	padding: ${spacing.small};
	overflow: hidden;
	opacity: 1;
	border-left: 3px solid
		${({ isToday }) => (isToday ? palette.secondary.main : 'transparent')};
`;

export const MobileDayCardHeader = styled(Box)`
	width: 100%;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	text-align: left;
	border-radius: ${spacing.small};

	&:disabled {
		opacity: 0.72;
	}
`;

export const MobileDayHeaderActions = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const MobileDayHeaderButton = styled(ButtonBase)`
	width: 100%;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	text-align: left;
	border-radius: ${spacing.small};
	padding: ${spacing.xxs};

	&:hover {
		background: ${palette.gray['01']};
	}

	&.Mui-disabled {
		opacity: 0.72;
		cursor: not-allowed;
	}
`;

export const MobileDayName = styled(Text)`
	font-size: 11px;
	font-weight: 500;
	color: ${palette.gray['05']};
	text-transform: uppercase;
	margin-bottom: ${spacing.space};
`;

export const MobileDayDate = styled(Text, {
	shouldForwardProp: (prop) => prop !== 'isToday',
})<{ isToday?: boolean }>`
	font-size: 16px;
	font-weight: 500;
	color: ${({ isToday }) =>
		isToday ? palette.brand.purple : palette.text.primary};
`;

export const MobileSlotCount = styled(Text)`
	font-size: 12px;
	color: ${palette.gray['05']};
`;

export const MobileHeaderIcon = styled(Box)`
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	background: ${palette.gray['01']};
	color: ${palette.gray['05']};
`;

export const MobileDaySlots = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding-top: ${spacing.small};
`;

export const MobileSlotCard = styled(ButtonBase, {
	shouldForwardProp: (prop) =>
		prop !== 'googleColor' &&
		prop !== 'googleTextColor' &&
		prop !== 'slotStatus',
})<{
	// Real Google event color (+ contrast text) — set only for booked-google,
	// so the card renders like the same event in Google Calendar.
	googleColor?: string;
	googleTextColor?: string;
	slotStatus: SlotStatus;
}>`
	position: relative;
	width: 100%;
	border-radius: ${spacing.mediumSmall};
	padding: ${spacing.xxs} ${spacing.small};
	height: 56px;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: ${spacing.xs};
	text-align: left;
	background: ${({ googleColor, slotStatus }) =>
		slotStatus === 'booked-google'
			? (googleColor ?? SLOT_COLORS[slotStatus])
			: SLOT_COLORS[slotStatus]};
	border: ${({ slotStatus }) => getSlotBorder(slotStatus)};
	opacity: 1;
	cursor: ${({ slotStatus }) =>
		isClickableStatus(slotStatus) ? 'pointer' : 'default'};
	transition:
		opacity 0.1s ease,
		transform 0.15s ease,
		box-shadow 0.15s ease;
	color: ${({ googleTextColor, slotStatus }) =>
		slotStatus === 'booked-google' && googleTextColor
			? googleTextColor
			: getSlotTextColor(slotStatus)};
	box-shadow: ${({ slotStatus }) =>
		hasPersistentSlotShadow(slotStatus) ? shadowSmall : 'none'};

	&:hover {
		opacity: ${({ slotStatus }) => (isClickableStatus(slotStatus) ? 0.9 : 1)};
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
	}

	${({ slotStatus }) =>
		slotStatus === 'cancelled'
			? `opacity: 0.78;
		text-decoration: line-through;
		text-decoration-color: ${palette.warning.dark};
		text-decoration-thickness: 1px;`
			: ''}
`;

export const MobileSlotBuffer = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'bufferFor' && prop !== 'bufferMinutes',
})<{
	bufferFor: 'booked-google' | 'booked-jupiter';
	bufferMinutes: number;
}>`
	width: 100%;
	border-radius: ${spacing.xs};
	padding: 0 ${spacing.small};
	height: ${({ bufferMinutes }) => getBufferHeight(bufferMinutes, 'mobile')}px;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: ${spacing.small};
	border-left: 3px solid ${({ bufferFor }) => BUFFER_COLORS[bufferFor]};
	background: repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 3px,
			${({ bufferFor }) => hexToRgba(BUFFER_COLORS[bufferFor], 0.06)} 3px,
			${({ bufferFor }) => hexToRgba(BUFFER_COLORS[bufferFor], 0.06)} 6px
		),
		${({ bufferFor }) => hexToRgba(BUFFER_COLORS[bufferFor], 0.07)};
	cursor: pointer;
	transition:
		transform 0.15s ease,
		box-shadow 0.15s ease,
		opacity 0.1s ease;

	&:hover {
		opacity: 0.92;
		box-shadow: ${shadowSmall};
		transform: translateY(-1px);
	}
`;

export const MobileSlotTime = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	white-space: nowrap;
	flex-shrink: 0;
`;

export const MobileSlotPatient = styled(Text)`
	font-size: 13px;
	font-weight: 600;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

export const MobileSlotTherapy = styled(Text)`
	font-size: 11px;
	opacity: 0.8;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
`;

export const MobileSlotDetails = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 2px;
	flex: 1;
	min-width: 0;
`;

export const MobileExpandButton = styled(ButtonBase)`
	width: 100%;
	padding: ${spacing.xs} 0;
	font-size: 12px;
	color: ${palette.brand.purple};
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${spacing.xs};
	border-radius: ${spacing.xs};

	&.Mui-disabled {
		color: ${palette.gray['05']};
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

export const MobileEmptyDay = styled(Box)`
	padding: ${spacing.medium} 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const MobileEmptyDayText = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
	text-align: center;
`;

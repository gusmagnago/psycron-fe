import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMain,
	shadowMedium,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

import type { SlotStatus } from './AvailabilityWeekPage.types';

// ─── Slot colours ─────────────────────────────────────────────────────────────

export const SLOT_COLORS: Record<SlotStatus, string> = {
	available: palette.background.paper,
	'booked-jupiter': palette.brand.purple,
	'booked-google': palette.brand.google,
	cancelled: palette.gray['02'],
};

const isClickableStatus = (status: SlotStatus) =>
	status === 'booked-jupiter' ||
	status === 'booked-google' ||
	status === 'available' ||
	status === 'cancelled';

// ─── Card ─────────────────────────────────────────────────────────────────────

export const WeekCard = styled(Box)`
	width: 100%;
	height: calc(100vh - 140px);
	background: ${palette.background.default};
	border-radius: ${spacing.largeXl};
	box-shadow: ${shadowMain};
	padding: ${spacing.mediumLarge};
	display: flex;
	flex-direction: column;
	gap: ${spacing.mediumSmall};
	overflow: hidden;
	margin-bottom: 0;

	position: relative;

	${isMobileMedia} {
		height: auto;
		box-shadow: none;
		padding: 0;
		overflow: visible;
	}
`;

// ─── Header ───────────────────────────────────────────────────────────────────

export const WeekHeader = styled(Box)`
	background-color: ${palette.background.default};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.medium};
	width: 100%;
	position: sticky;
	top: 0;
	flex-shrink: 0;
	padding-bottom: 0;
	z-index: ${zIndexSticky};

	${isMobileMedia} {
		gap: ${spacing.small};
		padding-bottom: ${spacing.small};
	}
`;
export const WeekFeaturesWrapper = styled(Box)`
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

export const WeekNavRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
`;

export const WeekFeaturesActions = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: ${spacing.small};
`;

export const WeekTitle = styled(Text)`
	font-size: 1.3rem;
	font-weight: 500;
	color: ${palette.text.primary};
	line-height: 1.2;

	${isMobileMedia} {
		font-size: 1.2rem;
	}
`;

export const WeekSubtitle = styled(Text)`
	font-size: 0.875rem;
	color: ${palette.gray['05']};
	margin-top: ${spacing.space};
`;

export const FilterButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	white-space: nowrap;

	& span {
		display: flex;
		align-items: center;
		gap: ${spacing.xs};
	}
`;

// ─── Desktop Grid ─────────────────────────────────────────────────────────────

export const WeekGridWrapper = styled(Box)`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	overflow-x: auto;
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
	shouldForwardProp: (prop) => prop !== 'isDisabled' && prop !== 'isToday',
})<{ isDisabled?: boolean; isToday?: boolean }>`
	height: 60px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: ${spacing.extraSmall};
	opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
	border: 2px solid
		${({ isToday }) => (isToday ? palette.secondary.main : 'transparent')};
	border-radius: ${spacing.xs};
	position: sticky;
	top: 0;
	z-index: ${zIndexSticky};
	background: ${palette.background.default};
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
	color: ${({ slotStatus }) =>
		slotStatus === 'booked-jupiter' || slotStatus === 'booked-google'
			? palette.white
			: palette.text.primary};
	opacity: ${({ slotStatus }) => (slotStatus === 'cancelled' ? 0.3 : 1)};
	cursor: ${({ slotStatus }) =>
		isClickableStatus(slotStatus) ? 'pointer' : 'default'};
	box-shadow: ${({ slotStatus }) =>
		slotStatus === 'cancelled' ? 'none' : shadowMedium};
	transition: box-shadow 0.15s ease;

	&:hover {
		box-shadow: ${({ slotStatus }) =>
			slotStatus === 'cancelled' ? 'none' : shadowSmall};
	}

	${({ isOddRow }) =>
		isOddRow
			? `&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.018);
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
		background: rgba(104, 63, 255, 0.05);
		border-radius: inherit;
		pointer-events: none;
	}`
			: ''}
`;

export const SlotCellEmpty = styled(Box, {
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
		background: rgba(0, 0, 0, 0.018);
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
		background: rgba(104, 63, 255, 0.05);
		border-radius: inherit;
		pointer-events: none;
	}`
			: ''}
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

// ─── Mobile Day List ───────────────────────────────────────────────────────────

export const MobileDayList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding-bottom: ${spacing.small};
`;

export const MobileDayCard = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isToday',
})<{ isToday?: boolean }>`
	background: ${palette.white};
	border-radius: ${spacing.mediumSmall};
	padding: ${spacing.small};
	overflow: hidden;
	border-left: 3px solid
		${({ isToday }) => (isToday ? palette.secondary.main : 'transparent')};
`;

export const MobileDayCardHeader = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: ${spacing.medium};
	padding-bottom: ${spacing.mediumSmall};
	border-bottom: 1px solid ${palette.gray['02']};
`;

export const MobileDayName = styled(Text)`
	font-size: 11px;
	font-weight: 500;
	color: ${palette.gray['05']};
	text-transform: uppercase;
	margin-bottom: ${spacing.space};
`;

export const MobileDayDate = styled(Text)`
	font-size: 16px;
	font-weight: 500;
	color: ${palette.text.primary};
`;

export const MobileSlotCount = styled(Text)`
	font-size: 12px;
	color: ${palette.gray['05']};
`;

export const MobileDaySlots = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const MobileSlotCard = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'slotStatus',
})<{ slotStatus: SlotStatus }>`
	width: 100%;
	border-radius: ${spacing.small};
	padding: ${spacing.xxs} ${spacing.small};
	height: 56px;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: ${spacing.small};
	text-align: left;
	background-color: ${({ slotStatus }) => SLOT_COLORS[slotStatus]};
	border: ${({ slotStatus }) =>
		slotStatus === 'available' ? `1px solid ${palette.gray['02']}` : 'none'};
	opacity: ${({ slotStatus }) => (slotStatus === 'cancelled' ? 0.5 : 1)};
	cursor: ${({ slotStatus }) =>
		isClickableStatus(slotStatus) ? 'pointer' : 'default'};
	transition: opacity 0.1s ease;
	color: ${({ slotStatus }) =>
		slotStatus === 'booked-jupiter' || slotStatus === 'booked-google'
			? palette.white
			: palette.text.primary};

	&:hover {
		opacity: ${({ slotStatus }) =>
			isClickableStatus(slotStatus)
				? 0.9
				: slotStatus === 'cancelled'
					? 0.5
					: 1};
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
	margin-top: ${spacing.xs};
	border-radius: ${spacing.xs};
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

// ─── Footer Legend ─────────────────────────────────────────────────────────────

export const WeekFooter = styled(Box)`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: ${spacing.medium};
	padding-top: ${spacing.mediumSmall};
	border-top: 1px solid ${palette.gray['02']};
	flex-shrink: 0;
	justify-content: space-between;
	margin-bottom: 0;

	${isMobileMedia} {
		margin-bottom: 140px;
	}
`;

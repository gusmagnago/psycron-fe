import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

import type { SlotStatus } from './AvailabilityWeekPage.mock';

// ─── Slot colours ─────────────────────────────────────────────────────────────

export const SLOT_COLORS: Record<SlotStatus, string> = {
	available: palette.white,
	'booked-jupiter': palette.brand.purple,
	'booked-google': palette.brand.google,
	cancelled: palette.gray['02'],
};

const isBookedStatus = (status: SlotStatus) =>
	status === 'booked-jupiter' || status === 'booked-google';

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

export const WeekFeaturesActions = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.extraSmall};
`;

export const WeekActionsWrapper = styled(Box)`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

export const WeekActions = styled(Box)`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

export const WeekHeaderLeft = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: ${spacing.medium};
`;

export const WeekHeaderRight = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: ${spacing.medium};
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

export const NavButton = styled(Button)`
	background: ${palette.background.default};
	color: ${palette.brand.purple};
	display: flex;
	min-width: ${spacing.medium};

	&.Mui-disabled {
		opacity: 0.3;
		cursor: not-allowed;
		pointer-events: auto;
	}

	${isMobileMedia} {
		padding: ${spacing.xs};
	}
`;

export const TodayButton = styled(Button)`
	white-space: nowrap;
	transition: opacity 0.15s ease;

	&:hover {
		opacity: 0.9;
	}

	& span {
		display: flex;
		align-items: center;
		gap: ${spacing.xs};
	}
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
	gap: ${spacing.space};
	min-width: 560px;
`;

// ─── Day column header ─────────────────────────────────────────────────────────

export const DayHeader = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isDisabled',
})<{ isDisabled?: boolean }>`
	height: 60px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: ${spacing.extraSmall};
	opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
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
`;

export const TimeLabelText = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
	font-weight: 500;
	white-space: nowrap;
`;

// ─── Desktop slot cell ─────────────────────────────────────────────────────────

export const SlotCell = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'slotStatus',
})<{ slotStatus: SlotStatus }>`
	height: 60px;
	width: 100%;
	border-radius: ${spacing.extraSmall};
	padding: ${spacing.xs} ${spacing.small};

	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;

	cursor: ${({ slotStatus }) =>
		isBookedStatus(slotStatus) ? 'pointer' : 'default'};

	background-color: ${({ slotStatus }) => SLOT_COLORS[slotStatus]};
	border: ${({ slotStatus }) =>
		slotStatus === 'available' ? `1px solid ${palette.gray['02']}` : 'none'};
	opacity: ${({ slotStatus }) => (slotStatus === 'cancelled' ? 0.5 : 1)};
	transition: opacity 0.1s ease;
	overflow: hidden;
	margin-bottom: ${spacing.space};

	& > div {
		flex-direction: column;
		justify-content: center;
		height: 100%;
	}

	&:hover {
		opacity: ${({ slotStatus }) =>
			isBookedStatus(slotStatus) ? 0.9 : slotStatus === 'cancelled' ? 0.5 : 1};
	}

	color: ${({ slotStatus }) =>
		isBookedStatus(slotStatus) ? palette.white : palette.text.primary};

	& .MuiTypography-root {
		color: inherit;
	}
`;

export const SlotCellEmpty = styled(Box)`
	height: 60px;
	width: 100%;
	border-radius: ${spacing.extraSmall};
	margin-bottom: ${spacing.space};
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

export const MobileDayCard = styled(Box)`
	background: ${palette.white};
	border-radius: ${spacing.mediumSmall};
	padding: ${spacing.small};
	overflow: hidden;
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

export const MobileSlotCard = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'slotStatus',
})<{ slotStatus: SlotStatus }>`
	width: 100%;
	border-radius: ${spacing.small};
	padding: ${spacing.xxs} ${spacing.small};
	height: 65px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;

	text-align: left;
	background-color: ${({ slotStatus }) => SLOT_COLORS[slotStatus]};
	border: ${({ slotStatus }) =>
		slotStatus === 'available' ? `1px solid ${palette.gray['02']}` : 'none'};
	opacity: ${({ slotStatus }) => (slotStatus === 'cancelled' ? 0.5 : 1)};
	cursor: ${({ slotStatus }) =>
		isBookedStatus(slotStatus) ? 'pointer' : 'default'};
	transition: opacity 0.1s ease;
	color: ${({ slotStatus }) =>
		isBookedStatus(slotStatus) ? palette.white : palette.text.primary};

	& > div {
		height: 100%;
		gap: ${spacing.space};
	}

	& .MuiTypography-root {
		color: inherit;
	}

	&:hover {
		opacity: ${({ slotStatus }) =>
			isBookedStatus(slotStatus) ? 0.9 : slotStatus === 'cancelled' ? 0.5 : 1};
	}
`;

export const MobileSlotTime = styled(Text)`
	font-size: 13px;
	font-weight: 500;
	width: 60px;
`;

export const MobileSlotPatient = styled(Text)`
	font-size: 14px;
	font-weight: 600;
	width: 80px;
`;

export const MobileSlotTherapy = styled(Text)`
	font-size: 11px;
	opacity: 0.8;
	padding-left: ${spacing.space};
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

	margin-bottom: 0;

	${isMobileMedia} {
		margin-bottom: 140px;
	}
`;

export const LegendItem = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const LegendSwatch = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'swatchStatus',
})<{ swatchStatus: SlotStatus }>`
	width: ${spacing.mediumSmall};
	height: ${spacing.mediumSmall};
	border-radius: ${spacing.xxs};
	background-color: ${({ swatchStatus }) => SLOT_COLORS[swatchStatus]};
	border: ${({ swatchStatus }) =>
		swatchStatus === 'available' ? `1px solid ${palette.gray['02']}` : 'none'};
	opacity: ${({ swatchStatus }) => (swatchStatus === 'cancelled' ? 0.5 : 1)};
	flex-shrink: 0;
`;

export const LegendLabel = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
`;

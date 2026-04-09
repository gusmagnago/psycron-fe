import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import {
	isMediumMedia,
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

import type { SlotStatus } from './AvailabilityWeekPage.types';

// ─── Slot colours ─────────────────────────────────────────────────────────────

export const SLOT_COLORS: Record<SlotStatus, string> = {
	available: palette.white,
	blocked: palette.gray['02'],
	buffer: hexToRgba(palette.brand.purple, 0.18),
	'booked-google': palette.brand.google,
	'booked-jupiter': palette.brand.purple,
	cancelled: palette.warning.surface.light,
};

export const BUFFER_COLORS: Record<
	'booked' | 'booked-google' | 'booked-jupiter',
	string
> = {
	'booked-google': palette.brand.google,
	booked: palette.brand.purple,
	'booked-jupiter': palette.brand.purple,
};

export const isClickableStatus = (status: SlotStatus) =>
	status.includes('booked') || status === 'available' || status === 'cancelled';

export const getSlotTextColor = (slotStatus: SlotStatus): string => {
	if (slotStatus.includes('booked')) return palette.white;
	if (slotStatus === 'available') return palette.text.primary;
	if (slotStatus === 'blocked') return palette.gray.dark;
	if (slotStatus === 'cancelled') return palette.warning.dark;
	return palette.text.primary;
};

export const getSlotBorder = (slotStatus: SlotStatus): string => {
	if (slotStatus === 'available') return `1px solid ${palette.gray['02']}`;
	if (slotStatus === 'cancelled') return `1px dashed ${palette.warning.main}`;
	return 'none';
};

export const hasPersistentSlotShadow = (slotStatus: SlotStatus): boolean =>
	slotStatus === 'available' || slotStatus.includes('booked');

// ─── Card ─────────────────────────────────────────────────────────────────────

export const WeekCard = styled(Box)`
	width: 100%;
	max-height: calc(100vh - 8.75rem);
	min-height: 800px;
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

	${isMediumMedia} {
		margin-bottom: 3.75rem;
	}

	${isSmallerThanTabletMedia} {
		min-height: 37.5rem;
		max-height: calc(100vh - 12.5rem);
	}

	${isMobileMedia} {
		height: auto;
		box-shadow: none;
		padding: 0;
		overflow: visible;
		margin-bottom: -8.75rem;
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
	flex-direction: row;

	${isMobileMedia} {
		gap: ${spacing.small};
		flex-direction: column;
		align-items: center;
	}
`;

export const WeekNavRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};

	${isMobileMedia} {
		width: 100%;
		justify-content: space-between;
	}
`;

export const WeekTitleBlock = styled(Box)`
	display: flex;
	flex-direction: column;
`;

export const WeekFeaturesActions = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${spacing.xs};

	${isMobileMedia} {
		flex-direction: row;
		width: 100%;
		justify-content: center;
	}
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

export const SlotBufferLabel = styled(Text)`
	font-size: 11px;
	font-weight: 500;
	color: ${palette.gray['05']};
	letter-spacing: 0.02em;
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
`;

export const WeekFooterActions = styled(Box)`
	display: flex;
	gap: ${spacing.xs};
`;

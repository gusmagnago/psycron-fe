import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
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
	available: hexToRgba(palette.brand.purple, 0.06),
	blocked: 'transparent',
	buffer: hexToRgba(palette.brand.purple, 0.18),
	'booked-google': hexToRgba(palette.gray['08'], 0.13),
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
	status.includes('booked') ||
	status === 'available' ||
	status === 'blocked' ||
	status === 'buffer' ||
	status === 'cancelled';

export const getSlotTextColor = (slotStatus: SlotStatus): string => {
	if (slotStatus === 'booked-jupiter') return palette.white;
	if (slotStatus === 'booked-google') return palette.gray['08'];
	if (slotStatus === 'available') return palette.text.primary;
	if (slotStatus === 'blocked') return palette.gray.dark;
	if (slotStatus === 'cancelled') return palette.warning.dark;
	return palette.text.primary;
};

export const getSlotBorder = (slotStatus: SlotStatus): string => {
	if (slotStatus === 'available') return '0 solid transparent';
	if (slotStatus === 'booked-google') return '0 solid transparent';
	if (slotStatus === 'cancelled') return `1px dashed ${palette.warning.main}`;
	return 'none';
};

export const hasPersistentSlotShadow = (slotStatus: SlotStatus): boolean =>
	slotStatus === 'booked-jupiter';

export const WeekWorkspaceViewbar = styled(Box)`
	min-height: 74px;
	padding: 0 ${spacing.medium};
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
	flex-shrink: 0;

	${isMobileMedia} {
		min-height: 0;
		padding: ${spacing.extraSmall} ${spacing.small};
		align-items: flex-start;
		flex-direction: column;
	}
`;

export const WeekWorkspaceTitleGroup = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	min-width: 0;

	${isMobileMedia} {
		width: 100%;
		justify-content: space-between;
	}
`;

export const WeekWorkspaceTitleCopy = styled(Box)`
	min-width: 0;
`;

export const WeekWorkspaceTitle = styled('h2')`
	margin: 0;
	font-size: 22px;
	line-height: 1.2;
	font-weight: 800;
	color: ${palette.text.primary};
`;

export const WeekWorkspaceSubtitle = styled('span')`
	display: block;
	margin-top: 3px;
	color: ${palette.text.secondary};
	font-size: 13px;

	${isMobileMedia} {
		display: none;
	}
`;

export const WeekWorkspaceControls = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: ${spacing.extraSmall};
	flex-wrap: wrap;

	${isMobileMedia} {
		width: 100%;
		justify-content: stretch;

		& > * {
			flex: 1;
		}
	}
`;

export const WeekCalendarScroll = styled(Box)`
	flex: 1 1 auto;
	min-height: 0;
	overflow: auto;
	display: flex;
	flex-direction: column;
	overscroll-behavior: contain;
	content-visibility: auto;
`;

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

export const WeekTitle = styled('span')`
	font-size: 1.3rem;
	font-weight: 500;
	color: ${palette.text.primary};
	line-height: 1.2;

	${isMobileMedia} {
		font-size: 1.2rem;
	}
`;

export const WeekSubtitle = styled('span')`
	font-size: 0.875rem;
	color: ${palette.gray['05']};
	margin-top: ${spacing.space};
`;

export const FilterButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	border: 0;
	color: ${palette.text.primary};
	white-space: nowrap;

	& span {
		display: flex;
		align-items: center;
		gap: ${spacing.xs};
	}
`;

export const GhostActionButton = styled(Button)`
	border: 0;
`;

export const SlotBufferLabel = styled('span')`
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
	padding: ${spacing.small};
	border-top: 1px solid ${palette.gray['02']};
	flex-shrink: 0;
	justify-content: space-between;
	margin-bottom: 0;
`;

export const WeekFooterActions = styled(Box)`
	display: flex;
	gap: ${spacing.xs};
`;

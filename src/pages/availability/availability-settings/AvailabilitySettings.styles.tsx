import styled from '@emotion/styled';
import { Box, LinearProgress } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export const SettingsWrapper = styled(Box)`
	display: flex;
	flex-direction: row;
	padding: ${spacing.small};
	gap: ${spacing.medium};
	width: 100%;
	margin-bottom: 0;

	${isMobileMedia} {
		padding: 0;
		flex-direction: column;
		margin-bottom: 120px;
	}
`;

// ─── Jupiter's Availability panel ────────────────────────────────────────────────────────────

export const JupiterAvailabilityPanel = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

// ─── Checklist card ────────────────────────────────────────────────────────────

export const ChecklistCard = styled(Box)`
	border-radius: 16px;
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.15)};
	padding: ${spacing.mediumSmall};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	text-align: left;
	width: 600px;

	${isMobileMedia} {
		width: 100%;
		gap: ${spacing.xxs};
		padding: ${spacing.small};
	}
`;

export const ChecklistHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const ChecklistTitle = styled(Text)`
	font-size: 1.3rem;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const ChecklistSubtitle = styled(Text)`
	color: ${palette.text.secondary};
`;

export const ChecklistProgress = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const ChecklistProgressBar = styled(LinearProgress)`
	flex: 1;
	height: 6px;
	border-radius: 3px;
	background-color: ${hexToRgba(palette.brand.purple, 0.12)};

	.MuiLinearProgress-bar {
		background-color: ${palette.brand.purple};
		border-radius: 3px;
	}
`;

export const ChecklistProgressLabel = styled(Text)`
	font-weight: 600;
	color: ${palette.text.secondary};
	flex-shrink: 0;
`;

export const ChecklistDivider = styled(Box)`
	height: 1px;
	background-color: ${hexToRgba(palette.brand.purple, 0.08)};
	margin: 0 -${spacing.mediumSmall};
`;

// ─── Checklist row ─────────────────────────────────────────────────────────────

export const ChecklistRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xs} 0;
`;

export const ChecklistRowIcon = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isConfigured',
})<{ isConfigured: boolean }>`
	width: 22px;
	height: 22px;
	border-radius: 50%;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	background-color: ${({ isConfigured }) =>
		isConfigured ? palette.success.main : hexToRgba(palette.brand.purple, 0.1)};
	color: ${({ isConfigured }) =>
		isConfigured ? palette.white : palette.brand.purple};
	transition: background-color 0.2s ease;
`;

export const ChecklistRowContent = styled(Box)`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

export const ChecklistRowTitle = styled(Text)`
	font-weight: 600;
	color: ${palette.text.primary};
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	flex-wrap: wrap;
`;

export const RecommendedBadge = styled(Text)`
	padding: ${spacing.xxs} ${spacing.xs};
	border-radius: ${spacing.small};
	font-size: 11px;
	font-weight: 600;
	background-color: ${palette.alert.main};
	color: ${palette.alert.dark};
`;

export const ChecklistRowDesc = styled(Text)`
	font-size: 0.8rem;
	color: ${palette.text.secondary};
	margin-top: 1px;
`;

// ─── Drawer field groups (settings-specific) ──────────────────────────────────

export const DrawerFieldGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const DrawerFieldLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.text.secondary};
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const OptionChipsRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const OptionChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	padding: ${spacing.xs} ${spacing.small};
	border-radius: ${spacing.small};
	border: 1.5px solid
		${({ isSelected }) =>
			isSelected ? palette.brand.purple : palette.gray['02']};
	background: ${({ isSelected }) =>
		isSelected ? hexToRgba(palette.brand.purple, 0.08) : 'transparent'};
	color: ${({ isSelected }) =>
		isSelected ? palette.brand.purple : palette.text.primary};
	font-size: 14px;
	font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};
	cursor: pointer;
	user-select: none;
	transition: all 0.15s ease;

	&:hover {
		border-color: ${palette.brand.purple};
		background: ${hexToRgba(palette.brand.purple, 0.05)};
	}
`;

export const OptionDesc = styled(Text)`
	font-size: 13px;
	color: ${palette.text.secondary};
	line-height: 1.5;
	padding-top: ${spacing.xs};
	text-align: left;
`;

// ─── Working hours time range ──────────────────────────────────────────────────

export const TimeRangeRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
`;

export const TimeRangeSeparator = styled(Text)`
	color: ${palette.text.secondary};
	flex-shrink: 0;
`;

// ─── Status card ──────────────────────────────────────────────────────────────

export const StatusCard = styled(Box)`
	border-radius: 16px;
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.15)};
	padding: ${spacing.mediumSmall};
	display: flex;
	flex-direction: row;
	gap: ${spacing.medium};

	${isMobileMedia} {
		padding: ${spacing.small};
	}
`;

export const StatusStat = styled(Box)`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const StatusStatValue = styled(Text)`
	font-size: 1.6rem;
	font-weight: 700;
	color: ${palette.brand.purple};
	line-height: 1;
`;

export const StatusStatLabel = styled(Text)`
	font-size: 0.75rem;
	font-weight: 500;
	color: ${palette.text.secondary};
	text-transform: uppercase;
	letter-spacing: 0.04em;
`;

export const StatusStatSub = styled(Text)`
	font-size: 0.75rem;
	color: ${palette.text.secondary};
	margin-top: ${spacing.xxs};
`;

export const StatusDivider = styled(Box)`
	width: 1px;
	background-color: ${hexToRgba(palette.brand.purple, 0.1)};
	align-self: stretch;
`;

// ─── Google Calendar connected state ──────────────────────────────────────────

export const GoogleCalendarStatus = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.small} ${spacing.mediumSmall};
	border-radius: ${spacing.small};
	background: ${hexToRgba(palette.success.main, 0.08)};
	border: 1px solid ${hexToRgba(palette.success.main, 0.25)};
	color: ${palette.success.main};
`;

import styled from '@emotion/styled';
import { Box, TextField } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Patient identity ─────────────────────────────────────────────────────────

export const DrawerBadgeRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	flex-wrap: wrap;
`;

export const ConfirmedBadge = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'badgeColor',
})<{ badgeColor?: string }>`
	background: ${({ badgeColor }) => badgeColor ?? palette.brand.purple};
	padding: ${spacing.space} ${spacing.mediumSmall};
	border-radius: ${spacing.extraSmall};
	display: inline-flex;
	align-items: center;
`;

export const ConfirmedBadgeText = styled(Text)`
	font-size: 12px;
	color: ${palette.white};
	font-weight: 500;
`;

export const AvailableBadge = styled(Box)`
	display: inline-flex;
	align-items: center;
	gap: ${spacing.xxs};
	padding: ${spacing.space} ${spacing.mediumSmall};
	border-radius: ${spacing.extraSmall};
	background: ${hexToRgba(palette.success.main, 0.12)};
	color: ${palette.success.dark};

	& svg {
		width: 14px;
		height: 14px;
	}
`;

export const AvailableBadgeText = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.success.dark};
`;

export const SourceBadge = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isGoogle',
})<{ isGoogle: boolean }>`
	padding: ${spacing.space} ${spacing.mediumSmall};
	border-radius: ${spacing.extraSmall};
	display: inline-flex;
	align-items: center;
	gap: ${spacing.xxs};
	background: ${({ isGoogle }) =>
		isGoogle
			? palette.primary.dark
			: `linear-gradient(to right, ${hexToRgba(palette.brand.purple, 0.15)}, ${hexToRgba(palette.primary.main, 0.25)})`};

	& svg {
		width: 18px;
		height: auto;
	}
`;

export const SourceBadgeText = styled(Text, {
	shouldForwardProp: (prop) => prop !== 'isGoogle',
})<{ isGoogle: boolean }>`
	font-size: 12px;
	font-weight: 500;
	color: ${({ isGoogle }) => (isGoogle ? palette.white : palette.brand.purple)};
`;

// ─── Detail rows ──────────────────────────────────────────────────────────────

export const DrawerDetailsList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.mediumLarge};
	margin-bottom: ${spacing.large};
`;

export const DrawerDetailRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.medium};
`;

export const DrawerDetailIcon = styled(Box)`
	background: ${palette.background.default};
	border-radius: ${spacing.extraSmall};
	box-shadow: ${shadowSmall};
	padding: ${spacing.extraSmall};
	flex-shrink: 0;
	color: ${palette.brand.purple};
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const DrawerDetailWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

export const DrawerDetailLabel = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
	margin-bottom: ${spacing.space};
	text-align: left;
`;

export const DrawerDetailValue = styled(Text)`
	font-size: 15px;
	color: ${palette.text.primary};
	line-height: 1.6;
	text-align: left;
`;

export const DrawerDetailSub = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
	margin-top: ${spacing.space};
	text-align: left;
`;

// ─── Form ─────────────────────────────────────────────────────────────────────

export const FormWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

// ─── Address override ──────────────────────────────────────────────────────────

// ─── Share address ────────────────────────────────────────────────────────────

export const ShareAddressRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
	padding-top: ${spacing.small};
`;

export const ShareAddressLabel = styled(Text)`
	font-size: 0.9rem;
	color: ${palette.text.primary};
	flex: 1;
	text-align: left;
`;

// ─── Cancel/block views ────────────────────────────────────────────────────────

export const CancelViewBody = styled(Text)`
	font-size: 14px;
	color: ${palette.text.primary};
	line-height: 1.6;
`;

export const BlockConfirmWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

export const BlockReasonField = styled(TextField)`
	margin-top: ${spacing.xs};
`;

export const CancelChoiceWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const CancelChoiceCard = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isDanger',
})<{ isDanger?: boolean }>`
	border: 1.5px solid
		${({ isDanger }) =>
			isDanger
				? hexToRgba(palette.error.main, 0.4)
				: hexToRgba(palette.brand.purple, 0.35)};
	border-radius: ${spacing.extraSmall};
	padding: ${spacing.medium};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	transition:
		background 0.15s ease,
		border-color 0.15s ease;
	&:hover {
		border-color: ${({ isDanger }) =>
			isDanger ? palette.error.main : palette.brand.purple};
		background: ${({ isDanger }) =>
			isDanger
				? hexToRgba(palette.error.main, 0.04)
				: hexToRgba(palette.brand.purple, 0.04)};
	}
`;

export const CancelChoiceCardTitle = styled(Text)`
	font-size: 14px;
	font-weight: 600;
	color: ${palette.text.primary};
`;

export const CancelChoiceCardSub = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
`;

// ─── Contact link button ───────────────────────────────────────────────────────

export const ContactLinkAnchor = styled('a')`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${spacing.small};
	width: 100%;
	padding: ${spacing.small} ${spacing.medium};
	border: 1.5px solid ${hexToRgba(palette.brand.purple, 0.4)};
	border-radius: ${spacing.extraSmall};
	color: ${palette.brand.purple};
	font-size: 14px;
	font-weight: 500;
	text-decoration: none;
	transition:
		background 0.15s ease,
		border-color 0.15s ease;
	cursor: pointer;
	& svg {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}
	&:hover {
		background: ${hexToRgba(palette.brand.purple, 0.06)};
		border-color: ${palette.brand.purple};
	}
`;

// ─── Reschedule slot picker ────────────────────────────────────────────────────

export const SlotPickerList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	max-height: 320px;
	overflow-y: auto;
	padding-right: ${spacing.extraSmall};
`;

export const SlotPickerGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const SlotPickerDateLabel = styled(Text)`
	font-size: 13px;
	font-weight: 600;
	color: ${palette.gray['05']};
	text-transform: capitalize;
`;

export const SlotPickerChipsRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.extraSmall};
`;

export const SlotPickerEmpty = styled(Box)`
	padding: ${spacing.medium} 0;
	text-align: center;
	color: ${palette.text.secondary};
	font-size: 0.875rem;
`;

export const SlotPickerChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>`
	padding: ${spacing.space} ${spacing.small};
	border-radius: ${spacing.extraSmall};
	border: 1.5px solid
		${({ isSelected }) =>
			isSelected ? palette.brand.purple : palette.gray['03']};
	background: ${({ isSelected }) =>
		isSelected ? hexToRgba(palette.brand.purple, 0.1) : 'transparent'};
	color: ${({ isSelected }) =>
		isSelected ? palette.brand.purple : palette.text.primary};
	font-size: 13px;
	font-weight: ${({ isSelected }) => (isSelected ? '600' : '400')};
	cursor: pointer;
	user-select: none;
	transition:
		border-color 0.15s ease,
		background 0.15s ease;
	&:hover {
		border-color: ${palette.brand.purple};
		background: ${hexToRgba(palette.brand.purple, 0.05)};
	}
`;

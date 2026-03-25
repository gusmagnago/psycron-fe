import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Header ───────────────────────────────────────────────────────────────────

export const DrawerHeader = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: ${spacing.large};
`;

// ─── Patient identity ─────────────────────────────────────────────────────────

export const DrawerPatientName = styled(Text)`
	font-size: 24px;
	font-weight: 500;
	color: ${palette.text.primary};
	margin-bottom: ${spacing.small};

	${isMobileMedia} {
		font-size: 20px;
	}
`;

export const DrawerBadgeRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	flex-wrap: wrap;
`;

export const ConfirmedBadge = styled(Box)`
	background: ${palette.brand.purple};
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
	align-items: flex-start;
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
`;

export const DrawerDetailValue = styled(Text)`
	font-size: 15px;
	color: ${palette.text.primary};
	line-height: 1.6;
`;

export const DrawerDetailSub = styled(Text)`
	font-size: 13px;
	color: ${palette.gray['05']};
	margin-top: ${spacing.space};
`;

// ─── Action buttons ───────────────────────────────────────────────────────────

export const DrawerActions = styled(Box)`
	display: flex;
	gap: ${spacing.medium};
	padding-top: ${spacing.large};
	border-top: 1px solid ${palette.gray['02']};
`;

export const FormWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

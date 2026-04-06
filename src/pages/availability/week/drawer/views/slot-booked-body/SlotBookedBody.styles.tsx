import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Layout ──────────────────────────────────────────────────────────────────

export const BookedBodyWrapper = styled(Box)`
	position: relative;
	display: flex;
	flex-direction: column;

	& p {
		text-align: left;
	}
`;

// ─── Patient identity block ─────────────────────────────────────────────────

export const IdentityBlock = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.medium};
	padding-bottom: ${spacing.medium};
`;

export const IdentityInfo = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	min-width: 0;
	flex: 1;
`;

export const IdentityName = styled(Text)`
	font-size: 15px;
	font-weight: 600;
	color: ${palette.text.primary};
	margin-bottom: ${spacing.xxs};
`;

export const SessionCountText = styled(Text)`
	font-size: 12px;
	color: ${palette.gray['05']};
	margin-bottom: ${spacing.xxs};
`;

export const ContactShortcutsRow = styled(Box)`
	display: flex;
	gap: ${spacing.xs};
	align-items: center;
`;

export const ContactShortcutButton = styled('a')`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: ${spacing.xs};
	background: ${hexToRgba(palette.brand.purple, 0.08)};
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.15)};
	cursor: pointer;
	text-decoration: none;
	transition:
		background 0.15s ease,
		border-color 0.15s ease;
	flex-shrink: 0;

	& svg {
		width: 16px;
		height: 16px;
	}

	&:hover {
		background: ${hexToRgba(palette.brand.purple, 0.14)};
		border-color: ${hexToRgba(palette.brand.purple, 0.3)};
	}
`;

export const ProfileLinkAnchor = styled('a')`
	display: inline-flex;
	align-items: center;
	gap: ${spacing.xxs};
	font-size: 12px;
	color: ${palette.brand.purple};
	text-decoration: none;
	font-weight: 500;
	margin-left: ${spacing.xxs};
	align-self: center;

	& svg {
		width: 12px;
		height: 12px;
	}

	&:hover {
		text-decoration: underline;
	}
`;

// ─── Google sync banner ──────────────────────────────────────────────────────

export const GoogleSyncBanner = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	padding: ${spacing.xs} ${spacing.extraSmall};
	background: ${hexToRgba(palette.brand.google, 0.08)};
	border-radius: ${spacing.xs};
	font-size: 13px;
	color: ${palette.brand.google};
	font-weight: 500;
	margin-bottom: ${spacing.small};

	& svg {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}
`;

// ─── Section layout ──────────────────────────────────────────────────────────

export const SectionWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small} 0;
`;

// ─── Detail rows ─────────────────────────────────────────────────────────────

export const DetailRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0;
	min-height: 32px;
`;

export const DetailRowLeft = styled(Box)`
	flex: 1;
	min-width: 0;
`;

export const DetailLabel = styled(Text)`
	font-size: 12px;
	color: ${palette.gray['05']};
	margin-bottom: 2px;
`;

export const DetailValue = styled(Text)`
	font-size: 14px;
	color: ${palette.text.primary};
	font-weight: 500;
`;

export const DetailSub = styled(Text)`
	font-size: 12px;
	color: ${palette.gray['05']};
	margin-top: 2px;
`;

export const DetailActions = styled(Box)`
	display: flex;
	gap: ${spacing.xxs};
	align-items: center;
	margin-left: ${spacing.xs};
	flex-shrink: 0;
`;

export const ActionIconButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isCopied',
})<{ isCopied?: boolean }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: ${spacing.xs};
	border: none;
	background: ${({ isCopied }) =>
		isCopied ? hexToRgba(palette.success.main, 0.12) : 'transparent'};
	cursor: pointer;
	transition: background 0.15s ease;
	flex-shrink: 0;
	padding: 0;

	& svg {
		width: 14px;
		height: 14px;
	}

	&:hover {
		background: ${({ isCopied }) =>
			isCopied
				? hexToRgba(palette.success.main, 0.12)
				: hexToRgba(palette.gray['03'], 0.4)};
	}

	&:focus-visible {
		outline: 2px solid ${palette.brand.purple};
		outline-offset: 2px;
	}
`;

// ─── Missing field placeholder ───────────────────────────────────────────────

export const MissingFieldText = styled(Text)`
	font-size: 13px;
	font-style: italic;
	color: ${palette.gray['04']};
`;

// ─── Delivery badge ──────────────────────────────────────────────────────────

export const DeliveryBadge = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isOnline',
})<{ isOnline: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: ${spacing.xxs};
	padding: ${spacing.space} ${spacing.xs};
	border-radius: ${spacing.extraSmall};
	background: ${({ isOnline }) =>
		isOnline
			? hexToRgba(palette.brand.purple, 0.1)
			: hexToRgba(palette.success.main, 0.1)};
	font-size: 12px;
	font-weight: 600;
	color: ${({ isOnline }) =>
		isOnline ? palette.brand.purple : palette.success.dark};
`;

// ─── Online session row ──────────────────────────────────────────────────────

export const OnlineSessionRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	padding: ${spacing.xxs} 0;

	& svg {
		width: 16px;
		height: 16px;
	}
`;

export const OnlineSessionLabel = styled(Text)`
	font-size: 14px;
	color: ${palette.text.primary};
	font-weight: 500;
`;

// ─── Request address CTA ─────────────────────────────────────────────────────

export const RequestAddressButton = styled('button')`
	display: inline-flex;
	align-items: center;
	gap: ${spacing.xs};
	padding: ${spacing.xs} ${spacing.extraSmall};
	border-radius: ${spacing.xs};
	border: 1px dashed ${hexToRgba(palette.brand.purple, 0.3)};
	background: ${hexToRgba(palette.brand.purple, 0.06)};
	color: ${palette.brand.purple};
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	transition:
		background 0.15s ease,
		border-color 0.15s ease;
	margin-top: ${spacing.xxs};

	& svg {
		width: 14px;
		height: 14px;
	}

	&:hover {
		background: ${hexToRgba(palette.brand.purple, 0.12)};
		border-color: ${hexToRgba(palette.brand.purple, 0.5)};
	}

	&:focus-visible {
		outline: 2px solid ${palette.brand.purple};
		outline-offset: 2px;
	}
`;

// ─── Notes ───────────────────────────────────────────────────────────────────

export const NotesText = styled(Text)`
	font-size: 14px;
	color: ${palette.text.secondary};
	line-height: 1.55;
`;

// ─── Past appointment ────────────────────────────────────────────────────────

export const PastOverlay = styled(Box)`
	position: absolute;
	inset: 0;
	background: ${hexToRgba(palette.gray['01'], 0.6)};
	pointer-events: none;
	z-index: 1;
	border-radius: ${spacing.xs};
`;

export const PastDisabledFooter = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${spacing.xs};
	width: 100%;
	padding: ${spacing.small};
	border-radius: ${spacing.extraSmall};
	background: ${palette.gray['01']};
	color: ${palette.gray['05']};
	font-size: 13px;
	font-weight: 500;

	& svg {
		width: 16px;
		height: 16px;
	}
`;

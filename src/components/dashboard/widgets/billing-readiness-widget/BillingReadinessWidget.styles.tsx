import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowGlassShimmer } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { BillingStatus } from './BillingReadinessWidget.types';

const statusColors: Record<
	BillingStatus,
	{ bar: string; bg: string; fg: string }
> = {
	empty: {
		bar: palette.error.main,
		bg: palette.error.surface.light,
		fg: palette.error.dark,
	},
	partial: {
		bar: palette.alert.main,
		bg: palette.alert.surface.light,
		fg: palette.alert.dark,
	},
	ready: {
		bar: palette.success.main,
		bg: palette.success.surface.light,
		fg: palette.success.dark,
	},
};

export const BillingRoot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isInteractive',
})<{ isInteractive?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	height: 100%;
	cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
	perspective: 720px;
	text-align: left;

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 2px;
		border-radius: ${spacing.extraSmall};
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
		}
	}
`;

export const BillingTeaser = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: ${spacing.small};
	height: 100%;
	justify-content: center;
`;

export const BillingTeaserIconWrap = styled(Box)`
	align-items: center;
	background: ${palette.gray['01']};
	border-radius: 14px;
	color: ${palette.text.disabled};
	display: flex;
	flex-shrink: 0;
	height: 48px;
	justify-content: center;
	width: 48px;
`;

export const BillingTeaserTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 15px;
	font-weight: 700;
`;

export const BillingTeaserSubText = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 12px;
	line-height: 1.5;
`;

export const BillingContent = styled(Box)`
	align-items: center;
	background:
		linear-gradient(
			160deg,
			${hexToRgba(palette.white, 0.72)},
			${hexToRgba(palette.primary.surface.light, 0.5)}
		),
		${hexToRgba(palette.white, 0.34)};
	border-radius: ${spacing.small};
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xs};
	justify-content: center;
	min-height: 0;
	overflow: hidden;
	padding: ${spacing.xs};
	transform: translateY(0) rotateX(0);
	transition:
		box-shadow 0.24s ease,
		transform 0.24s ease;

	&:hover {
		box-shadow: ${shadowGlassShimmer};
		transform: translateY(-3px) rotateX(2deg);
	}
`;

export const BillingCopy = styled(Box)`
	align-items: center;
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	min-width: 0;
	text-align: left;
`;

export const StatusChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'status',
})<{ status: BillingStatus }>`
	display: inline-flex;
	align-items: center;
	font-size: 11px;
	font-weight: 700;
	padding: ${spacing.space} ${spacing.xs};
	border-radius: 99px;
	background: ${({ status }) => statusColors[status].bg};
	color: ${({ status }) => statusColors[status].fg};
`;

export const BillingSubLabel = styled(Text)`
	color: ${palette.text.primary};
	font-size: 12px;
	font-weight: 800;
	line-height: 1.35;
`;

export const BillingDetails = styled(Text)`
	color: ${palette.text.secondary};
	display: -webkit-box;
	font-size: 10px;
	font-weight: 600;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	line-height: 1.35;
	overflow: hidden;
`;

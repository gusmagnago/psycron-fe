import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowGlassShimmer } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BillingRoot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isInteractive',
})<{ isInteractive?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	height: 100%;
	cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
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

export const BillingContent = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isWide',
})<{ isWide?: boolean }>`
	align-items: center;
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.small};
	justify-content: stretch;
	min-height: 0;
	overflow: hidden;
	padding: ${spacing.xxs} ${spacing.xs} ${spacing.xs};
	transform: translateY(0);
	transition:
		box-shadow 0.24s ease,
		transform 0.24s ease;

	&:hover {
		box-shadow: ${shadowGlassShimmer};
		transform: translateY(-3px);
	}
`;

export const BillingProgressStage = styled(Box)`
	align-items: center;
	display: flex;
	flex: 1 1 auto;
	justify-content: center;
	min-height: 0;
	width: 100%;
`;

export const BillingCopy = styled(Box)`
	align-items: center;
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	gap: ${spacing.space};
	min-width: 0;
	text-align: center;
	width: 100%;
`;

export const BillingSubLabel = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.875rem;
	font-weight: 700;
	line-height: 1.3;
`;

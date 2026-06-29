import { Box, styled } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PromptBanner = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
	flex-wrap: wrap;
	padding: ${spacing.small} ${spacing.mediumSmall};
	border-radius: ${spacing.extraSmall};
	background: ${hexToRgba(palette.brand.purple, 0.06)};
	box-shadow: ${shadowSmall};
	margin-bottom: ${spacing.small};
`;

export const PromptText = styled('p')`
	margin: 0;
	font-size: 13px;
	color: ${palette.text.primary};
	line-height: 1.5;

	& strong {
		font-weight: 700;
	}
`;

export const PromptButton = styled(Button)`
	flex-shrink: 0;
`;

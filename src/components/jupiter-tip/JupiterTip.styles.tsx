import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { jupiterBackgroundMain } from '@psycron/theme/background/background.theme';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const JupiterTipRoot = styled(Box)`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.small};
	padding: ${spacing.small} ${spacing.mediumSmall};
	box-shadow: ${shadowSmall};
	background: ${jupiterBackgroundMain};
	border-radius: ${spacing.medium};
	width: 400px;

	${isMobileMedia} {
		width: 100%;
	}
`;

export const JupiterIconWrapper = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: ${spacing.xs};
	border-radius: ${spacing.xs};
	background-color: ${palette.background.default};
	box-shadow: ${shadowSmall};

	& > svg {
		color: ${palette.brand.purple};
		flex-shrink: 0;
	}
`;

export const JupiterTipContent = styled(Box)`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: ${spacing.space};
`;

export const JupiterTipTitle = styled(Text)`
	color: ${palette.brand.dark};
	font-weight: 600;
	text-align: left;
`;

export const JupiterTipText = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.85rem;
	text-align: left;
`;

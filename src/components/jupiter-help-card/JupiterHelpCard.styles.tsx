import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { jupiterBackgroundSoft } from '@psycron/theme/background/background.theme';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const HelpCardRoot = styled(Box)`
	background: ${jupiterBackgroundSoft};
	border-radius: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.mediumSmall};

	width: 400px;

	${isMobileMedia} {
		width: 100%;
	}
`;

export const HelpCardTitle = styled(Text)`
	color: ${palette.text.primary};
	font-weight: 600;
	text-align: left;
`;

export const HelpCardDescription = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.85rem;
	text-align: left;
`;

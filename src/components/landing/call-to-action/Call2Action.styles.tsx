import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanMediumMedia,
	isBiggerThanTabletMedia,
	isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BGWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'bgColor',
})<{ bgColor?: string }>`
	margin: ${spacing.medium} 0 0;
	border-radius: calc(2 * ${spacing.mediumLarge});

	padding: ${spacing.medium} ${spacing.small};

	background-color: ${({ bgColor }) =>
		bgColor ? bgColor : palette.secondary.light};

	${isBiggerThanTabletMedia} {
		margin: ${spacing.largeXl};
	}
`;

export const Heading = styled(Text)`
	font-size: 2rem;
	font-weight: 800;
	margin-bottom: ${spacing.medium};

	${isBiggerThanTabletMedia} {
		font-size: 2.5rem;
	}

	${isMobileMedia} {
		font-size: 1.5rem;
		text-align: left;
		margin-bottom: ${spacing.small};
	}
`;

export const Call2ActionFooterWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	padding: ${spacing.large} ${spacing.large} 0;

	${isMobileMedia} {
		padding: ${spacing.small} ${spacing.small} 0;
	}
`;

export const Call2ActionFooterItem = styled(Box)`
	width: 100%;
	${isBiggerThanMediumMedia} {
		width: 50%;
	}
`;

export const Call2ActionInputWrapper = styled(Box)`
	padding: ${spacing.small};
	display: flex;
	justify-content: center;
`;

export const StyledDescriptionWrapper = styled(Box)`
	margin-top: ${spacing.medium};

	${isMobileMedia} {
		margin-top: 0;
	}
`;

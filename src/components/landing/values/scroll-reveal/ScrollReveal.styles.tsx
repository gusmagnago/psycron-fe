import { Box, styled } from '@mui/material';
import {
	isBiggerThanMediumMedia,
	isMobileMedia,
	isSmallerThanMediumMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ScrollWrapper = styled(Box)`
	height: auto;
	overflow-y: scroll;
	height: auto;

	${isSmallerThanMediumMedia} {
		height: 100vh;
	}
`;

export const StickyScroll = styled(Box)`
	position: sticky;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: ${spacing.mediumLarge};

	${isBiggerThanMediumMedia} {
		height: 100vh;
		flex-direction: row;
	}
`;

export const ImgWrapper = styled(Box)`
	padding: 0 ${spacing.mediumLarge};

	display: flex;
	align-items: center;
	flex-direction: row;

	${isMobileMedia} {
		flex-direction: column;
		margin-bottom: ${spacing.largeXl};
	}
`;

export const StyledBox = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
`;

export const StyledArrayBox = styled(Box)`
	height: 2rem;
`;

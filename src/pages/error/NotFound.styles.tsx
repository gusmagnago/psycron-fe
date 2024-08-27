import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanMediumMedia,
	isLargeMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ContentBox = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column-reverse;

	${isBiggerThanMediumMedia} {
		height: 80%;
		flex-direction: row;
	}
`;

export const ContentWrapper = styled(Box)`
	height: 80%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	position: relative;

	flex-direction: column-reverse;

	padding: ${spacing.mediumLarge};

	${isBiggerThanMediumMedia} {
		padding: ${spacing.large};
		flex-direction: row;
	}
`;

export const ImgWrapper = styled(Box)`
	height: 100%;
	display: flex;
	align-items: flex-end;
	left: 10%;

	margin-bottom: 0;
	margin-top: 0;

	${isBiggerThanMediumMedia} {
		position: absolute;
		margin-bottom: 0;
		margin-top: 0;
	}

	${isLargeMedia} {
		margin-bottom: 4.5rem;
	}
`;

export const StyledFstImage = styled('img')`
	height: 21.875rem;

	${isBiggerThanMediumMedia} {
		height: 40.625rem;
	}
`;

export const StyledSecondImage = styled('img')`
	height: 6.25rem;

	${isBiggerThanMediumMedia} {
		height: 12.5rem;
	}
`;

export const TextWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	text-align: right;
	width: 100%;
	position: relative;

	${isBiggerThanMediumMedia} {
		width: 70%;
		right: 5%;
	}
`;

export const StyledPageTitle = styled(Text)`
	font-size: 3rem;
	margin-top: 0;
	margin-bottom: ${spacing.medium};

	font-weight: 800;

	${isBiggerThanMediumMedia} {
		font-size: 6em;
	}
`;

export const StyledPageSub = styled(Text)`
	padding-bottom: ${spacing.mediumLarge};
	font-weight: 500;
	margin: 0;
	font-size: 1rem;
	width: 80%;

	${isBiggerThanMediumMedia} {
		width: 60%;
		font-size: 1.5rem;
	}
`;

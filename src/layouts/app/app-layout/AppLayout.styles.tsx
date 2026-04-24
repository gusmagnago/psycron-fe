import { Box, styled } from '@mui/material';
import {
	isBiggerThanMediumMedia,
	isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const AppLayoutDividerMobilePadding = `${spacing.small}`;

export const NavBarWrapper = styled(Box)`
	display: flex;
	flex-direction: column;

	${isBiggerThanMediumMedia} {
		flex-direction: row;
	}
`;

export const Content = styled(Box)`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding-top: ${spacing.medium};
	padding: 0;
	padding-left: 0;

	overflow-y: hidden;
	overflow-x: hidden;

	position: relative;

	${isBiggerThanMediumMedia} {
		margin-top: 0;
	}
`;

export const LayoutWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
	justify-content: flex-start;
	padding: ${spacing.small};
	overflow: hidden;

	${isBiggerThanMediumMedia} {
		flex-direction: row;
		padding: ${spacing.medium} ${spacing.small};
	}

	${isMobileMedia} {
		padding: ${spacing.xs};
	}
`;

export const DividerWrapper = styled(Box)`
	padding-right: 0;
	padding-bottom: ${AppLayoutDividerMobilePadding};

	${isBiggerThanMediumMedia} {
		padding-right: ${spacing.small};
		padding-bottom: 0;
	}
`;

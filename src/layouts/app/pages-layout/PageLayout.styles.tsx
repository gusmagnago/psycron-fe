import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PageLayoutWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	height: 100vh;
	min-height: 0;
	overflow-x: hidden;
	overflow-y: hidden;

	${isSmallerThanTabletMedia} {
		overflow-y: auto;
	}
`;

export const PageTitleWrapper = styled(Box)`
	align-items: flex-start;
	display: flex;
	flex-shrink: 0;
	height: auto;
	justify-content: space-between;
	gap: ${spacing.medium};

	${isMobileMedia} {
		align-items: stretch;
		flex-direction: column;
		gap: ${spacing.small};
	}
`;

export const PageTitleContent = styled(Box)`
	min-width: 0;
`;

export const PageTitleActions = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;

	${isMobileMedia} {
		width: 100%;
	}
`;

export const PageTitle = styled(Text)`
	font-size: 1.4rem;
	font-weight: 600;
	text-align: left;
`;

export const PageSubTitle = styled(Text)`
	font-size: 0.9rem;
	font-weight: 400;
	text-align: left;

	padding: 0 ${spacing.xs};

	${isMobileMedia} {
		font-size: 0.8rem;
	}
`;

export const PageLoaderWrapper = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	height: 100%;
`;

export const PageChildrenWrapper = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	overflow-y: auto;
	overflow-x: hidden;
	padding: ${spacing.small};

	${isMobileMedia} {
		padding: ${spacing.xs};
	}
`;

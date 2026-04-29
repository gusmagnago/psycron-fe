import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PageLayoutWrapper = styled(Box)`
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	overflow-x: hidden;
`;

export const PageTitleWrapper = styled(Box)`
	height: auto;
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
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: ${spacing.small};

	${isMobileMedia} {
		padding: ${spacing.xs};
	}
`;

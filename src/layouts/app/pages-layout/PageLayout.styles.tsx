import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PageLayoutWrapper = styled(Box)`
	height: 100vh;
	display: flex;
	flex-direction: column;
`;

export const PageTitleWrapper = styled(Box)`
	min-height: 60px;
`;

export const PageTitle = styled(Text)`
	font-size: 1.4rem;
	font-weight: 600;
	text-align: left;
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
	overflow-y: auto;
	overflow-x: hidden;
	display: flex;
	flex-direction: column;
	padding: 0 ${spacing.small};

	${isMobileMedia} {
		padding: 0 ${spacing.xs};
	}
`;

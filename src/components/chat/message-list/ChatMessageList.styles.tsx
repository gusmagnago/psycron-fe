import { Box, styled } from '@mui/material';
import { navbarTop } from '@psycron/components/navbar/Navbar.styles';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const OuterBox = styled(Box)`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow-y: hidden;
`;

export const ChatMessageListWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'hasMessages',
})<{ hasMessages: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: 0 ${spacing.small};
	padding-bottom: ${spacing.mediumSmall};

	padding-top: ${({ hasMessages }) => (hasMessages ? navbarTop : 0)};

	overflow-y: auto;
	flex: 1;
	min-height: 0;

	${isBiggerThanMediumMedia} {
		padding: 0 ${spacing.medium};
		gap: ${spacing.medium};
	}
`;

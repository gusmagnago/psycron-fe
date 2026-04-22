import { Box, styled } from '@mui/material';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const NameFormWrapper = styled(Box)`
	display: flex;
	flex-direction: row;
	width: 100%;
	gap: ${spacing.small};

	${isMobileMedia} {
		flex-direction: column;
	}
`;

export const NameInputWrapper = styled(Box)`
	flex: 1;
	width: 100%;
`;

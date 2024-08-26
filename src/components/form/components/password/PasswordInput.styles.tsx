import { Box, styled, TextField } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PasswordWrapper = styled(Box)`
	display: flex;
	width: 100%;

	flex-direction: column;

	${isBiggerThanTabletMedia} {
		flex-direction: row;
	}
`;

export const StyledInput = styled(TextField)`
	padding-bottom: ${spacing.small};
	padding-right: 0;

	${isBiggerThanTabletMedia} {
		padding-bottom: 0;
		padding-right: ${spacing.small};
	}
`;

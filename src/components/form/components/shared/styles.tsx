import { Box, styled, TextField } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const InputFields = styled(TextField)`
	margin: ${spacing.small} 0;
	box-sizing: border-box;
	max-width: 400px;
`;

export const SignUpWrapper = styled(Box)`
	padding: ${spacing.medium} ${spacing.mediumSmall};

	height: auto;
	border-radius: calc(2 * ${spacing.mediumSmall});
	box-shadow: ${shadowPress};
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color: ${palette.background.default};
`;

export const LogoWrapper = styled(Box)`
	display: flex;
	justify-content: center;

	svg {
		width: 3.25rem;
		height: auto;
	}
`;

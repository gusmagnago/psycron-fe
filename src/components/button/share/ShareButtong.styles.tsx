import { Box, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowDisabled } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ShareButtonRoot = styled(Box)`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	& span {
		width: 18px;
		height: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: ${palette.brand.purple};
	}
	&:hover {
		& span {
			color: ${palette.white};
		}
	}
`;

export const ShareButtonsWrapper = styled(Box)`
	background-color: ${palette.background.default};
	position: absolute;
	padding: ${spacing.xs};
	border-radius: ${spacing.mediumSmall};
	display: flex;
	align-items: center;

	filter: ${shadowDisabled};

	right: 0;
	top: calc(100% + ${spacing.xs});
	z-index: 10;

	& svg {
		color: ${palette.brand.purple};
	}
`;

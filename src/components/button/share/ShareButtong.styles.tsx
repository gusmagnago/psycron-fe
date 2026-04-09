import { Box, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowDisabled } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ShareButtonRoot = styled(Box)`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 24px;
	width: 24px;

	& span {
		height: 24px;
		width: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

export const ShareButtonsWrapper = styled(Box)`
	background-color: ${palette.background.default};
	position: absolute;
	padding: ${spacing.xs};
	border-radius: 20px;
	display: flex;
	align-items: center;

	filter: ${shadowDisabled};

	right: 0;
	top: calc(100% + ${spacing.xs});
	z-index: 10;

	& > svg {
		color: ${palette.black};
	}
`;

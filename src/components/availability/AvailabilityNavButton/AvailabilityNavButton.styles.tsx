import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowInnerPress,
	shadowMedium,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const NavButtonStyled = styled(ButtonBase)`
	background: ${palette.background.default};
	border-radius: 15px;
	box-shadow: ${shadowMedium};
	width: 45px;
	height: 45px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${palette.brand.purple};
	transition: box-shadow 0.15s ease;

	&:hover {
		box-shadow: ${shadowSmall};
	}

	&.Mui-disabled {
		box-shadow: ${shadowInnerPress};
		opacity: 0.35;
		cursor: not-allowed;
		pointer-events: auto;
	}
`;

export const NavButtons = styled(Box)`
	display: flex;
	gap: ${spacing.extraSmall};
`;

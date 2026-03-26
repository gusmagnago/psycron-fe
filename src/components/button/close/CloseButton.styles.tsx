import styled from '@emotion/styled';
import { Button } from '@psycron/components/button/Button';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';

export const StyledCloseButton = styled(Button)`
	min-width: unset;
	width: 25px;
	height: 25px;
	padding: 0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${palette.background.default};
	box-shadow: ${shadowSmall};

	& svg {
		height: 15px;
		stroke-width: 3px;
		width: auto;
		color: ${palette.brand.purple};
	}
	&:hover {
		svg {
			color: ${palette.background.default};
		}
	}
`;

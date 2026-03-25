import { Paper, styled } from '@mui/material';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover } from '@psycron/theme/zIndex';

export const StyledPaperModal = styled(Paper)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 80%;
	height: 0;
	z-index: ${zIndexHover};

	padding: ${spacing.small};
	background-color: ${palette.background.default};

	${isMobileMedia} {
		width: 100%;
		padding: ${spacing.xs};
		border-radius: 0;
		height: 100%;
	}
`;

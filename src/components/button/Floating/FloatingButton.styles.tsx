import { Box, css, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain, shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover } from '@psycron/theme/zIndex';

export const FloatingButtonWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'isVisible',
})<{ isVisible: boolean }>`
	height: ${({ isVisible }) => (isVisible ? 'auto' : '6.25rem')};
	position: absolute;
	right: 0;

	display: flex;
	background-color: rgba(170, 170, 204, 0.1);
	box-shadow: ${shadowPress};

	z-index: ${zIndexHover};

	align-items: center;
	justify-content: center;

	padding: ${spacing.xs};

	border-top-left-radius: 20px;
	border-bottom-left-radius: 20px;
	backdrop-filter: blur(10px);

	:hover {
		cursor: pointer;
		background-color: ${palette.gray['03']};
		box-shadow: ${shadowMain};
	}
`;

export const ContentWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'isVisible',
})<{ isVisible: boolean }>`
	display: flex;
	flex-direction: column;
	width: auto;
	height: auto;

	${({ isVisible }) =>
		isVisible &&
		css`
			:hover {
				cursor: auto;
			}
		`}
`;

import { Box, css, keyframes, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';

export const bounce = keyframes`
0%, 80%, 100% {
	transform: scale(0);
}
40% {
	transform: scale(1);
}
`;

export const LoaderBubblesWrapper = styled(Box)`
	gap: 0.375rem;
	width: 100%;
	height: 1.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const bubbleStyle = (delay: string) => css`
	width: 0.625rem;
	height: 0.625rem;
	background-color: ${palette.secondary.main};
	border-radius: 50%;
	animation: ${bounce} 1.4s infinite ease-in-out;
	animation-delay: ${delay};
`;

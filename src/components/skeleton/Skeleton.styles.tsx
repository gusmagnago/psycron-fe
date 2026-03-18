import { Box, Paper, Skeleton, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover } from '@psycron/theme/zIndex';

export const StyledSkeletonWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'hasOnClick',
})<{ hasOnClick: boolean }>`
	animation: skeletonPulse 2s ease-in-out infinite;
	position: relative;
	height: 100%;

	@keyframes skeletonPulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
		100% {
			opacity: 1;
		}
	}

	cursor: ${({ hasOnClick }) => (hasOnClick ? 'pointer' : 'default')};
`;

export const SkeletonBox = styled(Paper)`
	display: flex;
	justify-content: center;
	height: 100%;

	:hover {
		box-shadow: ${shadowMain};
		color: ${palette.primary.action.hover};
	}

	.MuiPaper-root {
		padding: 0 !important;
	}
`;

export const StyledSkeleton = styled(Skeleton)`
	border-radius: ${spacing.mediumLarge};
	background-color: ${palette.info.light};
	width: 80%;
`;

export const TextWrapper = styled(Box)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: ${zIndexHover};
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
`;

import {
	Box,
	css,
	DialogActions,
	DialogContent,
	keyframes,
	styled,
} from '@mui/material';
import {
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMain,
	shadowSmallPurple,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover } from '@psycron/theme/zIndex';

const blurIn = keyframes`
0% {
    filter:blur(12px);
    opacity:0
}
100% {
    filter:blur(0);
    opacity:1
}
`;

export const UserDetailsCardWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isVisible' && prop !== 'isPage',
})<{ isPage?: boolean; isVisible?: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	right: auto;

	width: ${({ isPage }) => (!isPage ? '34.375rem' : 'auto')};
	max-height: calc(98dvh - (2 * ${spacing.medium}));
	min-height: 0;

	display: flex;
	flex-direction: column;
	align-items: ${({ isPage }) => (!isPage ? 'normal' : 'center')};
	overflow: hidden;

	padding: 0;
	border-radius: calc(2 * ${spacing.medium});
	border-top-left-radius: ${({ isPage }) =>
		!isPage ? 0 : `calc(2 * ${spacing.medium})`};
	box-shadow: ${({ isPage }) => (!isPage ? `${shadowMain}` : 'none')};
	backdrop-filter: blur(10px);
	z-index: ${zIndexHover};
	border: 2px solid rgba(233, 214, 255, 0.1);

	${({ isVisible }) =>
		isVisible &&
		css`
			animation: ${blurIn} 0.09s linear both;
		`}

	${isSmallerThanTabletMedia} {
		width: 100%;
		max-height: calc(100vh - (2 * ${spacing.xl}));
		border-radius: 0;
	}
`;

export const UserDetailsCardTop = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isPage',
})<{ isPage?: boolean }>`
	padding: ${spacing.mediumSmall};
	border-top-right-radius: ${({ isPage }) =>
		!isPage ? `calc(2 * ${spacing.medium})` : 0};
	background-color: ${hexToRgba(palette.tertiary.main, 0.5)};
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	${isMobileMedia} {
		padding: ${spacing.small};
	}
`;

export const UserDestailsTopInfo = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;

	${isSmallerThanTabletMedia} {
		justify-content: center;
	}
`;

export const UserDestailsTopInfoWrapper = styled(Box)`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.small};
`;

export const UserDetailsTopActionsWrapper = styled(Box)`
	display: flex;
	flex-direction: row;
	gap: ${spacing.space};
`;

export const UserDetailsTopActionButton = styled(Box)`
	padding: ${spacing.space};
	background-color: ${palette.background.default};
	border-radius: ${spacing.small};
	box-shadow: ${shadowSmallPurple};
	height: min-content;

	${isMobileMedia} {
		& button {
			padding: ${spacing.space};
		}
	}
`;

export const UserDetailsSectionWrapper = styled(Box)`
	padding: 0;
`;

export const UserDetailsBody = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isPage',
})<{ isPage?: boolean }>`
	display: flex;
	flex-direction: column;
	padding: ${spacing.small};
	gap: ${spacing.small};
	position: relative;
	flex: 1;
	min-height: 0;
	overflow-y: auto;

	width: ${({ isPage }) => (isPage ? '34.375rem' : '100%')};

	${isSmallerThanTabletMedia} {
		width: 100%;
	}
`;

export const DownloadWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'disabled',
})<{ disabled?: boolean }>`
	height: 5rem;
	width: 5rem;

	display: flex;
	justify-content: center;
	align-items: center;
	background-color: transparent;
	border: 0;

	& > svg {
		width: 100%;
		height: auto;
		color: ${palette.brand.purple};
		border-radius: 50%;
		padding: ${spacing.xxs};

		${({ disabled }) =>
			disabled &&
			css`
				color: ${palette.tertiary.action.disabled};
			`}

		&:hover {
			cursor: pointer;
			color: ${palette.brand.dark};
		}
	}
`;

export const DeleteAccountDialogContent = styled(DialogContent)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const DeleteDialogActions = styled(DialogActions)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

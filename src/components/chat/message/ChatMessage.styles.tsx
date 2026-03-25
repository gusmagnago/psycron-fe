import { Box, css, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMain,
	shadowMediumPurple,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexBg } from '@psycron/theme/zIndex';

export const ChatMessageWrapper = styled(Box, {
	shouldForwardProp: (props) =>
		props !== 'isBot' && props !== 'shouldApplyGlass',
})<{ isBot: boolean; shouldApplyGlass?: boolean }>`
	max-width: 90%;
	display: flex;

	position: relative;
	border-radius: calc(2 * ${spacing.medium});

	${isBiggerThanMediumMedia} {
		max-width: 80%;
	}

	${({ isBot }) =>
		isBot
			? css`
					align-self: flex-start;
					box-shadow: ${shadowSmall};
					background-color: ${palette.background.default};

					p {
						font-weight: 500;
					}
				`
			: css`
					align-self: flex-end;
					border-color: transparent;
					background: linear-gradient(
						300deg,
						${palette.primary.main} 0%,
						${palette.info.main} 100%
					);
					box-shadow: ${shadowMediumPurple};

					p {
						color: ${palette.background.paper};
						font-weight: 700;
					}
				`};

	/* ${({ shouldApplyGlass }) =>
		shouldApplyGlass &&
		css`
			background: rgba(255, 255, 255, 0.08);
			backdrop-filter: blur(10px);
			transition: all 0.3s ease;
		`} */
`;

export const ChatMessageContent = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: flex;
	padding: ${spacing.xs};
	border-radius: ${spacing.medium};
	border-bottom-left-radius: 0;
`;

export const StyledIconWrapper = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;

	min-width: 2.5rem;
	height: 2.5rem;

	padding: ${spacing.space};
	border-radius: calc(2 * ${spacing.medium});

	box-shadow: ${shadowMain};
	background-color: ${palette.background.default};

	& > svg {
		width: 1.5rem;
		height: 1.5rem;
		color: ${palette.info.main};
	}
`;

export const ChatText = styled(Text, {
	shouldForwardProp: (props) => props !== 'isBot',
})<{ isBot: boolean }>`
	font-size: 0.8rem;

	margin-left: ${({ isBot }) => isBot && spacing.xs};

	${({ isBot }) =>
		isBot
			? css`
					text-align: left;
				`
			: css`
					text-align: right;
				`};

	${isBiggerThanMediumMedia} {
		font-size: 1rem;
	}
`;

export const UserBubble = styled(Box)`
	width: 1.25rem;
	height: 1.25rem;
	position: absolute;
	right: -5px;
	bottom: 1px;
	border-radius: 50%;
	background-color: ${palette.primary.main};
	z-index: ${zIndexBg};
`;

export const UserBubbleSmall = styled(Box)`
	width: 0.625rem;
	height: 0.625rem;
	position: absolute;
	right: -15px;
	bottom: -3px;
	border-radius: 50%;
	background-color: ${palette.primary.main};
	z-index: ${zIndexBg};
`;

import { css } from '@emotion/react';
import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanMediumMedia,
	isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain, smallShadow } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

// ─── Shared animations ────────────────────────────────────────────────────────

const messageFadeIn = css`
	@keyframes messageFadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	animation: messageFadeIn 300ms ease-out;
`;

// ─── Shared base styles ───────────────────────────────────────────────────────

const bubbleBase = css`
	border-radius: ${spacing.small};
	padding: ${spacing.extraSmall} ${spacing.small};
	font-size: 14px;
	line-height: 1.5;
	box-shadow: ${smallShadow};

	${messageFadeIn}
`;

const messageGroupBase = css`
	display: flex;
	flex-direction: column;
	max-width: 80%;

	${isMobileMedia} {
		max-width: 90%;
	}
`;

// ─── Components ───────────────────────────────────────────────────────────────

export const CardWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 100%;
	flex: 1;
	position: relative;

	padding: ${spacing.small};

	${isBiggerThanMediumMedia} {
		flex: none;
		width: 640px;
		min-height: 350px;
		max-height: 500px;
		box-shadow: ${shadowMain};
		border-radius: ${spacing.largeXl};
		background: ${palette.background.paper};
		overflow: hidden;
	}
`;

export const PublishingOverlay = styled(Box)`
	position: absolute;
	inset: 0;
	z-index: ${zIndexSticky};
	backdrop-filter: blur(6px);
	background-color: ${hexToRgba(palette.background.paper, 0.6)};
	border-radius: inherit;
	pointer-events: all;
`;

export const PublishingMessageWrapper = styled(Box)`
	position: absolute;
	inset: 0;
	z-index: ${zIndexSticky + 1};
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
`;

export const CardHeader = styled(Box)`
	padding: ${spacing.small} 0;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	flex-shrink: 0;
	align-items: flex-start;
`;

export const CardTitle = styled(Text)`
	font-weight: 700;
	font-size: 20px;
	line-height: 1.2;
`;

export const CardSubtitle = styled(Text)`
	font-size: 14px;
	opacity: 0.5;
	line-height: 1.4;
`;

export const ConversationContainer = styled(Box)`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow-y: auto;
	padding: ${spacing.small};
	gap: ${spacing.xs};
`;

export const BotMessageGroup = styled(Box)`
	${messageGroupBase}
	align-self: flex-start;
	gap: ${spacing.xs};
`;

export const UserMessageGroup = styled(Box)`
	${messageGroupBase}
	align-self: flex-end;
	padding-bottom: ${spacing.small};
`;

export const BotBubble = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isFirst',
})<{ isFirst: boolean }>`
	${bubbleBase}

	background: linear-gradient(
		90deg,
		${hexToRgba(palette.secondary.main, 0.2)} 0%,
		${hexToRgba(palette.primary.main, 0.4)} 100%
	);
	color: inherit;
	text-align: left;

	${({ isFirst }) =>
		isFirst &&
		css`
			border-top-left-radius: 0;
		`}
`;

export const UserBubble = styled(Box)`
	${bubbleBase}

	background-color: ${palette.brand.light};
	border-top-right-radius: 0;
	align-self: flex-end;
	text-align: right;
`;

export const IconRow = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'showIcon',
})<{ showIcon: boolean }>`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.xs};

	& svg {
		visibility: ${({ showIcon }) => (showIcon ? 'visible' : 'hidden')};
		color: ${palette.brand.purple};
		flex-shrink: 0;
	}
`;

export const ChipsInline = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

export {
	OtherBackButton as BackButton,
	OtherInputRow as InputRow,
	OtherSendButton as SendButton,
} from '@psycron/components/chat/chips/ChatChips.styles';

export const ThinkingBubble = styled(Box)`
	${bubbleBase}

	background: linear-gradient(
		90deg,
		${hexToRgba(palette.secondary.main, 0.2)} 0%,
		${hexToRgba(palette.primary.main, 0.4)} 100%
	);
	align-self: flex-start;
	margin-top: ${spacing.xs};

	@keyframes thinking {
		0%,
		80%,
		100% {
			opacity: 0.2;
			transform: scale(0.8);
		}
		40% {
			opacity: 1;
			transform: scale(1);
		}
	}

	& span {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		margin: 0 2px;

		&:nth-of-type(1) {
			animation: thinking 1.2s infinite 0s;
		}
		&:nth-of-type(2) {
			animation: thinking 1.2s infinite 0.2s;
		}
		&:nth-of-type(3) {
			animation: thinking 1.2s infinite 0.4s;
		}
	}
`;

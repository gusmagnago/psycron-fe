import { css } from '@emotion/react';
import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { jupiterBackgroundMain } from '@psycron/theme/background/background.theme';
import {
	isBiggerThanMediumMedia,
	isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowGlassShimmer,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
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
	box-shadow: ${shadowSmall};

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

// Mirrors the preview's `jupiter-onboarding-root` (the prototype `.chat`):
// a flex column that fills the workspace content area, with a scrolling stream
// above a fixed dock. The workspace shell provides the surrounding frame, so
// there is no floating card here.
export const CardWrapper = styled(Box)`
	position: relative;
	display: flex;
	flex: 1;
	min-height: 0;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;

// `jupiter-onboarding-stream` — the scrollable message region. Bottom-anchoring
// is done by the reading's margin-top: auto (NOT justify-content: flex-end, which
// clips the top of an overflowing flex column and blocks scrolling up). The
// column narrows on desktop. `bottomInset` reserves the glass dock's height as
// padding so the latest message rests just above it while older messages scroll
// behind the glass.
export const ConversationStream = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'bottomInset',
})<{ bottomInset?: number }>`
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	width: 100%;
	margin: 0 auto;
	overflow-y: auto;
	padding: ${spacing.xs};
	padding-bottom: ${({ bottomInset }) =>
		bottomInset ? `${bottomInset}px` : spacing.xs};
	scroll-behavior: smooth;

	${isBiggerThanMediumMedia} {
		width: 80%;
	}
`;

// `jupiter-onboarding-reading` — inner column holding the bubbles. margin-top:
// auto pins the run to the bottom when it's short, while still allowing the
// container to scroll up to the top when it overflows. Tight default gap so
// consecutive same-sender bubbles read as one merged box; a new sender run
// re-introduces space via isGroupStart.
export const ConversationReading = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	width: 100%;
	margin-top: auto;
`;

// `jupiter-onboarding-dock` — glass control panel overlaid on the bottom of the
// stream so messages scroll behind it. Translucent + backdrop blur, matching the
// glassmorphic surfaces used elsewhere (calendar, nav, footers).
export const ConversationDock = styled(Box)`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: ${zIndexSticky};
	padding: ${spacing.xs} ${spacing.xs} ${spacing.small};
	background: ${hexToRgba(palette.background.default, 0.6)};
	backdrop-filter: blur(12px) saturate(140%);
	-webkit-backdrop-filter: blur(12px) saturate(140%);
	border-top: 1px solid ${hexToRgba(palette.white, 0.5)};
	box-shadow: ${shadowGlassShimmer};
`;

// `jupiter-onboarding-dock-inner` — centered, width-capped control column.
export const ConversationDockInner = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${spacing.small};
	width: 100%;
	max-width: 560px;
	margin: 0 auto;
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


// isGroupStart = first bubble of a run AND not the very first message; restores
// the larger separation between distinct sender groups.
const groupStartSpacing = css`
	margin-top: ${spacing.xs};
`;

// Two columns: the avatar, then a stack (bubble row over note row). Mirrors the
// preview's group → avatar + stack. align-items: flex-end bottom-anchors the
// avatar to the stack, as in the preview.
export const BotMessageGroup = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isGroupStart',
})<{ isGroupStart?: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	gap: ${spacing.xs};
	align-self: flex-start;
	max-width: 80%;

	${isMobileMedia} {
		max-width: 90%;
	}

	${({ isGroupStart }) => isGroupStart && groupStartSpacing}
`;

// Second column: the chat bubble on top and the (optional) status note below it,
// both aligned to the bubble's left edge — not under the avatar.
export const BotStack = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const UserMessageGroup = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isGroupStart',
})<{ isGroupStart?: boolean }>`
	${messageGroupBase}
	align-self: flex-end;
	gap: ${spacing.xxs};

	${({ isGroupStart }) => isGroupStart && groupStartSpacing}
`;

// Bot bubbles are anchored to the left edge. Matching the preview: the avatar
// (not a sharp bubble corner) marks the speaker, so the first bubble keeps a
// rounded top-left (small); inner/anchor corners stay tight (xxs) so a run reads
// as one box.
export const BotBubble = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isFirst' && prop !== 'isLast',
})<{ isFirst: boolean; isLast: boolean }>`
	${bubbleBase}

	background: ${jupiterBackgroundMain};
	color: inherit;
	text-align: left;
	// Preserve newlines (e.g. the multi-line "welcome back" recap) while still
	// wrapping long lines.
	white-space: pre-line;

	border-top-left-radius: ${({ isFirst }) =>
		isFirst ? spacing.small : spacing.xxs};
	border-bottom-left-radius: ${spacing.xxs};
	border-top-right-radius: ${spacing.small};
	border-bottom-right-radius: ${spacing.small};
`;

// User bubbles mirror the bot: anchored to the right edge, with the xxs
// bottom-right tail on the last bubble of the group.
export const UserBubble = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isFirst' && prop !== 'isLast',
})<{ isFirst: boolean; isLast: boolean }>`
	${bubbleBase}

	background-color: ${palette.brand.light};
	align-self: flex-end;
	text-align: right;

	border-top-right-radius: ${spacing.small};
	border-bottom-right-radius: ${spacing.xxs};
	border-top-left-radius: ${({ isFirst }) =>
		isFirst ? spacing.small : spacing.xxs};
	border-bottom-left-radius: ${({ isLast }) =>
		isLast ? spacing.small : spacing.xxs};
`;

// Mirrors the preview's avatar atom: a 30px white disc with the floating Jupiter
// mark and an idle blink. `isVisible={false}` keeps the disc's footprint as a
// spacer so stacked continuation bubbles stay aligned under the first.
export const Avatar = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible?: boolean }>`
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background: ${palette.white};
	box-shadow: ${shadowSmall};
	color: ${palette.brand.purple};
	visibility: ${({ isVisible }) => (isVisible === false ? 'hidden' : 'visible')};
	animation: jupiterFloat 4.5s ease-in-out infinite;

	& svg {
		width: 24px;
		height: 24px;
	}

	@keyframes jupiterFloat {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3.5px);
		}
	}

	// Idle eye blink — the two eye paths blink twice per cycle, then rest.
	& svg path:nth-of-type(2),
	& svg path:nth-of-type(3) {
		transform-box: fill-box;
		transform-origin: center;
		animation: jupiterBlink 5.2s ease-in-out infinite;
	}

	@keyframes jupiterBlink {
		0%,
		6%,
		12%,
		18%,
		100% {
			transform: scaleY(1);
		}
		3%,
		15% {
			transform: scaleY(0.1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		animation: none;

		& svg path:nth-of-type(2),
		& svg path:nth-of-type(3) {
			animation: none;
		}
	}
`;

export const ChipsInline = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	flex-direction: column;
`;

export {
	OtherBackButton as BackButton,
	OtherInputRow as InputRow,
	OtherSendButton as SendButton,
} from '@psycron/components/chat/chips/ChatChips.styles';

export const ThinkingBubble = styled(Box)`
	${bubbleBase}

	background: ${jupiterBackgroundMain};
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

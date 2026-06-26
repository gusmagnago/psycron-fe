import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowInnerPress,
	shadowMedium,
	shadowMediumPurple,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export type ChipAtomVariant =
	| 'danger'
	| 'default'
	| 'google'
	| 'primary'
	| 'selected'
	| 'success';

// ─── Page layout ────────────────────────────────────────────────────────────

export const PreviewPage = styled(Box)`
	min-height: 100%;
	width: 100%;
	overflow-y: auto;
	background: ${palette.background.default};
	padding: ${spacing.medium};
`;

export const PreviewTitle = styled('h1')`
	margin: 0 0 ${spacing.xxs};
	font-size: 22px;
	font-weight: 800;
	color: ${palette.text.primary};
`;

export const PreviewSubtitle = styled('p')`
	margin: 0 0 ${spacing.medium};
	max-width: 720px;
	font-size: 13px;
	line-height: 1.5;
	color: ${palette.text.secondary};
`;

export const PreviewSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	max-width: 760px;
	margin-bottom: ${spacing.large};
`;

export const SectionTitle = styled('h2')`
	margin: 0;
	padding-bottom: ${spacing.xxs};
	border-bottom: 1px solid ${hexToRgba(palette.brand.purple, 0.15)};
	color: ${palette.text.primary};
	font-size: 15px;
	font-weight: 700;
`;

export const AtomList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	max-width: 760px;
`;

export const AtomRow = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small};
	border-radius: ${spacing.extraSmall};
	background: ${palette.white};
	box-shadow: ${shadowSmall};
`;

export const AtomLabel = styled('code')`
	align-self: flex-start;
	padding: 2px 6px;
	border-radius: ${spacing.xxs};
	background: ${palette.background.default};
	color: ${palette.brand.purple};
	font-family: ui-monospace, Menlo, monospace;
	font-size: 11px;
`;

export const AtomStage = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${spacing.xs};
	padding: ${spacing.small};
	border-radius: ${spacing.xs};
	background: ${palette.background.default};
`;

// ─── Identity atoms ───────────────────────────────────────────────────────────

export const AvatarAtom = styled(Box)`
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

	@media (prefers-reduced-motion: reduce) {
		animation: none;
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
		& svg path:nth-of-type(2),
		& svg path:nth-of-type(3) {
			animation: none;
		}
	}
`;

export const SenderLabel = styled('span')`
	font-size: 11px;
	font-weight: 700;
	color: ${palette.text.secondary};
`;

// ─── Chip atom ────────────────────────────────────────────────────────────────

const chipVariantStyles: Record<ChipAtomVariant, ReturnType<typeof css>> = {
	danger: css`
		color: ${palette.error.main};
		background: ${hexToRgba(palette.error.main, 0.06)};
	`,
	default: css``,
	google: css`
		color: ${palette.brand.google};
		background: ${hexToRgba(palette.brand.google, 0.1)};
	`,
	primary: css`
		color: ${palette.brand.purple};
		background: ${palette.brand.light};
		box-shadow: ${shadowMediumPurple};
	`,
	selected: css`
		color: ${palette.brand.purple};
		background: ${hexToRgba(palette.brand.purple, 0.06)};
		box-shadow: ${shadowMediumPurple};
	`,
	success: css`
		color: ${palette.success.main};
		background: ${hexToRgba(palette.success.main, 0.1)};
	`,
};

export const ChipAtom = styled('button', {
	shouldForwardProp: (prop) => prop !== 'chipVariant' && prop !== 'checked',
})<{ checked?: boolean; chipVariant?: ChipAtomVariant }>`
	display: inline-flex;
	align-items: center;
	gap: 7px;
	height: 38px;
	padding: 0 ${spacing.small};
	border: none;
	border-radius: 40px;
	background: ${palette.background.paper};
	box-shadow: ${shadowMedium};
	color: ${palette.text.primary};
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	transition: box-shadow 0.18s ease, transform 0.12s ease, background 0.18s ease;

	& svg {
		width: 15px;
		height: 15px;
	}

	// Same neumorphic hover/press as the @psycron Button: raised (shadowMedium)
	// settling to shadowSmall on hover, with a subtle press scale.
	&:hover {
		box-shadow: ${shadowSmall};
		background: ${palette.white};
	}

	&:active {
		transform: scale(0.97);
	}

	${({ chipVariant }) => chipVariant && chipVariantStyles[chipVariant]}

	// Checkbox-style toggle with button visual: checked = solid brand purple.
	${({ checked }) =>
		checked &&
		css`
			background: ${palette.brand.purple};
			color: ${palette.white};
			box-shadow: ${shadowMediumPurple};

			&:hover {
				background: ${palette.brand.dark};
			}
		`}
`;

// ─── Composer atoms ───────────────────────────────────────────────────────────

export const ComposerAtom = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	width: 100%;
	padding: 6px 6px 6px ${spacing.mediumSmall};
	border-radius: ${spacing.medium};
	background: ${palette.background.paper};
	box-shadow: ${shadowInnerPress};
`;

export const ComposerInput = styled('input')`
	flex: 1;
	border: none;
	background: transparent;
	outline: none;
	padding: ${spacing.xs} 0;
	color: ${palette.text.primary};
	font-size: 14px;

	&::placeholder {
		color: ${palette.gray['05']};
	}
`;

export const SendButtonAtom = styled('button', {
	shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border: none;
	border-radius: 50%;
	background: ${palette.gray['04']};
	color: ${palette.white};
	cursor: pointer;
	transition: background 0.2s ease, box-shadow 0.2s ease;

	& svg {
		width: 18px;
		height: 18px;
		// Empty: plane points up (middle-top). Typing rotates it to point right.
		transform: rotate(-90deg);
		transition: transform 0.25s ease;
	}

	${({ active }) =>
		active &&
		css`
			background: ${palette.brand.purple};
			box-shadow: ${shadowMediumPurple};

			& svg {
				transform: rotate(0deg);
			}
		`}
`;

// ─── List-item atoms ──────────────────────────────────────────────────────────

export const PermissionItemAtom = styled(Box)`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.xs};
	color: ${palette.text.primary};
	font-size: 13px;

	& svg {
		flex-shrink: 0;
		width: 15px;
		height: 15px;
		margin-top: 2px;
		color: ${palette.brand.purple};
	}
`;

export const CalendarOptionAtom = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	width: 100%;
	max-width: 360px;
	padding: 10px ${spacing.extraSmall};
	border-radius: ${spacing.extraSmall};
	background: ${palette.background.paper};
	box-shadow: ${shadowInnerPress};
	font-size: 13px;
	text-align: left;
	cursor: pointer;

	${({ selected }) =>
		selected &&
		css`
			background: ${hexToRgba(palette.brand.purple, 0.06)};
			box-shadow: ${shadowMediumPurple};
		`}
`;

export const Dot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'dotColor' && prop !== 'dotSize',
})<{ dotColor: string; dotSize?: number }>`
	flex-shrink: 0;
	width: ${({ dotSize }) => dotSize ?? 12}px;
	height: ${({ dotSize }) => dotSize ?? 12}px;
	border-radius: 50%;
	background: ${({ dotColor }) => dotColor};
`;

export const CalendarBadge = styled('span')`
	margin-left: auto;
	padding: 2px 7px;
	border-radius: 6px;
	background: ${palette.brand.light};
	color: ${palette.brand.purple};
	font-size: 10px;
	font-weight: 700;
`;

export const PreviewRowAtom = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	font-size: 13px;
`;

export const PreviewRowLabel = styled('span')`
	min-width: 96px;
	color: ${palette.text.secondary};
`;

export const PreviewRowValue = styled('span')`
	color: ${palette.text.primary};
	font-weight: 600;
`;

// ─── Status / state atoms ───────────────────────────────────────────────────

export const StatusPillAtom = styled('span')`
	display: inline-flex;
	align-items: center;
	min-height: 26px;
	padding: 3px 9px;
	border-radius: 999px;
	background: ${palette.brand.light};
	color: ${palette.brand.purple};
	font-size: 11px;
	font-weight: 800;
	white-space: nowrap;
	box-shadow: ${shadowSmall};
`;

// Matches the prototype `.pub` exactly: purple pill with shadow-purple; gray
// when blocked/disabled; purple at 0.82 opacity while publishing; success green
// with no shadow once published.
export const PreviewPublishButton = styled('button')`
	height: 42px;
	padding: 0 ${spacing.mediumSmall};
	border: none;
	border-radius: 40px;
	background: ${palette.brand.purple};
	color: ${palette.white};
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	box-shadow: ${shadowMediumPurple};
	transition: background 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;

	&:disabled {
		background: ${palette.gray['04']};
		box-shadow: ${shadowSmall};
		cursor: not-allowed;
	}

	&[data-publish-state='publishing']:disabled {
		background: ${palette.brand.purple};
		box-shadow: ${shadowMediumPurple};
		opacity: 0.82;
	}

	&[data-publish-state='success']:disabled {
		background: ${palette.success.main};
		box-shadow: none;
		color: ${palette.white};
		cursor: default;
		opacity: 1;
	}
`;

// Matches the prototype `.rst`: transparent pill with tertiary text.
export const PreviewResetButton = styled('button')`
	height: 42px;
	padding: 0 ${spacing.mediumSmall};
	border: none;
	border-radius: 40px;
	background: transparent;
	color: ${palette.tertiary.main};
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
`;

export const DoneAtom = styled(Box)`
	padding: ${spacing.xs};
	color: ${palette.success.main};
	font-size: 14px;
	font-weight: 700;
	text-align: center;
`;

// ─── Container atoms ──────────────────────────────────────────────────────────

export const BoxShellAtom = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	width: 100%;
	max-width: 360px;
	padding: ${spacing.small};
	border-radius: 18px;
	background: ${palette.white};
	box-shadow: ${shadowSmall};
`;

export const DockAtom = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	max-width: 420px;
	padding: ${spacing.xs} ${spacing.xs} ${spacing.small};
	background: linear-gradient(
		to top,
		${palette.background.default} 78%,
		${hexToRgba(palette.background.default, 0)}
	);
`;

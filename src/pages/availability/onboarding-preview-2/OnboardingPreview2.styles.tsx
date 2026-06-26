import { css } from '@emotion/react';
import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMedium,
	shadowMediumPurple,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { InventoryTone } from './OnboardingPreview2.constants';

const toneStyles: Record<InventoryTone, { bg: string; border: string; color: string }> =
	{
		blue: {
			bg: hexToRgba(palette.brand.google, 0.08),
			border: hexToRgba(palette.brand.google, 0.22),
			color: palette.brand.google,
		},
		green: {
			bg: palette.success.surface.light,
			border: hexToRgba(palette.success.main, 0.24),
			color: palette.success.dark,
		},
		neutral: {
			bg: palette.gray['01'],
			border: palette.gray['02'],
			color: palette.gray['09'],
		},
		purple: {
			bg: palette.tertiary.surface.light,
			border: hexToRgba(palette.brand.purple, 0.22),
			color: palette.brand.purple,
		},
		red: {
			bg: palette.error.surface.light,
			border: hexToRgba(palette.error.main, 0.22),
			color: palette.error.dark,
		},
		yellow: {
			bg: palette.warning.surface.light,
			border: hexToRgba(palette.warning.main, 0.42),
			color: palette.warning.dark,
		},
	};

const focusRing = css`
	&:focus-visible {
		outline: 3px solid ${hexToRgba(palette.brand.purple, 0.35)};
		outline-offset: 3px;
	}
`;

export const PreviewPageRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.large};
	width: 100%;
	max-width: 1280px;
	margin: 0 auto;
	padding-bottom: ${spacing.large};
`;

export const HeroBand = styled(Box)`
	display: grid;
	grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.8fr);
	gap: ${spacing.medium};
	align-items: stretch;

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr;
	}
`;

export const HeroCopy = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const Eyebrow = styled(Text)`
	font-size: 12px;
	font-weight: 800;
	line-height: 1.4;
	letter-spacing: 0;
	color: ${palette.brand.purple};
	text-transform: uppercase;
`;

export const PageTitle = styled(Text)`
	max-width: 760px;
	font-size: 34px;
	font-weight: 800;
	line-height: 1.12;
	letter-spacing: 0;
	color: ${palette.text.primary};

	${isMobileMedia} {
		font-size: 28px;
	}
`;

export const LeadText = styled(Text)`
	max-width: 760px;
	font-size: 16px;
	line-height: 1.65;
	color: ${palette.text.secondary};
`;

export const SourcePanel = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: ${spacing.medium};
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.16)};
	border-radius: ${spacing.xs};
	padding: ${spacing.medium};
	background:
		linear-gradient(
			135deg,
			${hexToRgba(palette.white, 0.88)},
			${hexToRgba(palette.tertiary.light, 0.5)}
		),
		${palette.background.paper};
	box-shadow: ${shadowSmall};
`;

export const SourceLabel = styled(Text)`
	font-size: 12px;
	font-weight: 800;
	line-height: 1.4;
	color: ${palette.gray['08']};
`;

export const SourcePath = styled(Text)`
	overflow-wrap: anywhere;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 12px;
	line-height: 1.6;
	color: ${palette.text.primary};
`;

export const SourceLink = styled('a')`
	align-self: flex-start;
	display: inline-flex;
	align-items: center;
	min-height: 40px;
	border-radius: 999px;
	padding: 0 ${spacing.mediumSmall};
	color: ${palette.brand.purple};
	background: ${palette.white};
	box-shadow: ${shadowMediumPurple};
	font-size: 13px;
	font-weight: 800;
	text-decoration: none;

	${focusRing}

	&:hover {
		color: ${palette.white};
		background: ${palette.brand.dark};
	}
`;

export const StatsGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: ${spacing.small};

	${isSmallerThanTabletMedia} {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const StatCard = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	border-radius: ${spacing.xs};
	padding: ${spacing.small};
	background: ${palette.white};
	box-shadow: ${shadowSmall};
`;

export const StatValue = styled(Text)`
	font-size: 28px;
	font-weight: 800;
	line-height: 1;
	color: ${palette.brand.purple};
`;

export const StatLabel = styled(Text)`
	font-size: 13px;
	line-height: 1.45;
	color: ${palette.text.secondary};
`;

export const Section = styled('section')`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const SectionHeader = styled(Box)`
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: ${spacing.medium};

	${isMobileMedia} {
		align-items: flex-start;
		flex-direction: column;
	}
`;

export const SectionTitleGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const SectionTitle = styled(Text)`
	font-size: 22px;
	font-weight: 800;
	line-height: 1.2;
	color: ${palette.text.primary};
`;

export const SectionDescription = styled(Text)`
	max-width: 760px;
	font-size: 14px;
	line-height: 1.65;
	color: ${palette.text.secondary};
`;

export const LevelBadge = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: InventoryTone }>`
	display: inline-flex;
	align-items: center;
	min-height: 32px;
	border: 1px solid ${({ tone }) => toneStyles[tone].border};
	border-radius: 999px;
	padding: 0 ${spacing.small};
	color: ${({ tone }) => toneStyles[tone].color};
	background: ${({ tone }) => toneStyles[tone].bg};
	font-size: 12px;
	font-weight: 800;
	line-height: 1;
	white-space: nowrap;
`;

export const ComponentGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: ${spacing.small};

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr;
	}
`;

export const ComponentCard = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: InventoryTone }>`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	min-width: 0;
	border: 1px solid ${({ tone }) => toneStyles[tone].border};
	border-radius: ${spacing.xs};
	padding: ${spacing.mediumSmall};
	background: ${palette.white};
	box-shadow: ${shadowSmall};
`;

export const ComponentTopline = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const ComponentName = styled(Text)`
	font-size: 17px;
	font-weight: 800;
	line-height: 1.3;
	color: ${palette.text.primary};
`;

export const ComponentSource = styled(Text)`
	overflow-wrap: anywhere;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 11px;
	line-height: 1.55;
	color: ${palette.gray['08']};
`;

export const ComponentDescription = styled(Text)`
	font-size: 14px;
	line-height: 1.6;
	color: ${palette.text.secondary};
`;

export const SpecList = styled('ul')`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	margin: 0;
	padding: 0;
	list-style: none;
`;

export const SpecItem = styled('li')`
	display: flex;
	gap: ${spacing.xs};
	align-items: flex-start;
	font-size: 13px;
	line-height: 1.55;
	color: ${palette.text.primary};

	&::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
		margin-top: 8px;
		background: ${palette.brand.purple};
	}
`;

export const TagWrap = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const TagPill = styled('code')`
	display: inline-flex;
	align-items: center;
	min-height: 26px;
	max-width: 100%;
	border-radius: ${spacing.xs};
	padding: 2px ${spacing.xs};
	overflow-wrap: anywhere;
	color: ${palette.brand.dark};
	background: ${palette.tertiary.surface.light};
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 11px;
	line-height: 1.45;
`;

export const ExistingText = styled(Text)`
	overflow-wrap: anywhere;
	font-size: 12px;
	line-height: 1.55;
	color: ${palette.text.secondary};
`;

export const MapGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: ${spacing.small};

	${isSmallerThanTabletMedia} {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const MapCard = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	min-width: 0;
	border-radius: ${spacing.xs};
	padding: ${spacing.small};
	background: ${palette.white};
	box-shadow: ${shadowSmall};
`;

export const MapName = styled(Text)`
	font-size: 14px;
	font-weight: 800;
	line-height: 1.35;
	color: ${palette.text.primary};
`;

export const MapRoute = styled(Text)`
	overflow-wrap: anywhere;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 11px;
	line-height: 1.55;
	color: ${palette.gray['08']};
`;

export const MapUse = styled(Text)`
	font-size: 13px;
	line-height: 1.55;
	color: ${palette.text.secondary};
`;

export const FlowGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: ${spacing.small};

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr;
	}
`;

export const FlowCard = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	border-radius: ${spacing.xs};
	padding: ${spacing.mediumSmall};
	background: ${palette.white};
	box-shadow: ${shadowSmall};
`;

export const FlowName = styled(Text)`
	font-size: 16px;
	font-weight: 800;
	line-height: 1.35;
	color: ${palette.text.primary};
`;

export const FlowPath = styled(Text)`
	font-size: 13px;
	line-height: 1.6;
	color: ${palette.text.secondary};
`;

export const ReferencePanel = styled(Box)`
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(280px, 0.75fr);
	gap: ${spacing.medium};
	align-items: stretch;
	border-radius: ${spacing.xs};
	padding: ${spacing.medium};
	background: ${palette.background.paper};
	box-shadow: ${shadowSmall};

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr;
	}
`;

export const ConversationPreview = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	min-width: 0;
`;

export const MiniMessage = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser?: boolean }>`
	display: flex;
	flex-direction: ${({ isUser }) => (isUser ? 'row-reverse' : 'row')};
	gap: ${spacing.xs};
	align-items: flex-start;
`;

export const MiniAvatar = styled(Box)`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	color: ${palette.brand.purple};
	background: ${palette.white};
	box-shadow: ${shadowSmall};

	& svg {
		width: 22px;
		height: 22px;
	}
`;

export const MiniStack = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser?: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
	gap: 3px;
	min-width: 0;
	flex: 1;
`;

export const MiniBubble = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isUser' && prop !== 'isJoined',
})<{ isJoined?: boolean; isUser?: boolean }>`
	width: fit-content;
	max-width: 80%;
	border-radius: ${spacing.small};
	padding: 10px ${spacing.small};
	font-size: 13px;
	line-height: 1.5;
	color: ${palette.text.primary};
	background: ${({ isUser }) =>
		isUser
			? palette.tertiary.light
			: `linear-gradient(135deg, ${hexToRgba(
					palette.secondary.main,
					0.18
				)} 0%, ${hexToRgba(palette.primary.main, 0.38)} 100%)`};
	box-shadow: ${shadowSmall};

	${({ isUser, isJoined }) =>
		!isUser &&
		css`
			border-top-left-radius: ${isJoined ? 0 : spacing.xxs};
		`}

	${({ isUser, isJoined }) =>
		isUser &&
		css`
			border-bottom-right-radius: ${isJoined ? 0 : spacing.xxs};
		`}

	${isMobileMedia} {
		max-width: 100%;
	}
`;

export const MiniStatus = styled(Box)`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.xs};
	max-width: 520px;
	color: ${palette.brand.purple};
	font-size: 10px;
	line-height: 1.45;

	& svg {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
		margin-top: 2px;
	}
`;

export const MiniDock = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	padding-top: ${spacing.xs};
`;

export const MiniChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: InventoryTone }>`
	display: inline-flex;
	align-items: center;
	gap: ${spacing.xs};
	min-height: 38px;
	border-radius: 999px;
	padding: 0 ${spacing.small};
	color: ${({ tone }) => toneStyles[tone].color};
	background: ${({ tone }) => toneStyles[tone].bg};
	box-shadow: ${({ tone }) =>
		tone === 'purple' ? shadowMediumPurple : shadowMedium};
	font-size: 13px;
	font-weight: 800;

	& svg {
		width: 15px;
		height: 15px;
	}
`;

export const PreviewCardSample = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	border-radius: ${spacing.xs};
	padding: ${spacing.mediumSmall};
	background: ${palette.white};
	box-shadow: ${shadowSmall};
`;

export const PreviewSampleHeader = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const PreviewSampleTitle = styled(Text)`
	font-size: 15px;
	font-weight: 800;
	line-height: 1.3;
	color: ${palette.text.primary};
`;

export const PreviewStatusPill = styled(Box)`
	display: inline-flex;
	align-items: center;
	min-height: 26px;
	border-radius: 999px;
	padding: 2px ${spacing.xs};
	color: ${palette.brand.purple};
	background: ${palette.tertiary.light};
	box-shadow: ${shadowSmall};
	font-size: 11px;
	font-weight: 800;
	white-space: nowrap;
`;

export const PreviewSampleRows = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const PreviewSampleRow = styled(Box)`
	display: grid;
	grid-template-columns: auto minmax(72px, 0.4fr) minmax(0, 1fr);
	gap: ${spacing.xs};
	align-items: center;
	font-size: 13px;
	line-height: 1.4;
`;

export const RowDot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: InventoryTone }>`
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: ${({ tone }) => toneStyles[tone].color};
`;

export const RowLabel = styled(Text)`
	font-size: 12px;
	color: ${palette.gray['08']};
`;

export const RowValue = styled(Text)`
	min-width: 0;
	overflow-wrap: anywhere;
	font-size: 13px;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const PublishSampleButton = styled(Box)`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 40px;
	border-radius: 999px;
	padding: 0 ${spacing.mediumSmall};
	color: ${palette.white};
	background: ${palette.brand.purple};
	box-shadow: ${shadowMediumPurple};
	font-size: 13px;
	font-weight: 800;
`;

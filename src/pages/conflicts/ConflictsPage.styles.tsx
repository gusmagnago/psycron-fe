import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ConflictsLayout = styled(Box)`
	align-items: start;
	display: grid;
	grid-template-columns: minmax(20rem, 24rem) minmax(0, 1fr);
	gap: ${spacing.medium};
	padding-top: ${spacing.large};
	margin-bottom: calc(${spacing.large} * 2);

	${isMobileMedia} {
		gap: ${spacing.small};
		grid-template-columns: 1fr;
		margin-bottom: calc(${spacing.largeXl} * 3);
		padding-top: ${spacing.medium};
	}
`;

export const ConflictsSidebar = styled(Box)`
	background: linear-gradient(
		180deg,
		${hexToRgba(palette.background.paper, 0.98)} 0%,
		${hexToRgba(palette.background.paper, 0.92)} 100%
	);
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.12)};
	border-radius: ${spacing.large};
	box-shadow: ${shadowMedium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding: ${spacing.medium};
	position: sticky;
	top: ${spacing.medium};

	${isMobileMedia} {
		gap: ${spacing.small};
		padding: ${spacing.small};
		position: static;
		top: auto;
	}
`;

export const SidebarHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const SidebarEyebrow = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
`;

export const SidebarTitleRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	justify-content: space-between;
`;

export const SidebarTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 1.1rem;
	font-weight: 700;

	${isMobileMedia} {
		font-size: 1rem;
	}
`;

export const SidebarCount = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.secondary.main, 0.14)};
	border: 1px solid ${hexToRgba(palette.secondary.main, 0.24)};
	border-radius: 999px;
	color: ${palette.secondary.main};
	display: inline-flex;
	font-size: 0.8rem;
	font-weight: 700;
	height: 1.8rem;
	justify-content: center;
	min-width: 1.8rem;
	padding: 0 ${spacing.xs};
`;

export const SidebarSubtitle = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.9rem;
	line-height: 1.55;

	${isMobileMedia} {
		font-size: 0.85rem;
	}
`;

export const FiltersSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const FiltersLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.06em;
	text-transform: uppercase;
`;

export const FiltersRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};

	${isMobileMedia} {
		gap: ${spacing.xxs};
	}
`;

export const FilterChip = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	align-items: center;
	background: ${({ isActive }) =>
		isActive
			? `linear-gradient(135deg, ${hexToRgba(
					palette.secondary.main,
					0.16
				)} 0%, ${hexToRgba(palette.secondary.main, 0.24)} 100%)`
			: palette.background.default};
	border: 1px solid
		${({ isActive }) =>
			isActive
				? hexToRgba(palette.secondary.main, 0.32)
				: hexToRgba(palette.gray['04'], 0.18)};
	border-radius: 999px;
	box-shadow: ${({ isActive }) => (isActive ? shadowMedium : 'none')};
	color: ${({ isActive }) =>
		isActive ? palette.text.primary : palette.gray['06']};
	cursor: pointer;
	display: inline-flex;
	font-size: 0.9rem;
	font-weight: 600;
	height: 2.5rem;
	padding: 0 ${spacing.small};
	transition:
		border-color 160ms ease,
		box-shadow 160ms ease,
		transform 160ms ease;
	white-space: nowrap;

	&:hover {
		border-color: ${hexToRgba(palette.secondary.main, 0.28)};
		transform: translateY(-1px);
	}

	${isMobileMedia} {
		font-size: 0.82rem;
		height: 2.25rem;
		padding: 0 ${spacing.xs};
	}
`;

export const ConflictList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding-right: ${spacing.xxs};

	${isMobileMedia} {
		padding-right: 0;
	}
`;

export const ConflictCard = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	background: ${({ isSelected }) =>
		isSelected
			? `linear-gradient(180deg, ${hexToRgba(
					palette.secondary.main,
					0.14
				)} 0%, ${hexToRgba(palette.secondary.main, 0.04)} 100%)`
			: palette.background.paper};
	border: 1px solid
		${({ isSelected }) =>
			isSelected
				? hexToRgba(palette.secondary.main, 0.32)
				: hexToRgba(palette.gray['04'], 0.12)};
	border-radius: ${spacing.large};
	box-shadow: ${({ isSelected }) => (isSelected ? shadowMedium : shadowSmall)};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small};
	text-align: left;
	transition:
		border-color 180ms ease,
		box-shadow 180ms ease,
		transform 180ms ease;

	&:hover {
		border-color: ${hexToRgba(palette.secondary.main, 0.22)};
		transform: translateY(-1px);
	}

	${isMobileMedia} {
		border-radius: ${spacing.medium};
		padding: ${spacing.small};
	}
`;

export const ConflictCardMetaRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	justify-content: space-between;

	${isMobileMedia} {
		align-items: flex-start;
		flex-direction: column;
	}
`;

export const ConflictStatusPill = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.info.main, 0.1)};
	border: 1px solid ${hexToRgba(palette.info.main, 0.16)};
	border-radius: 999px;
	color: ${palette.info.main};
	display: inline-flex;
	font-size: 0.72rem;
	font-weight: 700;
	padding: 0.15rem ${spacing.xs};
	text-transform: uppercase;

	${isMobileMedia} {
		font-size: 0.68rem;
	}
`;

export const ConflictCardDate = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.8rem;
`;

export const ConflictTypeLabel = styled(Text)`
	color: ${palette.secondary.main};
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
`;

export const ConflictTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.98rem;
	font-weight: 700;

	${isMobileMedia} {
		font-size: 0.95rem;
	}
`;

export const ConflictDescription = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	line-height: 1.55;

	${isMobileMedia} {
		font-size: 0.84rem;
	}
`;

export const ConflictDetailPanel = styled(Box)`
	background: linear-gradient(
		180deg,
		${hexToRgba(palette.background.paper, 0.98)} 0%,
		${hexToRgba(palette.background.paper, 0.94)} 100%
	);
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.12)};
	border-radius: ${spacing.large};
	box-shadow: ${shadowMedium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	min-height: 32rem;
	padding: ${spacing.large};

	${isMobileMedia} {
		gap: ${spacing.small};
		min-height: auto;
		padding: ${spacing.small};
	}
`;

export const ConflictDetailHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const ConflictDetailMetaRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};

	${isMobileMedia} {
		align-items: flex-start;
		flex-direction: column;
	}
`;

export const ConflictMetaGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: ${spacing.small};

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const ConflictMetaGroup = styled(Box)`
	background: ${hexToRgba(palette.background.default, 0.72)};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.1)};
	border-radius: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.small};
`;

export const ConflictMetaLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.8rem;
	font-weight: 600;
	text-transform: uppercase;
`;

export const ConflictMetaValue = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.95rem;

	${isMobileMedia} {
		font-size: 0.9rem;
	}
`;

export const ConflictActions = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	margin-top: auto;
	padding-top: ${spacing.small};

	${isMobileMedia} {
		flex-direction: column;
	}

	& > button {
		width: 100%;
	}
`;

export const EmptyState = styled(Box)`
	align-items: center;
	background: linear-gradient(
		180deg,
		${hexToRgba(palette.background.paper, 0.94)} 0%,
		${hexToRgba(palette.background.default, 0.9)} 100%
	);
	border: 1px dashed ${hexToRgba(palette.gray['04'], 0.25)};
	border-radius: ${spacing.large};
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xs};
	justify-content: center;
	padding: ${spacing.large};
	text-align: center;

	${isMobileMedia} {
		min-height: 16rem;
		padding: ${spacing.medium};
	}
`;

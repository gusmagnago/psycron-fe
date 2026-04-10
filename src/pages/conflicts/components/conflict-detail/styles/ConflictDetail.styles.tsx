import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isMobileMedia,
	isTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

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

	${isTabletMedia} {
		margin-bottom: calc(${spacing.large} + ${spacing.medium});
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

export const ConflictMetaSpan = styled(Box)`
	grid-column: 1 / -1;
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

export const ComparisonGrid = styled(Box)`
	align-items: start;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};

	& > * {
		flex: 1 1 20rem;
	}

	${isMobileMedia} {
		flex-direction: column;

		& > * {
			flex: 1 1 auto;
		}
	}
`;

export const DuplicateConflictLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const DuplicateConflictTopGrid = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};

	& > * {
		flex: 1 1 18rem;
		min-width: 0;
	}

	${isMobileMedia} {
		flex-direction: column;

		& > * {
			flex: 1 1 auto;
		}
	}
`;

export const AdditionalCandidatesNote = styled(Box)`
	align-self: start;
	max-width: 32rem;
`;

export const ComparisonCard = styled(Box)`
	background: ${hexToRgba(palette.background.default, 0.72)};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.1)};
	border-radius: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	min-width: 0;
	padding: ${spacing.small};
`;

export const ComparisonCardHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const ComparisonCardTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.98rem;
	font-weight: 700;
`;

export const ComparisonFieldList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const ComparisonField = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const ComparisonFieldLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const ComparisonFieldValue = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.92rem;
	line-height: 1.45;
	overflow-wrap: anywhere;
	word-break: normal;
`;

export const ConflictInlineNote = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	line-height: 1.5;
`;

export const ConflictActions = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	margin-top: auto;
	padding-top: ${spacing.small};
`;

export const ConflictActionSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const ConflictActionHeading = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.92rem;
	font-weight: 700;
`;

export const ConflictActionHint = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	line-height: 1.5;
`;

export const ConflictActionAlternatives = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(2, minmax(0, 1fr));

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}

	& > button {
		width: 100%;
	}
`;

export const ConflictActionFooter = styled(Box)`
	display: flex;
	justify-content: flex-start;

	${isMobileMedia} {
		& > button {
			width: 100%;
		}
	}
`;

export const ConflictDetailSkeleton = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const ConflictDetailSkeletonRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};

	& > * {
		flex: 1 1 12rem;
	}
`;

export const ConflictDetailSkeletonBlock = styled(Skeleton)`
	border-radius: ${spacing.medium};
	transform: none;
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

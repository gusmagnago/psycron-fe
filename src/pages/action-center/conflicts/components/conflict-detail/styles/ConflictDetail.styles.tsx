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
	height: 100%;
	min-height: 0;
	overflow: auto;
	padding: ${spacing.large};

	${isMobileMedia} {
		gap: ${spacing.small};
		height: auto;
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

export const ResolutionPanel = styled(Box)`
	background: var(
		--feature-page-accent-softer,
		${hexToRgba(palette.tertiary.main, 0.08)}
	);
	border: 1px solid
		var(
			--feature-page-accent-border,
			${hexToRgba(palette.tertiary.main, 0.18)}
		);
	border-radius: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	margin-top: auto;
	padding: ${spacing.small};
`;

export const ResolutionTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.96rem;
	font-weight: 800;
`;

export const ResolutionSummaryText = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	line-height: 1.5;
	overflow-wrap: anywhere;
`;

export const ResolutionDetailGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(2, minmax(0, 1fr));
	padding-top: ${spacing.xs};

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const ResolutionField = styled(Box)`
	background: ${hexToRgba(palette.background.paper, 0.72)};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.1)};
	border-radius: ${spacing.small};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.xs};
`;

export const ResolutionFieldLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.74rem;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const ResolutionFieldSource = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.84rem;
	font-weight: 700;
`;

export const MergeReviewPanel = styled(Box)`
	background: ${hexToRgba(palette.background.default, 0.78)};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.14)};
	border-radius: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: ${spacing.small};
`;

export const MergeReviewHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const MergeReviewTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 1rem;
	font-weight: 800;
`;

export const MergeReviewGrid = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: repeat(2, minmax(0, 1fr));

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const MergeReviewField = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const MergeReviewFieldLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const MergeReviewOption = styled.button`
	background: ${hexToRgba(palette.background.paper, 0.86)};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.14)};
	border-radius: ${spacing.small};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.xs};
	text-align: left;
	transition:
		background-color 160ms ease,
		border-color 160ms ease,
		box-shadow 160ms ease;

	&[aria-checked='true'] {
		background: var(
			--feature-page-accent-soft,
			${hexToRgba(palette.tertiary.main, 0.1)}
		);
		border-color: var(
			--feature-page-accent-selected-border,
			${hexToRgba(palette.tertiary.main, 0.42)}
		);
		box-shadow: 0 0 0 2px
			var(
				--feature-page-accent-soft,
				${hexToRgba(palette.tertiary.main, 0.1)}
			);
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}
`;

export const MergeReviewOptionLabel = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.82rem;
	font-weight: 700;
`;

export const MergeReviewOptionValue = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	line-height: 1.45;
	overflow-wrap: anywhere;
`;

export const MergeReviewActions = styled(Box)`
	display: flex;
	gap: ${spacing.xs};
	justify-content: flex-end;

	${isMobileMedia} {
		flex-direction: column-reverse;

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

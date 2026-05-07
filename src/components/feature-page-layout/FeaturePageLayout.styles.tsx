import styled from '@emotion/styled';
import { Box } from '@mui/material';
import {
	QueueDetailLayout,
	QueueDetailSidebar,
} from '@psycron/components/queue-panel';
import {
	isBiggerThanTabletMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import { FEATURE_PAGE_COLORS } from './FeaturePageLayout.colors';
import type { FeaturePageLayoutColors } from './FeaturePageLayout.types';

export const FeaturePageRoot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'colors',
})<{ colors?: FeaturePageLayoutColors }>`
	--feature-page-accent: ${({ colors = FEATURE_PAGE_COLORS.action }) =>
		colors.accent};
	--feature-page-accent-border: ${({ colors = FEATURE_PAGE_COLORS.action }) =>
		colors.accentBorder};
	--feature-page-accent-hover-border: ${({
		colors = FEATURE_PAGE_COLORS.action,
	}) => colors.accentHoverBorder};
	--feature-page-accent-selected-border: ${({
		colors = FEATURE_PAGE_COLORS.action,
	}) => colors.accentSelectedBorder};
	--feature-page-accent-soft: ${({ colors = FEATURE_PAGE_COLORS.action }) =>
		colors.accentSoft};
	--feature-page-accent-softer: ${({ colors = FEATURE_PAGE_COLORS.action }) =>
		colors.accentSofter};
	--feature-page-accent-strong-soft: ${({
		colors = FEATURE_PAGE_COLORS.action,
	}) => colors.accentStrongSoft};
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
`;

export const FeaturePageQueueGrid = styled(QueueDetailLayout)`
	flex: 1;
	min-height: 0;

	${isBiggerThanTabletMedia} {
		padding-bottom: ${spacing.xs};
		padding-right: ${spacing.xs};
	}

	${isSmallerThanTabletMedia} {
		flex: none;
	}
`;

export const FeaturePageQueueSidebar = styled(QueueDetailSidebar)`
	border-top-left-radius: 0;

	${isSmallerThanTabletMedia} {
		overflow: visible;
	}
`;

export const FeaturePageQueueToggleWrapper = styled(Box)`
	display: none;
	justify-content: flex-end;

	${isSmallerThanTabletMedia} {
		display: flex;
	}
`;

export const FeaturePageQueueDetailWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isHidden',
})<{ isHidden?: boolean }>`
	background: ${palette.background.paper};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.1)};
	border-radius: ${spacing.large};
	box-shadow: ${shadowMedium};
	display: flex;
	flex-direction: column;
	min-height: 0;
	min-width: 0;
	overflow: auto;
	padding: ${spacing.large};

	${isSmallerThanTabletMedia} {
		display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
		flex: none;
		height: auto;
		overflow: visible;
		padding: ${spacing.medium};
	}
`;

export const FeaturePageQueueContent = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isExpanded',
})<{ isExpanded?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	min-height: 0;

	${isSmallerThanTabletMedia} {
		display: ${({ isExpanded }) => (isExpanded ? 'flex' : 'none')};
		flex: none;
		height: auto;
		min-height: unset;
		overflow: visible;
	}
`;

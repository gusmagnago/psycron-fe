import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowInnerPress,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ScheduleRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	gap: ${spacing.xs};
`;

export const SkeletonList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const SlotSkeleton = styled(Skeleton)`
	border-radius: ${spacing.extraSmall};
`;

export const ScheduleScrollBox = styled(Box)`
	overflow-y: auto;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2px;

	scrollbar-width: thin;
	scrollbar-color: ${palette.gray['02']} transparent;
`;

export const EmptyState = styled(Box)`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.5;
	font-size: 0.875rem;
	text-align: center;
	padding: ${spacing.large} ${spacing.small};
	color: ${palette.text.secondary};
`;

export const WidgetHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: ${spacing.xs};
	flex-shrink: 0;
	position: sticky;
	top: 0;
	z-index: 1;
	background: ${palette.background.default};
`;

export const WidgetTitle = styled.h2`
	margin: 0;
	font-size: 0.9375rem;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const CountBadge = styled.div`
	font-size: 0.8125rem;
	color: ${palette.text.secondary};
`;

export const CountHighlight = styled.span`
	font-size: 1.75rem;
	font-weight: 800;
	color: ${palette.text.primary};
	line-height: 1;
`;

export const ScheduleSwitcher = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.space};
	background: ${palette.gray['01']};
	border-radius: ${spacing.small};
	padding: ${spacing.space};
	box-shadow: ${shadowInnerPress};
	min-width: 0;
	flex-shrink: 1;
`;

export const SwitcherOption = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	all: unset;
	position: relative;
	display: flex;
	align-items: center;
	gap: ${spacing.space};
	padding: ${spacing.space} ${spacing.xs};
	border-radius: ${spacing.small};
	font-size: 0.75rem;
	font-weight: 600;
	cursor: pointer;
	overflow: hidden;
	white-space: nowrap;
	transition:
		background 0.2s ease,
		color 0.2s ease;

	${isMobileMedia} {
		font-size: 0;
		padding: ${spacing.space};

		svg {
			width: 18px;
			height: 18px;
		}
	}

	background: ${({ isActive }) =>
		isActive ? palette.primary.main : 'transparent'};
	color: ${({ isActive }) =>
		isActive ? palette.text.primary : palette.text.secondary};
	box-shadow: ${({ isActive }) => (isActive ? shadowSmall : 'none')};

	&:hover {
		color: ${palette.text.primary};
	}

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 2px;
	}
`;

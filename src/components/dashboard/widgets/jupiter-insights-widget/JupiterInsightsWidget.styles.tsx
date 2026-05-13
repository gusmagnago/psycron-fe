import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

const pulse = keyframes`
	0%, 100% { opacity: 1; transform: scale(1); }
	50%       { opacity: 0.5; transform: scale(1.5); }
`;

export const CarouselRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	height: 100%;
`;

export const CarouselViewport = styled(Box)`
	flex: 1;
	height: 5rem;
	overflow: hidden;
	position: relative;
`;

export const JupiterHeader = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.xs};

	svg {
		color: ${palette.brand.purple};
	}
`;

export const JupiterBadgeRow = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const JupiterCategory = styled(Text)`
	align-items: center;
	color: ${palette.tertiary.dark};
	display: flex;
	font-size: 0.6875rem;
	font-weight: 700;
	gap: ${spacing.xs};
	letter-spacing: 0.1em;
	text-transform: uppercase;
`;

export const JupiterDot = styled.span`
	animation: ${pulse} 2s ease-in-out infinite;
	background: ${palette.brand.purple};
	border-radius: 50%;
	display: inline-block;
	flex-shrink: 0;
	height: 0.375rem;
	width: 0.375rem;
`;

export const JupiterSubtitle = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.75rem;
`;

export const CarouselFooter = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
`;

export const DotsRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
`;

export const Dot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	background: ${({ isActive }) =>
		isActive ? palette.brand.dark : hexToRgba(palette.tertiary.dark, 0.3)};
	border-radius: 99px;
	cursor: pointer;
	height: 0.375rem;
	transition:
		width 0.25s ease,
		background 0.25s ease;
	width: ${({ isActive }) => (isActive ? '1.25rem' : '0.375rem')};
`;

export const LoadingWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const RoundedSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;

export const EmptyState = styled(Box)`
	font-size: 0.875rem;
	opacity: 0.6;
	padding: ${spacing.medium} 0;
	text-align: center;
`;

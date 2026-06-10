import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { ChevronRight } from '@psycron/components/icons';
import { Text } from '@psycron/components/text/Text';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

type ActionCenterVariant = 'alert' | 'quick';

const getVariantBorder = (variant: ActionCenterVariant): string =>
	variant === 'alert'
		? hexToRgba(palette.text.primary, 0.08)
		: hexToRgba(palette.brand.purple, 0.12);

const getVariantBackground = (variant: ActionCenterVariant): string =>
	variant === 'alert'
		? palette.white
		: hexToRgba(palette.brand.purple, 0.04);

export const ActionCenterRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	height: 100%;
	min-width: 0;
`;

export const ActionCenterHeaderChip = styled(Box)`
	align-items: center;
	background: ${palette.white};
	border-radius: 999px;
	box-shadow: 0 2px 8px rgba(14, 18, 22, 0.08);
	color: ${palette.text.primary};
	display: inline-flex;
	flex-shrink: 0;
	font-size: 0.75rem;
	font-weight: 850;
	justify-content: center;
	min-height: 1.9rem;
	min-width: 4rem;
	padding: 0 ${spacing.small};
	white-space: nowrap;
`;

export const ActionCenterList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	min-width: 0;
	width: 100%;
`;

export const ActionCenterRowButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: ActionCenterVariant }>`
	align-items: center;
	background: ${({ variant }) => getVariantBackground(variant)};
	border: 1px solid ${({ variant }) => getVariantBorder(variant)};
	border-radius: ${spacing.small};
	box-shadow: 0 1px 8px rgba(14, 18, 22, 0.05);
	color: ${palette.text.primary};
	cursor: pointer;
	display: grid;
	font: inherit;
	gap: ${spacing.xs};
	grid-template-columns: auto minmax(0, 1fr) auto auto;
	min-width: 0;
	padding: ${spacing.xs} ${spacing.small};
	text-align: left;
	transition:
		background-color 0.16s ease,
		border-color 0.16s ease,
		box-shadow 0.16s ease,
		transform 0.16s ease;
	width: 100%;

	&:hover {
		background: ${({ variant }) =>
			variant === 'alert'
				? hexToRgba(palette.white, 1)
				: hexToRgba(palette.brand.purple, 0.06)};
		box-shadow: 0 2px 10px rgba(14, 18, 22, 0.08);
		transform: translateY(-1px);
	}

	&:focus-visible {
		outline: 2px solid ${dashboardAccents.info.main};
		outline-offset: 2px;
	}
`;

export const ActionCenterRowText = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const ActionCenterRowTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.875rem;
	font-weight: 800;
	line-height: 1.2;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const ActionCenterRowMeta = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 700;
	line-height: 1.35;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const ActionCenterRowAction = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: ActionCenterVariant }>`
	align-items: center;
	background: ${({ variant }) =>
		variant === 'alert'
			? hexToRgba(palette.text.primary, 0.05)
			: hexToRgba(palette.brand.purple, 0.08)};
	border: 1px solid ${({ variant }) => getVariantBorder(variant)};
	border-radius: 999px;
	color: ${({ variant }) =>
		variant === 'alert' ? palette.text.primary : palette.brand.purple};
	display: inline-flex;
	flex-shrink: 0;
	font-size: 0.72rem;
	font-weight: 850;
	justify-content: center;
	min-height: 1.8rem;
	padding: 0 ${spacing.xs};
	white-space: nowrap;
`;

export const ActionCenterRowChevron = styled(ChevronRight)`
	color: ${palette.text.secondary};
	flex-shrink: 0;
	opacity: 0.5;
`;

export const ActionCenterEmpty = styled(Box)`
	align-items: center;
	background: ${palette.white};
	border-radius: ${spacing.small};
	box-shadow: 0 2px 10px rgba(14, 18, 22, 0.08);
	color: ${palette.text.secondary};
	display: flex;
	flex: 1;
	flex-direction: column;
	font-size: 0.875rem;
	font-weight: 700;
	justify-content: center;
	gap: ${spacing.xxs};
	padding: ${spacing.small};
	text-align: center;
`;

export const ActionCenterEmptyIcon = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.brand.purple, 0.1)};
	border-radius: 999px;
	color: ${palette.brand.purple};
	display: inline-flex;
	height: 2.5rem;
	justify-content: center;
	width: 2.5rem;
`;

export const ActionCenterEmptyTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 1rem;
	font-weight: 850;
`;

export const ActionCenterEmptyBody = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.85rem;
	font-weight: 650;
	line-height: 1.4;
	max-width: 22rem;
`;

export const ActionCenterSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;

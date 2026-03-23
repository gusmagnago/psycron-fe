import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const FiltersPanelContent = styled(Box)`
	width: 300px;
	padding: ${spacing.mediumLarge};
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

export const FiltersPanelHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const FiltersPanelTitle = styled(Text)`
	font-size: 15px;
	font-weight: 600;
	color: ${palette.text.primary};
`;

export const FiltersDivider = styled(Box)`
	height: 1px;
	background: ${palette.gray['02']};
`;

export const FiltersSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const FiltersSectionLabel = styled(Text)`
	font-size: 11px;
	font-weight: 500;
	color: ${palette.gray['05']};
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

export const FiltersChipGroup = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const FiltersChip = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	min-width: unset;
	white-space: nowrap;
	transition: all 0.15s ease;
	background: ${({ isActive }) =>
		isActive ? palette.brand.dark : 'transparent'};
	color: ${({ isActive }) => (isActive ? palette.white : palette.gray['06'])};
	border-color: ${({ isActive }) =>
		isActive ? palette.brand.dark : palette.gray['03']};
`;

export const FiltersSwitchRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const FiltersSwitchLabel = styled(Text)`
	font-size: 13px;
	color: ${palette.text.primary};
`;

import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ClosedDayModalBody = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

export const ClosedDayModalText = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.95rem;
	line-height: 1.5;
`;

export const ClosedDayOptionsGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: ${spacing.xs};

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const ClosedDayOptionButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	background: ${({ isSelected }) =>
		isSelected
			? hexToRgba(palette.brand.purple, 0.08)
			: palette.background.paper};
	border: 1px solid
		${({ isSelected }) =>
			isSelected
				? palette.brand.purple
				: hexToRgba(palette.gray['04'], 0.25)};
	border-radius: ${spacing.medium};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.small};
	text-align: left;
	transition:
		border-color 0.15s ease,
		background 0.15s ease;

	&:hover {
		border-color: ${palette.brand.purple};
	}
`;

export const ClosedDayOptionTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.95rem;
	font-weight: 600;
`;

export const ClosedDayOptionDescription = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.8rem;
	line-height: 1.4;
`;

export const ClosedDayTimeRangeRow = styled(Box)`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: ${spacing.small};

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const ClosedDaySlotsGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: ${spacing.xs};

	${isMobileMedia} {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`;

export const ClosedDaySlotButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	align-items: center;
	background: ${({ isSelected }) =>
		isSelected
			? hexToRgba(palette.brand.purple, 0.12)
			: palette.background.paper};
	border: 1px solid
		${({ isSelected }) =>
			isSelected
				? palette.brand.purple
				: hexToRgba(palette.gray['04'], 0.22)};
	border-radius: ${spacing.small};
	color: ${({ isSelected }) =>
		isSelected ? palette.brand.purple : palette.text.primary};
	cursor: pointer;
	display: inline-flex;
	font-size: 0.9rem;
	font-weight: 500;
	justify-content: center;
	min-height: 2.75rem;
	padding: ${spacing.xs} ${spacing.small};
	transition:
		border-color 0.15s ease,
		background 0.15s ease;

	&:hover {
		border-color: ${palette.brand.purple};
	}
`;

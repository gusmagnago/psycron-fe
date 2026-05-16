import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ThisWeekRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	height: 100%;
`;

export const DonutRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.medium};
	flex: 1;
`;

export const DonutWrapper = styled(Box)`
	position: relative;
	flex-shrink: 0;
	width: clamp(90px, 30%, 130px);
	aspect-ratio: 1;
`;

export const DonutCenter = styled(Box)`
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

export const DonutTotal = styled.span`
	font-size: 28px;
	font-weight: 800;
	color: ${palette.text.primary};
	line-height: 1;
`;

export const LegendList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	flex: 1;
`;

export const LegendRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const LegendLabel = styled.span`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	color: ${palette.text.secondary};
`;

export const LegendDot = styled.span<{ color: string }>`
	width: 10px;
	height: 10px;
	border-radius: 3px;
	background: ${({ color }) => color};
	flex-shrink: 0;
`;

export const LegendCount = styled.span`
	font-size: 14px;
	font-weight: 700;
	color: ${palette.text.primary};
`;

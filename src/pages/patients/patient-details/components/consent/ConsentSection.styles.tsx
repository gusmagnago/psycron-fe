import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ConsentSectionRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const ConsentWarning = styled(Box)`
	background: ${hexToRgba(palette.warning.main, 0.1)};
	border: 1px solid ${hexToRgba(palette.warning.main, 0.3)};
	border-radius: ${spacing.small};
	color: ${palette.warning.dark};
	padding: ${spacing.small};
`;

export const ConsentRow = styled(Box)`
	align-items: center;
	border: 1px solid ${palette.gray['02']};
	border-radius: ${spacing.small};
	display: flex;
	gap: ${spacing.small};
	justify-content: space-between;
	padding: ${spacing.small};
`;

export const ConsentMeta = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
`;

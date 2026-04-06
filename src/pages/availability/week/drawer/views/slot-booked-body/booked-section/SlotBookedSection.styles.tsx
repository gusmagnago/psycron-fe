import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const SectionHeader = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};

	& svg {
		width: 14px;
		height: 14px;
	}
`;

export const SectionLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.gray['05']};
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

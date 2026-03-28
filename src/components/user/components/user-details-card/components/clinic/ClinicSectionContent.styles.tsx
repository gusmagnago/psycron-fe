import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ClinicContainer = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	width: 100%;
`;

export const ClinicEmptyState = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: ${spacing.small};
	padding: ${spacing.medium};
	background: ${palette.gray['01']};
	border: 1px solid ${palette.gray['02']};
	border-radius: ${spacing.small};
`;

export const ClinicEmptyIcon = styled(Box)`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 3.5rem;
	height: 3.5rem;
	border-radius: 100%;
	border: 2px dashed ${palette.brand.purple};
	background: ${palette.tertiary.surface.light};

	svg {
		color: ${palette.brand.purple};
	}
`;

export const ClinicEmptyTitle = styled(Text)`
	font-weight: 700;
`;

export const ClinicValueText = styled(Text)`
	font-weight: 500;
	color: ${palette.brand.purple};
	width: 70%;
	text-align: right;
`;

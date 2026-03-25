import styled from '@emotion/styled';
import { Box, FormControlLabel } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ExtendBannerWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${spacing.medium};
	flex: 1;
	padding: ${spacing.largeXl} ${spacing.medium};
`;

export const ExtendBannerTitle = styled(Text)`
	font-size: 1rem;
	font-weight: 500;
	color: ${palette.text.primary};
	text-align: center;
`;

export const ExtendBannerOptions = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const ExtendBannerOption = styled(FormControlLabel)`
	margin: 0;
	padding: ${spacing.small} ${spacing.medium};
	border-radius: ${spacing.extraSmall};
	border: 1px solid ${palette.gray['02']};
	width: 260px;
	transition: border-color 0.15s ease;

	&:hover {
		border-color: ${palette.brand.purple};
	}

	& .MuiFormControlLabel-label {
		font-size: 0.9rem;
		color: ${palette.text.primary};
	}
`;

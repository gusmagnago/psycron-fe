import styled from '@emotion/styled';
import { Box } from '@mui/material';
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

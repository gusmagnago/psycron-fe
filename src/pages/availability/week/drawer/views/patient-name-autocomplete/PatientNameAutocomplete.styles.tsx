import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const OptionWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.tiny};
	padding: ${spacing.tiny} 0;
`;

export const OptionName = styled(Text)`
	font-weight: 600;
	font-size: 0.875rem;
	color: ${palette.text.primary};
`;

export const OptionContact = styled(Text)`
	font-size: 0.75rem;
	color: ${palette.text.secondary};
`;

export const AutocompleteWrapper = styled(Box)`
	width: 100%;
`;

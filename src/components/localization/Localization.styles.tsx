import { Box, styled } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledSelectWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'hasMargin',
})<{ hasMargin?: boolean }>`
	width: 4.2rem;
	margin-left: ${({ hasMargin }) => (hasMargin ? spacing.small : 0)};
`;

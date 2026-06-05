import { Box, IconButton, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledSelectWrapper = styled(Box, {
	shouldForwardProp: (props) => props !== 'hasMargin',
})<{ hasMargin?: boolean }>`
	width: 4.2rem;
	margin-left: ${({ hasMargin }) => (hasMargin ? spacing.small : 0)};
`;

// Matches the navigation rail item: 48px rounded square, subtle grey hover.
export const LanguageTrigger = styled(IconButton)`
	width: 48px;
	height: 48px;
	border-radius: ${spacing.small};
	color: ${palette.gray['07']};
	transition:
		background-color 0.18s ease,
		color 0.18s ease;

	&:hover {
		background-color: ${palette.gray['00']};
		color: ${palette.text.primary};
	}
`;

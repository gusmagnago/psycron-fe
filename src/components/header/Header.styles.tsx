import { Box, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const HeaderWrapper = styled(Box)`
	height: var(--header-heigh);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${spacing.mediumLarge};
	z-index: 10;
`;

export const BrandWrapper = styled('a')`
	text-decoration: none;
	color: ${palette.black};
`;

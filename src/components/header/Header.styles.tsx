import { Box, styled } from '@mui/material';
import { isSmallerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
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

export const BrandWrapper = styled(Box)`
	width: auto;
	height: 5rem;

	${isSmallerThanTabletMedia} {
		height: 4rem;
	}
`;

export const BrandLink = styled('a')`
	color: ${palette.black};
	width: 100%;
	height: 100%;
	display: flex;
`;

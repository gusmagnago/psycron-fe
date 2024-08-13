import { Box, css, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanMediumMedia,
	isBiggerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const UnsubsPageWrapper = styled(Box)`
	z-index: 10;
	height: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	padding: ${spacing.medium};

	${isBiggerThanTabletMedia} {
		height: calc(100vh - var(--total-component-height));
	}

	${isBiggerThanMediumMedia} {
		flex-direction: row;
	}
`;

export const TextWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;

	width: 100%;

	${isBiggerThanMediumMedia} {
		width: 50%;
	}
`;

export const UnsubsHeading = styled(Text)`
	font-weight: 700;
	font-size: 1.3rem;
	padding-bottom: ${spacing.small};

	${isBiggerThanTabletMedia} {
		font-size: 2.6rem;
	}
`;

export const StyldBodyText = styled(Text)`
	font-size: 1.1rem;
	font-weight: 00;
	padding-bottom: ${spacing.small};
	text-align: left;

	${isBiggerThanTabletMedia} {
		font-size: 1.7rem;
	}
`;

export const ImgWrapper = styled(Box)`
	padding: ${spacing.mediumLarge};
	width: 100%;
	height: 18.75rem;

	${isBiggerThanTabletMedia} {
		height: 31.25rem;
		width: auto;
	}
`;

export const StyledLink = styled('a', {
	shouldForwardProp: (prop) => prop !== 'isLoading',
})<{ isLoading: boolean }>`
	font-weight: 600;
	padding: ${spacing.small} 0;

	${({ isLoading }) =>
		isLoading
			? css`
					color: ${palette.gray['03']};
					cursor: not-allowed;
				`
			: css`
					color: ${palette.secondary.main};
					cursor: pointer;
				`}
`;

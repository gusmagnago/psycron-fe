import { Box, css, styled } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const EditUserWrapper = styled(Box)`
	width: 100%;

	${isBiggerThanTabletMedia} {
		width: 50%;
	}
`;

export const EditingBox = styled(Box, {
	shouldForwardProp: (props) => props !== 'isEditing',
})<{ isEditing?: boolean }>`
	padding: ${spacing.mediumLarge};
	padding-bottom: ${spacing.medium};

	${({ isEditing }) =>
		isEditing
			? css`
					border: 1px solid ${palette.secondary.main};
					border-radius: calc(2 * ${spacing.mediumSmall});
					box-shadow: ${shadowPress};
					margin: ${spacing.small} 0;
				`
			: css``};
`;

export const EditButton = styled(Box)`
	width: 100%;
	display: flex;
	justify-content: flex-start;

	${isBiggerThanTabletMedia} {
		justify-content: flex-end;
	}
`;

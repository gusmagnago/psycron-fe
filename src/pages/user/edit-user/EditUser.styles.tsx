import { Box, css, styled } from '@mui/material';
import {
	isBiggerThanTabletMedia,
	isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
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
	padding: ${spacing.small};

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

export const EditUserFooter = styled(Box)`
	position: fixed;
	bottom: 0;
	right: 0;
	padding: ${spacing.mediumSmall};
	width: auto;

	${isMobileMedia} {
		width: 100%;
	}
`;

export const EditUserButtonWrapper = styled(Box)`
	backdrop-filter: blur(10px);
	border-radius: ${spacing.medium};
	width: 100%;
	padding: ${spacing.small};

	display: flex;
	justify-content: space-between;

	${isBiggerThanTabletMedia} {
		width: 100%;
		justify-content: flex-end;

		button {
			margin: 0 ${spacing.small};
		}
	}
`;

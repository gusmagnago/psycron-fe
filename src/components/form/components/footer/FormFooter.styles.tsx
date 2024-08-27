import { Box, styled } from '@mui/material';
import {
	isBiggerThanTabletMedia,
	isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

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

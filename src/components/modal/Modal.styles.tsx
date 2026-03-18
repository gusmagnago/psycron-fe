import { Box, Modal, styled } from '@mui/material';
import {
	isSmallerThanMediumMedia,
	isSmallerThanTabletMedia,
	isTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexModal } from '@psycron/theme/zIndex';

export const StyledModal = styled(Modal)`
	padding: ${spacing.mediumLarge};
	z-index: ${zIndexModal};
`;

export const StyledContentWrapper = styled(Box)`
	margin: 0;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 50%;
	max-height: 90vh;
	overflow-y: auto;

	${isTabletMedia} {
		width: 75%;
		padding: ${spacing.medium};
	}

	${isSmallerThanMediumMedia} {
		width: 60%;
	}

	${isSmallerThanTabletMedia} {
		width: 100%;
		max-height: 100vh;
	}
`;

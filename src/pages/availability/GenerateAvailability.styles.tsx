import { Box, styled } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';

export const GenerateAvailabilityContentWrapper = styled(Box)`
	flex: 1;
	height: 100%;
	overflow-y: auto;
	padding: 0;
	display: flex;
	flex-direction: column;
	position: relative;

	${isBiggerThanMediumMedia} {
		overflow: hidden;
		align-items: center;
		justify-content: center;
	}
`;

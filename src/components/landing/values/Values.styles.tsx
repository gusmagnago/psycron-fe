import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanMediumMedia,
	isBiggerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';

export const ValuesWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
`;

export const ValuesSection = styled(Box)`
	display: flex;
	justify-content: center;
	flex-direction: column;
	height: 100vh;

	${isBiggerThanMediumMedia} {
		flex-direction: row;
	}
`;

export const StyledText = styled(Text)`
	font-size: 2rem;
	font-weight: 800;

	${isBiggerThanTabletMedia} {
		font-size: 2.5rem;
	}
`;

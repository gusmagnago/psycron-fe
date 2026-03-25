import { Box, css, Grid, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

export const StyledWrapper = styled(Grid)`
	display: flex;
	flex-direction: column;
	position: relative;

	${isBiggerThanTabletMedia} {
		flex-direction: row;
	}
`;

export const StyledPatientDetails = styled(Grid, {
	shouldForwardProp: (props) => props !== 'hasPatient',
})<{ hasPatient?: boolean }>`
	width: 100%;

	${isBiggerThanTabletMedia} {
		width: ${({ hasPatient }) => (hasPatient ? '50%' : '100%')};
	}
`;

export const SessionListWrapper = styled(Grid)`
	height: 12rem;
	position: relative;
	overflow-y: auto;
	overflow-x: hidden;
	scroll-behavior: smooth;
`;

export const StyledSessionDatesList = styled(Box)`
	height: 100%;
	width: 100%;
	padding-left: ${spacing.xxs};
`;

export const StyledSessionDatesTitle = styled(Text)`
	position: sticky;
	background-color: ${palette.background.default};
	font-weight: 600;
	top: 0;
	z-index: ${zIndexSticky};
`;

export const StyledNextSessionText = styled(Text, {
	shouldForwardProp: (props) => props !== 'isToday' && props !== 'isPast',
})<{ isPast: boolean; isToday: boolean }>`
	font-size: 0.9rem;

	color: ${palette.secondary.dark};

	${({ isPast }) =>
		isPast &&
		css`
			color: ${palette.gray['06']};
		`}

	${({ isToday }) =>
		isToday &&
		css`
			color: ${palette.error.main};
		`}

	&:hover {
		color: ${palette.secondary.main};
		cursor: pointer;
	}
`;

export const StyledNextSessionHoverable = styled(Tooltip)`
	& .MuiIconButton-root {
		border-radius: 10px;
	}

	& .MuiTypography-root {
		font-size: 0.8rem;
		${isBiggerThanTabletMedia} {
			font-size: 0.95rem;
		}
	}
`;

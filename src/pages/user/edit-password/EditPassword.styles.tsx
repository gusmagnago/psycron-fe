import { Box, ListItemIcon, styled, TextField } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const EditPasswordWrapper = styled(Box)`
	width: 100%;

	${isBiggerThanTabletMedia} {
		width: 60%;
	}
`;

export const StyledPasswordForm = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

export const StyledCurrentPassword = styled(TextField)`
	padding-bottom: ${spacing.small};
	padding-right: 0;
	width: 100%;

	${isBiggerThanTabletMedia} {
		padding-right: ${spacing.small};
		width: 50%;
	}
`;

export const StyledInfoWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: ${spacing.medium};

	margin-bottom: ${spacing.xxl};

	${isBiggerThanTabletMedia} {
		margin-bottom: 0;
	}
`;

export const StyledListIcon = styled(ListItemIcon)`
	min-width: auto;
	padding-right: ${spacing.small};

	svg {
		color: ${palette.primary.main};
	}
`;

export const StyledExample = styled(Box)`
	background-color: ${palette.secondary.main};
	border-radius: 0.625rem;
	width: 50%;
`;

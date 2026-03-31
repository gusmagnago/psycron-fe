import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const CardWrapper = styled(Box)`
	align-items: center;
	background: ${palette.background.paper};
	border: 1px solid ${palette.brand.purple};
	border-radius: ${spacing.mediumSmall};
	display: flex;
	gap: ${spacing.medium};
	margin-bottom: ${spacing.large};
	padding: ${spacing.medium};
	box-shadow: ${shadowSmall};
`;

export const InfoBlock = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const SpecialityRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xxs};
	margin-top: ${spacing.xxs};
`;

export const SpecialityChip = styled(Box)`
	background: ${palette.brand.light};
	border-radius: ${spacing.mediumSmall};
	color: ${palette.brand.dark};
	font-size: 0.7rem;
	font-weight: 500;
	padding: 2px ${spacing.xs};
	text-transform: capitalize;
	white-space: nowrap;
	box-shadow: ${shadowSmall};
`;

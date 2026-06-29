import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { StatusNoteType } from './StatusNote.types';

const statusNoteColors: Record<StatusNoteType, string> = {
	google: palette.brand.google,
	info: palette.brand.purple,
	success: palette.success.main,
	warning: palette.warning.dark,
};

export const StatusNoteWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'noteType',
})<{ noteType: StatusNoteType }>`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.xxs};
	padding: 0;
	border-radius: 0;
	box-shadow: none;
	background: transparent;
	color: ${({ noteType }) => statusNoteColors[noteType]};
	font-size: 0.625rem;
	font-weight: 400;
	line-height: 1.45;
	text-align: left;

	& svg {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
		margin-top: 2px;
	}
`;

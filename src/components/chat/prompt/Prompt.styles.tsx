import { Box, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowDisabled, shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

export const PromptWrapper = styled(Box)`
	display: flex;
	align-items: center;
	padding: ${spacing.small} ${spacing.mediumSmall};
	width: 100%;
	position: sticky;
	bottom: 0;
	background-color: ${palette.background.default};
	border-radius: 3.125rem;
	z-index: ${zIndexSticky};
`;

export const SendPromptIconWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'disabled',
})<{ disabled: boolean }>`
	margin-left: ${spacing.xs};
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		transition: all 0.2s ease;
		rotate: ${({ disabled }) => (disabled ? '0deg' : '270deg')};
		color: ${({ disabled }) =>
			disabled ? palette.info.light : palette.info.main};
		cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
		filter: ${({ disabled }) => (disabled ? shadowDisabled : shadowMain)};
	}
`;

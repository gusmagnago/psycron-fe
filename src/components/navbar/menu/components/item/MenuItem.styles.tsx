import { Box, css, styled } from '@mui/material';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const MobileMenuIconWrapper = styled(Box)`
	width: 50px;
	height: auto;
	border-radius: 100%;
`;

export const MenuIconWrap = styled('span')`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	position: relative;
	padding: ${spacing.xs};
	border-radius: 100%;
`;

export const MenuBadge = styled('span')`
	position: absolute;
	top: -4px;
	right: -6px;
	min-width: 16px;
	height: 16px;
	padding: 0 4px;
	border-radius: 100%;
	background: ${palette.error.main};
	color: ${palette.white};
	font-size: 10px;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	line-height: 1;
`;

export const StyledMenuItem = styled(Tooltip, {
	shouldForwardProp: (prop) => prop !== '$isFooterIcon' && prop !== '$disabled',
})<{
	$disabled?: boolean;
	$isFooterIcon?: boolean;
}>`
	${({ $disabled }) =>
		$disabled
			? css`
					.MuiButtonBase-root {
						color: ${palette.gray['03']};
						background-color: ${palette.gray['01']};
						pointer-events: none;
					}
				`
			: css``}
`;

export const MobileMenuItem = styled(Box, {
	shouldForwardProp: (props) => props !== 'disabled',
})<{ disabled?: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: center;

	width: 100%;

	padding: ${spacing.xs};
	border-radius: 100%;
	gap: ${spacing.small};

	p {
		color: ${palette.brand.purple};
		font-weight: 500;
	}

	${({ disabled }) =>
		disabled
			? css`
					color: ${palette.gray['03']};
					background-color: ${palette.gray['01']};
					pointer-events: none;

					p {
						color: inherit;
					}
				`
			: css``}

	.MuiAvatar-root {
		width: 50px;
		height: auto;
	}
`;

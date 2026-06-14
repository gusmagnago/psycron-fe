import styled from '@emotion/styled';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ComingSoonBadgeRoot = styled('span')`
	display: inline-flex;
	align-items: center;
	padding: 2px ${spacing.space};
	border-radius: 999px;
	background: ${hexToRgba(palette.brand.purple, 0.12)};
	color: ${palette.brand.purple};
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	white-space: nowrap;
`;

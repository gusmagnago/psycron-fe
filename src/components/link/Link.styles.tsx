import { Link as RRDLink } from 'react-router-dom';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { ILinkStyledProps } from './Link.types';

const baseLinkStyles = css`
	margin: 0 ${spacing.xs};
	text-decoration: none;
	color: ${palette.secondary.main};
	transition: color 0.2s ease-out;
	&:hover {
		color: ${palette.secondary.action.press};
		transform: scale(1.1);
		transition: transform 0.2s ease-out;
	}
`;

const baseFirstLetterStyles = css`
	&::first-letter {
		text-transform: uppercase;
	}
`;

const baseHeaderStyles = css`
	font-size: 1.2rem;
	font-weight: 500;
`;

export const StyledLink = styled(RRDLink, {
	shouldForwardProp: (prop) =>
		prop !== 'firstLetterUpper' && prop !== 'isHeader',
})<ILinkStyledProps>`
	${baseLinkStyles};

	${({ firstLetterUpper }) => firstLetterUpper && baseFirstLetterStyles}

	${({ isHeader }) => isHeader && baseHeaderStyles}
`;

export const StyledAnchor = styled('a', {
	shouldForwardProp: (prop) =>
		prop !== 'firstLetterUpper' && prop !== 'isHeader',
})<ILinkStyledProps>`
	${baseLinkStyles};

	${({ firstLetterUpper }) => firstLetterUpper && baseFirstLetterStyles}

	${({ isHeader }) => isHeader && baseHeaderStyles}
`;

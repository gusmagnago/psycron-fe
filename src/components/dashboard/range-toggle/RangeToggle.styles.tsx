import styled from '@emotion/styled';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowInnerPress, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const RangeToggleRoot = styled('div')`
	align-items: center;
	background: ${palette.gray['01']};
	border: 1px solid ${palette.gray['02']};
	border-radius: 999px;
	box-shadow: ${shadowInnerPress};
	display: inline-flex;
	gap: ${spacing.space};
	min-width: 0;
	padding: ${spacing.space};
`;

export const RangeToggleOptionButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	align-items: center;
	background: ${({ isActive }) =>
		isActive ? dashboardAccents.info.surface : 'transparent'};
	border: 1px solid
		${({ isActive }) =>
			isActive ? dashboardAccents.info.border : 'transparent'};
	border-radius: 999px;
	box-shadow: ${({ isActive }) => (isActive ? shadowSmall : 'none')};
	color: ${({ isActive }) =>
		isActive ? dashboardAccents.info.contrast : palette.text.secondary};
	cursor: pointer;
	display: inline-flex;
	font: inherit;
	font-size: 0.75rem;
	font-weight: 700;
	gap: ${spacing.space};
	line-height: 1;
	min-height: 2rem;
	padding: ${spacing.space} ${spacing.xs};
	transition:
		background 0.16s ease,
		border-color 0.16s ease,
		color 0.16s ease,
		box-shadow 0.16s ease;
	white-space: nowrap;

	&:hover {
		color: ${palette.text.primary};
	}

	&:focus-visible {
		outline: 2px solid ${dashboardAccents.info.main};
		outline-offset: 2px;
	}

	& svg {
		height: 1rem;
		width: 1rem;
	}
`;

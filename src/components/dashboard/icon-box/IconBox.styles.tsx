import styled from '@emotion/styled';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const IconBoxRoot = styled('span', {
	shouldForwardProp: (prop) => prop !== 'size' && prop !== 'tone',
})<{
	size: number;
	tone: keyof typeof dashboardAccents;
}>`
	align-items: center;
	background: ${({ tone }) => dashboardAccents[tone].surface};
	border: 1px solid ${({ tone }) => dashboardAccents[tone].border};
	border-radius: ${spacing.xs};
	color: ${({ tone }) => dashboardAccents[tone].contrast};
	display: inline-flex;
	flex-shrink: 0;
	height: ${({ size }) => size}px;
	justify-content: center;
	width: ${({ size }) => size}px;

	& svg {
		height: 1.125rem;
		width: 1.125rem;
	}
`;

import styled from '@emotion/styled';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { StatusChipVariant } from './StatusChip.types';

export const StatusChipRoot = styled('span', {
	shouldForwardProp: (prop) =>
		prop !== 'leadingDot' && prop !== 'tone' && prop !== 'variant',
})<{
	leadingDot?: boolean;
	tone: keyof typeof dashboardAccents;
	variant: StatusChipVariant;
}>`
	align-items: center;
	background: ${({ tone, variant }) =>
		variant === 'filled' ? dashboardAccents[tone].surface : palette.white};
	border: 1px solid
		${({ tone, variant }) =>
			variant === 'outline'
				? dashboardAccents[tone].border
				: dashboardAccents[tone].surface};
	border-radius: 999px;
	color: ${({ tone }) => dashboardAccents[tone].contrast};
	display: inline-flex;
	font-size: 0.75rem;
	font-weight: 700;
	gap: ${spacing.space};
	line-height: 1;
	padding: ${spacing.space} ${spacing.xs};
	white-space: nowrap;

	&::before {
		background: ${({ tone }) => dashboardAccents[tone].main};
		border-radius: 50%;
		content: ${({ leadingDot }) => (leadingDot ? '\'\'' : 'none')};
		height: 0.375rem;
		width: 0.375rem;
	}
`;

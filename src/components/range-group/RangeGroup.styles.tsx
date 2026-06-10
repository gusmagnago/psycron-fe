import styled from '@emotion/styled';
import { Button } from '@psycron/components/button/Button';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMediumPurple, shadowSmall } from '@psycron/theme/shadow/shadow.theme';

import type { RangeGroupSize } from './RangeGroup.types';

const getRootGap = (size: RangeGroupSize): string => (size === 'small' ? '2px' : '3px');

const getRootPadding = (size: RangeGroupSize): string =>
	size === 'small' ? '2px' : '3px';

const getButtonFontSize = (size: RangeGroupSize): string =>
	size === 'small' ? '0.6875rem' : '0.75rem';

const getButtonMinHeight = (size: RangeGroupSize): string =>
	size === 'small' ? '1.625rem' : '2rem';

const getButtonPadding = (size: RangeGroupSize): string =>
	size === 'small' ? '0.3125rem 0.75rem' : '0.5rem 0.875rem';

export const RangeGroupRoot = styled('div', {
	shouldForwardProp: (prop) => prop !== 'groupSize',
})<{ groupSize: RangeGroupSize }>`
	align-items: center;
	background: ${palette.gray['00']};
	border-radius: 999px;
	box-shadow: ${shadowSmall};
	display: inline-flex;
	gap: ${({ groupSize }) => getRootGap(groupSize)};
	min-width: 0;
	padding: ${({ groupSize }) => getRootPadding(groupSize)};
`;

export const RangeGroupButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'groupSize' && prop !== 'isActive',
})<{ groupSize: RangeGroupSize; isActive: boolean }>`
	align-items: center;
	background: ${({ isActive }) =>
		isActive ? palette.brand.purple : 'transparent'};
	border: 0;
	border-radius: 999px;
	box-shadow: ${({ isActive }) => (isActive ? shadowMediumPurple : 'none')};
	color: ${({ isActive }) =>
		isActive ? palette.white : palette.text.secondary};
	cursor: pointer;
	display: inline-flex;
	font: inherit;
	font-size: ${({ groupSize }) => getButtonFontSize(groupSize)};
	font-weight: 700;
	gap: 0;
	line-height: 1;
	min-height: ${({ groupSize }) => getButtonMinHeight(groupSize)};
	min-width: 0;
	padding: ${({ groupSize }) => getButtonPadding(groupSize)};
	text-transform: none;
	transition:
		background 0.16s ease,
		box-shadow 0.16s ease,
		color 0.16s ease;
	white-space: nowrap;
	width: auto;

	appearance: none;

	&.MuiButton-root {
		border: 0;
		box-shadow: ${({ isActive }) => (isActive ? shadowMediumPurple : 'none')};
	}

	&.Mui-disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	&:hover {
		color: ${({ isActive }) => (isActive ? palette.white : palette.text.primary)};
	}

	&:focus-visible {
		box-shadow: ${shadowMediumPurple};
		outline: none;
	}
`;

import { Box, styled } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ReviewIntro = styled('p')`
	margin: 0 0 ${spacing.small};
	font-size: 13px;
	color: ${palette.text.secondary};
	line-height: 1.5;
`;

export const CandidateList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	max-height: 50vh;
	overflow-y: auto;
`;

export const CandidateRow = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'included',
})<{ included: boolean }>`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.xs};
	padding: ${spacing.xs} ${spacing.small};
	border-radius: ${spacing.extraSmall};
	background: ${palette.white};
	box-shadow: ${shadowSmall};
	opacity: ${({ included }) => (included ? 1 : 0.55)};
	transition: opacity 150ms ease;
`;

export const CandidateBody = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	flex: 1;
	min-width: 0;
`;

export const NameRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const CandidateMeta = styled(Box)`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	font-size: 12px;
	color: ${palette.text.secondary};
`;

export const ConfidenceBadge = styled('span', {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: 'high' | 'medium' | 'low' }>`
	display: inline-flex;
	align-items: center;
	padding: 2px 7px;
	border-radius: 6px;
	font-size: 10px;
	font-weight: 700;
	white-space: nowrap;
	${({ tone }) => {
		if (tone === 'high')
			return `background: ${hexToRgba(palette.success.main, 0.1)}; color: ${palette.success.main};`;
		if (tone === 'medium')
			return `background: ${palette.brand.light}; color: ${palette.brand.purple};`;
		return `background: ${hexToRgba(palette.warning.dark, 0.12)}; color: ${palette.warning.dark};`;
	}}
`;

export const EmptyState = styled('p')`
	margin: 0;
	padding: ${spacing.small} 0;
	font-size: 13px;
	color: ${palette.text.secondary};
	text-align: center;
`;

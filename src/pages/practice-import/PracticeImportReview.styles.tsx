import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMain,
	shadowMedium,
	shadowMediumPurple,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const Card = styled(Box)`
	width: 100%;
	max-width: 720px;
	margin: 0 auto;
	background: ${palette.white};
	border-radius: ${spacing.medium};
	box-shadow: ${shadowMain};
	padding: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const Header = styled(Box)`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.small};
`;

export const CatAvatar = styled(Box)`
	width: 36px;
	height: 36px;
	border-radius: 50%;
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${palette.brand.light};
	color: ${palette.brand.purple};
	box-shadow: ${shadowMedium};

	& svg {
		width: 20px;
		height: 20px;
	}
`;

export const Title = styled(Text)`
	font-size: 18px;
	font-weight: 700;
`;

export const Summary = styled(Text)`
	font-size: 13px;
	color: ${palette.text.secondary};
	margin-top: ${spacing.space};
`;

export const List = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const Row = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'rejected',
})<{ rejected: boolean }>`
	display: grid;
	grid-template-columns: 1fr auto auto auto;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xs} ${spacing.small};
	border-radius: ${spacing.small};
	background: ${palette.white};
	box-shadow: ${shadowMedium};
	opacity: ${({ rejected }) => (rejected ? 0.45 : 1)};
	transition:
		opacity 0.15s ease,
		box-shadow 0.15s ease;
`;

export const PatientName = styled(Text)`
	font-weight: 600;
	font-size: 14px;
`;

export const Meta = styled(Text)`
	font-size: 12px;
	color: ${palette.text.secondary};
`;

export const Badge = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'level',
})<{ level: 'high' | 'medium' | 'low' }>`
	font-size: 11px;
	font-weight: 700;
	border-radius: 999px;
	padding: ${spacing.space} ${spacing.xs};
	color: ${({ level }) =>
		level === 'high'
			? palette.success.dark
			: level === 'medium'
				? palette.brand.dark
				: palette.warning.dark};
	background: ${({ level }) =>
		level === 'high'
			? hexToRgba(palette.success.main, 0.14)
			: level === 'medium'
				? hexToRgba(palette.brand.purple, 0.12)
				: hexToRgba(palette.warning.main, 0.22)};
`;

export const RejectButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'rejected',
})<{ rejected: boolean }>`
	border: none;
	cursor: pointer;
	border-radius: 999px;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${palette.white};
	color: ${({ rejected }) => (rejected ? palette.success.dark : palette.text.secondary)};
	box-shadow: ${({ rejected }) =>
		rejected ? shadowMediumPurple : shadowMedium};
	transition: box-shadow 0.15s ease;

	& svg {
		width: 16px;
		height: 16px;
	}
`;

export const CommitBar = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
	margin-top: ${spacing.small};
`;

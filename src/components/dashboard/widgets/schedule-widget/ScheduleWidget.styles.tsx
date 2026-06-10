import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ScheduleRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	gap: ${spacing.xs};
`;

export const WidgetHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: ${spacing.xs};
	flex-shrink: 0;
	position: sticky;
	top: 0;
	z-index: 1;
	background: ${palette.white};
`;

export const WidgetTitle = styled(Text)`
	margin: 0;
	font-size: 0.9375rem;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const ScheduleWidgetTitle = WidgetTitle;

export const ScheduleLoadingList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const ScheduleRowList = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-height: 0;
	overflow-y: auto;
	padding: 0;
	scrollbar-color: ${palette.gray['02']} transparent;
	scrollbar-width: thin;
`;

export const ScheduleEmptyState = styled(Box)`
	align-items: center;
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.small};
	justify-content: center;
	min-height: 0;
	padding: ${spacing.mediumLarge} ${spacing.small};
	text-align: center;
`;

export const ScheduleEmptyIcon = styled(Box)`
	align-items: center;
	background: ${palette.brand.light};
	border-radius: 20px;
	color: ${palette.brand.purple};
	display: inline-flex;
	height: 4rem;
	justify-content: center;
	width: 4rem;
	box-shadow: ${shadowSmall};
`;

export const ScheduleEmptyTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 1.0625rem;
	font-weight: 700;
	line-height: 1.2;
`;

export const ScheduleEmptyBody = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.875rem;
	line-height: 1.5;
	max-width: 20rem;
`;

export const ScheduleEmptyAction = styled(Box)`
	display: flex;
	justify-content: center;
`;

export const ScheduleHeaderDate = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.8125rem;
	font-weight: 600;
	line-height: 1.3;
	text-align: right;
	white-space: nowrap;
`;

export const ScheduleFooterStrip = styled(Box)`
	display: grid;
	gap: ${spacing.xxs};
	grid-template-columns: repeat(7, minmax(0, 1fr));
	margin-top: ${spacing.xs};
	padding-top: 0;
`;

export const ScheduleFooterChip = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isToday',
})<{ isToday?: boolean }>`
	all: unset;
	align-items: center;
	background: ${({ isToday }) =>
		isToday ? palette.brand.light : palette.gray['01']};
	border-radius: 12px;
	color: ${({ isToday }) =>
		isToday ? palette.brand.dark : palette.text.primary};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: 0.125rem;
	justify-content: center;
	padding: 9px 0;
	text-align: center;
	transition:
		box-shadow 0.15s ease,
		transform 0.15s ease;
	width: 100%;

	&:hover {
		box-shadow: ${shadowSmall};
		transform: translateY(-1px);
	}

	&:focus-visible {
		outline: 2px solid ${palette.brand.purple};
		outline-offset: 2px;
	}
`;

export const ScheduleFooterChipLabel = styled.span`
	font-size: 0.6875rem;
	font-weight: 400;
	line-height: 1;
`;

export const ScheduleFooterChipCount = styled.span`
	align-items: center;
	color: ${palette.text.primary};
	display: inline-flex;
	font-size: 15px;
	font-weight: 700;
	justify-content: center;
	margin-top: ${spacing.xxs};
	line-height: 1;
`;

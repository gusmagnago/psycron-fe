import { Box, css, styled } from '@mui/material';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { Text } from '@psycron/components/text/Text';
import {
	isMobileMedia,
	isTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowInnerPress,
	shadowPress,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

const statusBorder = css`
	border-radius: 10px;
	padding: ${spacing.space};
	border: 2px solid;
`;

export const StyledCellWrapper = styled(Box)`
	height: 100%;
	width: 100%;

	display: flex;
	align-items: center;
`;

export const FullAmountItem = styled(Box)`
	background-color: ${palette.success.surface.light};
	border-radius: 15px;
	padding: ${spacing.xs};
`;

export const HasDiscountCell = styled(Box, {
	shouldForwardProp: (props) => props !== 'label',
})<{ label: string }>`
	display: flex;
	border: 1px solid ${palette.error.main};
	background-color: ${palette.error.surface.light};
	border-radius: 1.25rem;
	padding: ${spacing.xs};

	${({ label }) =>
		label.includes('Yes')
			? css`
					border: 1px solid ${palette.success.main};
					background-color: ${palette.success.surface.light};
				`
			: css`
					border: 1px solid ${palette.error.main};
					background-color: ${palette.error.surface.light};
				`};
`;

export const DateCell = styled(Box, {
	shouldForwardProp: (props) => props !== 'id',
})<{ id: string }>`
	font-size: 0.7rem;

	${({ id }) =>
		id === 'nextSession'
			? css`
					border: 1px solid ${palette.tertiary.main};
					background-color: ${palette.tertiary.surface.light};
					padding: ${spacing.xs};
					border-radius: 1.25rem;
					& > * {
						font-weight: 500;
					}
				`
			: css``};
`;

export const StyledIconWrapper = styled(Box)`
	padding: ${spacing.small};

	display: flex;

	${isMobileMedia} {
		padding: ${spacing.space};
		flex-direction: column;
		svg {
			width: 0.9375rem;
			height: 0.9375rem;
		}
	}

	${isTabletMedia} {
		padding: ${spacing.space};
		svg {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
`;

export const StyledStatusCell = styled(Text, {
	shouldForwardProp: (props) => props !== 'status',
})<{ status: string }>`
	font-size: 0.8rem;
	width: 100%;
	font-weight: 600;
	box-shadow: ${shadowPress};

	${isMobileMedia} {
		font-size: 0.7rem;
		font-weight: 500;
	}

	${statusBorder}

	:hover {
		box-shadow: ${shadowInnerPress};
	}

	${({ status }) =>
		status && status === 'BOOKED'
			? css`
					border-color: ${palette.success.main};
					background-color: ${palette.success.light};
				`
			: status === 'ONHOLD'
				? css`
						border-color: ${palette.info.main};
						background-color: ${palette.info.light};
					`
				: status === StatusEnum.CANCELED
					? css`
							border-color: ${palette.error.main};
							background-color: ${palette.error.light};
						`
					: css`
							border-color: ${palette.alert.main};
							background-color: ${palette.alert.light};
						`}
`;

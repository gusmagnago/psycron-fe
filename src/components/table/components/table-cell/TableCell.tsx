import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { EditUser } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { formatDateTime } from '@psycron/utils/variables';

import {
	DateCell,
	FullAmountItem,
	HasDiscountCell,
	StyledCellWrapper,
} from './TableCell.styles';
import type { ITableCellProps } from './TableCell.types';

export const TableCell = ({
	icon,
	numeric,
	label,
	action,
	isHead,
	isPatients,
	id,
}: ITableCellProps) => {
	const { t } = useTranslation();

	const align = (icon?: boolean, numeric?: boolean) => {
		if (icon || numeric) return 'center';
		return 'left';
	};

	const renderContent = () => {
		if (isHead) {
			return (
				<Typography
					width='100%'
					textAlign={align(icon, numeric)}
					variant='subtitle2'
					fontSize='0.8rem'
					m={1}
				>
					{label}
				</Typography>
			);
		}

		switch (id) {
		case 'nextSession':
		case 'latestPayment':
			return (
				<DateCell id={id}>
					<Typography
						width='100%'
						textAlign={align(icon, numeric)}
						variant='body2'
						fontSize='0.8rem'
					>
						{formatDateTime(label, t)}
					</Typography>
				</DateCell>
			);

		case 'hasDiscount':
			return (
				<HasDiscountCell label={label}>
					<Typography
						textAlign={align(icon, numeric)}
						variant='body2'
						fontSize='0.8rem'
					>
						{label}
					</Typography>
				</HasDiscountCell>
			);

		case 'fullAmount':
			return (
				<FullAmountItem>
					<Typography
						textAlign={align(icon, numeric)}
						variant='body2'
						fontSize='0.8rem'
					>
						{label}
					</Typography>
				</FullAmountItem>
			);

		default:
			return (
				<Typography
					width='100%'
					textAlign={align(icon, numeric)}
					variant='body2'
					fontSize='0.8rem'
				>
					{label}
				</Typography>
			);
		}
	};

	return (
		<StyledCellWrapper id={id}>
			{action ? (
				!isHead ? (
					<Box p={2}>
						<Tooltip title={isPatients ? 'manage patient' : ''}>
							{isPatients ? <EditUser /> : <div>ICON</div>}
						</Tooltip>
					</Box>
				) : null
			) : (
				renderContent()
			)}
		</StyledCellWrapper>
	);
};

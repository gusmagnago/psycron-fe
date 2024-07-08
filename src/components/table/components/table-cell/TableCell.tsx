import { IconButton, Typography } from '@mui/material';
import { EditUser } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import { StyledCellWrapper } from './TableCell.styles';
import type { ITableCellProps } from './TableCell.types';

export const TableCell = ({
	icon,
	numeric,
	label,
	action,
	isHead,
	isPatients,
}: ITableCellProps) => {
	const align = () => {
		if (icon) return 'center';
		if (numeric) return 'right';
		return 'left';
	};
	return (
		<StyledCellWrapper>
			{action ? (
				!isHead ? (
					<Tooltip title={isPatients ? 'manage patient' : ''}>
						<IconButton>
							{isPatients ? <EditUser /> : <div>ICON</div>}
						</IconButton>
					</Tooltip>
				) : null
			) : (
				<Typography
					textAlign={align}
					variant={isHead ? 'subtitle2' : 'body2'}
				>
					{label}
				</Typography>
			)}
		</StyledCellWrapper>
	);
};

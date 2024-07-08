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
  const align = (icon?: boolean, numeric?: boolean) => {
    if (icon || numeric) return 'center';
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
          width={'100%'}
          textAlign={align(icon, numeric)}
          variant={isHead ? 'subtitle2' : 'body2'}
          fontSize={'0.8rem'}
          m={1}
        >
          {label}
        </Typography>
      )}
    </StyledCellWrapper>
  );
};

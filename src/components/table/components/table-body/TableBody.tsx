import { Box, Grid } from '@mui/material';
import { Divider } from '@psycron/components/divider/Divider';

import { tableBones } from '../../utils';
import { TableCell } from '../table-cell/TableCell';

import {
  StyledRow,
  TableBodyRow,
  TableBodyRowItem,
  TableBodyWrapper,
} from './TableBody.styles';
import type { ITableBodyProps } from './TableBody.types';
import useViewport from '@psycron/hooks/useViewport';
import { useNavigate } from 'react-router-dom';

export const TableBody = ({ bodyItems, hoveredColumn }: ITableBodyProps) => {
  const navigate = useNavigate();
  const { isTablet, isMobile } = useViewport();

  const handleMobileClick = () => {
    if (isMobile) return navigate('/edit-user');
    return;
  };

  return (
    <Box mt={5}>
      <Box minHeight={isTablet || isMobile ? 510 : 530}>
        {bodyItems.map((row, rowIndex) => (
          <TableBodyWrapper
            container
            columns={row.length}
            key={`table-row-${rowIndex}`}
          >
            <StyledRow>
              {row.map(
                ({ icon, numeric, label, action, isPatients, id }, index) => (
                  <Grid
                    key={`table-cell-${rowIndex}-${index}`}
                    item
                    xs={tableBones(action, index, isTablet || isMobile)}
                    onClick={handleMobileClick}
                    display='flex'
                  >
                    <TableBodyRowItem isHovered={hoveredColumn === id}>
                      <TableBodyRow>
                        <TableCell
                          icon={icon}
                          label={label}
                          numeric={numeric}
                          action={action}
                          isPatients={isPatients}
                          id={id}
                        />
                      </TableBodyRow>
                    </TableBodyRowItem>
                    {index !== row.length - 1 && !(isTablet || isMobile) ? (
                      <Divider small />
                    ) : null}
                  </Grid>
                )
              )}
            </StyledRow>
            {rowIndex !== bodyItems.length - 1 ? (
              <Box width={'100%'} my={2}>
                <Divider small />
              </Box>
            ) : null}
          </TableBodyWrapper>
        ))}
      </Box>
    </Box>
  );
};

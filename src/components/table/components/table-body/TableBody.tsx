import { Box } from '@mui/material';

import { tableBones } from '../../utils';
import { TableCell } from '../table-cell/TableCell';

import {
  StyledRow,
  TableBodyRow,
  TableBodyRowItem,
  TableBodyWrapper,
} from './TableBody.styles';
import { Divider } from '@psycron/components/divider/Divider';
import { ITableBodyProps } from './TableBody.types';
import { Pagination } from '../pagination/Pagination';
import { useState } from 'react';

export const TableBody = ({ bodyItems }: ITableBodyProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(bodyItems.length / rowsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  const displayedItems = bodyItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Box mt={5}>
      <Box minHeight={530}>
        {displayedItems.map((row, rowIndex) => (
          <TableBodyWrapper
            container
            columns={row.length}
            key={`table-row-${rowIndex}`}
          >
            <StyledRow>
              {row.map(
                ({ icon, numeric, label, action, isPatients, id }, index) => (
                  <TableBodyRowItem
                    key={`table-cell-${rowIndex}-${index}`}
                    item
                    xs={tableBones(action, index)}
                  >
                    <TableBodyRow>
                      <TableCell
                        icon={icon}
                        label={label}
                        numeric={numeric}
                        action={action}
                        isPatients={isPatients}
                        id={id}
                      />
                      {index !== row.length - 1 ? <Divider small /> : null}
                    </TableBodyRow>
                  </TableBodyRowItem>
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
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

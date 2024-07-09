import { useMemo, useState } from 'react';
import { Divider } from '@mui/material';

import { Pagination } from './components/pagination/Pagination';
import { TableBody } from './components/table-body/TableBody';
import { TableHead } from './components/table-head/TableHead';
import { StyledPaper, TableWrapper } from './Table.styles';
import type { ITableProps } from './Table.types';
import useViewport from '@psycron/hooks/useViewport';
import { filterItems } from './utils';

export const Table = ({
  headItems,
  bodyItems,
  columnsToHideTablet,
  columnsToHideMobile,
}: ITableProps) => {
  const { isTablet, isMobile } = useViewport();

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

  const filteredHeadItems = useMemo(
    () =>
      filterItems(
        headItems,
        isTablet,
        isMobile,
        columnsToHideTablet,
        columnsToHideMobile
      ),
    [isTablet, isMobile, headItems]
  );

  const filteredBodyItems = useMemo(
    () =>
      displayedItems.map((row) =>
        filterItems(
          row,
          isTablet,
          isMobile,
          columnsToHideTablet,
          columnsToHideMobile
        )
      ),
    [isTablet, isMobile, displayedItems]
  );

  return (
    <TableWrapper>
      <StyledPaper>
        <TableHead headItems={filteredHeadItems} />
        <Divider />
        <TableBody bodyItems={filteredBodyItems} />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </StyledPaper>
    </TableWrapper>
  );
};

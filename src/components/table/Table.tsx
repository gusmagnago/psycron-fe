import { useCallback, useMemo, useState } from 'react';
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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(bodyItems.length / rowsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  const handleSort = useCallback((id: string) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig?.key === id) {
        return {
          key: id,
          direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: id, direction: 'asc' };
    });
  }, []);

  const displayedItems = useMemo(() => {
    let sortedItems = [...bodyItems];
    if (sortConfig !== null) {
      sortedItems = sortedItems.sort((a, b) => {
        const aValue =
          a.find((item) => item.id === sortConfig.key)?.label ?? '';
        const bValue =
          b.find((item) => item.id === sortConfig.key)?.label ?? '';

        const aNumber = parseFloat(aValue);
        const bNumber = parseFloat(bValue);

        if (!isNaN(aNumber) && !isNaN(bNumber)) {
          // Both values are numbers
          return sortConfig.direction === 'asc'
            ? aNumber - bNumber
            : bNumber - aNumber;
        }

        // Compare as strings
        if (aValue === bValue) return 0;
        if (sortConfig.direction === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      });
    }
    return sortedItems.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [bodyItems, currentPage, rowsPerPage, sortConfig]);

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

  const handleHover = useCallback((id: string | null) => {
    setHoveredColumn(id);
  }, []);

  return (
    <TableWrapper>
      <StyledPaper>
        <TableHead
          headItems={filteredHeadItems}
          onSort={handleSort}
          onHover={handleHover}
        />
        <Divider />
        <TableBody
          bodyItems={filteredBodyItems}
          hoveredColumn={hoveredColumn}
        />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </StyledPaper>
    </TableWrapper>
  );
};

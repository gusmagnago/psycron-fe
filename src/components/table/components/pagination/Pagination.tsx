import { Box, Pagination as MUIPagination } from '@mui/material';
import { IPaginationProps } from './Pagination.types';

export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  ...props
}: IPaginationProps) => {
  return (
    <Box
      pt={5}
      display='flex'
      justifyContent='center'
      alignItems='center'
      height='100%'
    >
      <MUIPagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        showFirstButton
        showLastButton
        {...props}
      />
    </Box>
  );
};

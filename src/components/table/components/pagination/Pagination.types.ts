import type { PaginationProps } from '@mui/material';

export interface IPaginationProps extends PaginationProps {
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  totalPages: number;
}

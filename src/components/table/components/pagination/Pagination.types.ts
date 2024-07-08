import { PaginationProps } from '@mui/material';

export interface IPaginationProps extends PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

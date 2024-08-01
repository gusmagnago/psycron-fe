import type { SelectChangeEvent } from '@mui/material';

export interface SelectComponentProps {
  items: { name: string; value: string | number }[];
  onChangeSelect: (e: SelectChangeEvent<string>) => void;
  required?: boolean;
  selectLabel?: string;
  subtitle?: boolean;
  value?: string;
  width?: string;
}

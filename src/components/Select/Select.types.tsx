import type { SelectChangeEvent } from '@mui/material';

export type SelectProps = {
    items: {name: string, value: number}[],
    onChangeSelect: (e: SelectChangeEvent<string>) => void;
    required?: boolean;
    selectLabel: string; 
    value?: string;
}
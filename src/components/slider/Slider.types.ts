import type { ReactNode } from 'react';
import type { SliderOwnProps } from '@mui/material';

export interface ISliderProps extends SliderOwnProps {
    endIcon?: ReactNode;
    label?: string;
    startIcon?: ReactNode;
}

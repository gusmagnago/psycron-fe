import type { MouseEventHandler, ReactNode } from 'react';
import type { ButtonProps } from '@mui/material';

export interface IButtonProps extends ButtonProps {
    children: ReactNode;
    fullWidth?:boolean;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
    secondary?: boolean;
    small?: boolean;
    tertiary?: boolean;
}
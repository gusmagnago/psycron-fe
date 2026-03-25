import type { MouseEventHandler, ReactNode } from 'react';
import type { ButtonProps } from '@mui/material';

export type ButtonSeverity = 'error' | 'info' | 'success' | 'warning';

export interface IButtonProps extends ButtonProps {
	children: ReactNode;
	fullWidth?: boolean;
	loading?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
	secondary?: boolean;
	severity?: ButtonSeverity;
	small?: boolean;
	tertiary?: boolean;
}

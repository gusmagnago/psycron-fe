import type { AlertProps } from '@mui/material';

export interface IAlertProps {
	message: string;
	resetCallback?: () => void;
	severity: AlertProps['severity'];
}

export interface AlertContextProps {
	showAlert: ({ message, severity }: IAlertProps) => void;
}

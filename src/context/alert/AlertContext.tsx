import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { AlertProps } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';

interface IAlertProps {
	message: string;
	resetCallback?: () => void;
	severity: AlertProps['severity'];
}

interface AlertContextProps {
	showAlert: ({ message, severity }: IAlertProps) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error('useAlert must be used within an AlertProvider');
	}
	return context;
};

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [alert, setAlert] = useState<IAlertProps | null>(null);
	const [open, setOpen] = useState<boolean>(false);

	const showAlert = ({ message, severity, resetCallback }: IAlertProps) => {
		setAlert({ message, severity, resetCallback });
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		if (alert?.resetCallback) {
			return alert.resetCallback();
		}
	};

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				{alert && (
					<Alert
						onClose={handleClose}
						severity={alert.severity}
						sx={{ width: '100%' }}
					>
						{alert.message}
					</Alert>
				)}
			</Snackbar>
		</AlertContext.Provider>
	);
};

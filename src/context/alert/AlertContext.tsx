import type { FC, ReactNode } from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { Alert, Snackbar } from '@mui/material';

import type { AlertContextProps, IAlertProps } from './AlertContext.types';

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error('useAlert must be used within an AlertProvider');
	}
	return context;
};

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [queue, setQueue] = useState<IAlertProps[]>([]);
	const [current, setCurrent] = useState<IAlertProps | null>(null);
	const [open, setOpen] = useState(false);

	// Whenever the queue has items and nothing is shown, pop the next alert
	useEffect(() => {
		if (!open && !current && queue.length > 0) {
			const [next, ...rest] = queue;
			setQueue(rest);
			setCurrent(next);
			setOpen(true);
		}
	}, [open, current, queue]);

	const showAlert = useCallback(
		({ message, severity, resetCallback }: IAlertProps) => {
			setQueue((prev) => [...prev, { message, severity, resetCallback }]);
		},
		[]
	);

	const handleClose = useCallback(() => {
		setOpen(false);
		if (current?.resetCallback) {
			current.resetCallback();
		}
	}, [current]);

	// After the exit animation, clear current so the next queued alert can show
	const handleExited = useCallback(() => {
		setCurrent(null);
	}, []);

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				slotProps={{ transition: { onExited: handleExited } }}
			>
				{current && (
					<Alert
						onClose={handleClose}
						severity={current.severity}
						variant='filled'
						sx={{ width: '100%' }}
					>
						{current.message}
					</Alert>
				)}
			</Snackbar>
		</AlertContext.Provider>
	);
};

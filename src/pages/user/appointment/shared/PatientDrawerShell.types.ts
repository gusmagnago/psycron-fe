export interface PatientDrawerShellProps {
	accentColor: string;
	actions?: React.ReactNode;
	ariaLabel: string;
	children: React.ReactNode;
	closeLabel?: string;
	headerExtra?: React.ReactNode;
	hideFallbackClose?: boolean;
	onClose: () => void;
	roleLabel: string;
	statusLabel?: string;
	subtitle?: string | null;
	title: string;
}

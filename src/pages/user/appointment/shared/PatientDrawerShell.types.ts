export interface PatientDrawerShellProps {
	accentColor: string;
	actions?: React.ReactNode;
	ariaLabel: string;
	children: React.ReactNode;
	closeLabel?: string;
	onClose: () => void;
	roleLabel: string;
	statusLabel?: string;
	subtitle?: string | null;
	title: string;
}

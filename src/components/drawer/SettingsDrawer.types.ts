import type { ReactNode } from 'react';

export interface ISettingsDrawer {
	ariaLabel: string;
	children: ReactNode;
	desc?: string;
	isSaving?: boolean;
	onClose: () => void;
	onSave: () => void;
	saveDisabled?: boolean;
	showCancel?: boolean;
	title: string;
}

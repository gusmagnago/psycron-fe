import type { ReactNode } from 'react';

export interface ISettingsDrawer {
	ariaLabel: string;
	children: ReactNode;
	desc?: string;
	isSaving?: boolean;
	onClose: () => void;
	onSave: () => void;
	saveDisabled?: boolean;
	saveLabel?: string;
	showCancel?: boolean;
	title: string;
}

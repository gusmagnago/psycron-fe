import type { ReactNode } from 'react';

export interface IChipOption {
	icon?: ReactNode;
	key: string;
	label: string;
	variant?: 'google' | 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
}

export interface ISingleSelectChipsProps {
	disabled?: boolean;
	onSelect: (key: string) => void;
	options: IChipOption[];
	/** When set, each chip/container gets a `${testIdPrefix}-*` data-testid + id. */
	testIdPrefix?: string;
}

export interface IMultiSelectChipsProps {
	confirmLabel: string;
	disabled?: boolean;
	onConfirm: (selectedKeys: string[]) => void;
	onOtherSubmit?: (text: string) => void;
	options: IChipOption[];
	otherChipKey?: string;
	otherPlaceholder?: string;
	/** When set, each chip/container gets a `${testIdPrefix}-*` data-testid + id. */
	testIdPrefix?: string;
}

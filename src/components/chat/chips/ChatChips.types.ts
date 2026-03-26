export interface IChipOption {
	key: string;
	label: string;
	variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
}

export interface ISingleSelectChipsProps {
	disabled?: boolean;
	onSelect: (key: string) => void;
	options: IChipOption[];
}

export interface IMultiSelectChipsProps {
	confirmLabel: string;
	disabled?: boolean;
	onConfirm: (selectedKeys: string[]) => void;
	onOtherSubmit?: (text: string) => void;
	options: IChipOption[];
	otherChipKey?: string;
	otherPlaceholder?: string;
}

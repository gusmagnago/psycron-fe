import type { ReactNode } from 'react';
import type { SelectChangeEvent } from '@mui/material';

export interface SelectComponentProps {
	customRenderItem?: (item: ISelectItem) => ReactNode;
	hiddenLabel?: boolean;
	hidePrimaryValue?: boolean;
	items: ISelectItem[];
	onChangeSelect: (e: SelectChangeEvent) => void;
	required?: boolean;
	selectLabel?: string;
	subtitle?: boolean;
	value?: string;
	width?: string;
}

export interface ISelectItem {
	name: string;
	value: string | number;
}

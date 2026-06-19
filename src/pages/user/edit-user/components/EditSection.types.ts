import type { ReactNode } from 'react';

export interface EditSectionProps {
	children: ReactNode;
	disabled?: boolean;
	isEnabled: boolean;
	onToggle: (next: boolean) => void;
	testId?: string;
	title: string;
}

import type { ReactNode } from 'react';

export interface CollapsibleSectionProps {
	children: ReactNode;
	defaultOpen?: boolean;
	icon?: ReactNode;
	title: string;
}

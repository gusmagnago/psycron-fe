import { parseISO } from 'date-fns';
import type { Variants } from 'framer-motion';

export const rowVariants: Variants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.05, duration: 0.22, ease: 'easeOut' },
	}),
};

export const getCreatedAtLabel = (
	createdAt: string,
	locale: string
): string =>
	new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
		parseISO(createdAt)
	);

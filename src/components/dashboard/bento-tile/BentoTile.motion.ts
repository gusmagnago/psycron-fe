export const bentoTileVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: (index: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: index * 0.06, duration: 0.35, ease: 'easeOut' },
	}),
};

export const bentoTileModalVariants = {
	hidden: {
		opacity: 0,
		scale: 0.94,
		x: '-50%',
		y: 'calc(-50% + 24px)',
	},
	visible: {
		opacity: 1,
		scale: 1,
		x: '-50%',
		y: '-50%',
		transition: { duration: 0.24, ease: 'easeOut' },
	},
	exit: {
		opacity: 0,
		scale: 0.96,
		x: '-50%',
		y: 'calc(-50% + 16px)',
		transition: { duration: 0.18, ease: 'easeIn' },
	},
};

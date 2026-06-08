export const bentoTileVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: (index: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			bounce: 0.18,
			delay: index * 0.045,
			duration: 0.52,
			type: 'spring',
		},
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
		transition: { bounce: 0.16, duration: 0.38, type: 'spring' },
	},
	exit: {
		opacity: 0,
		scale: 0.96,
		x: '-50%',
		y: 'calc(-50% + 16px)',
		transition: { duration: 0.18, ease: 'easeIn' },
	},
};

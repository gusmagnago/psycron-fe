import type { Variants, ViewportOptions } from 'framer-motion';

const PATIENT_CARD_STAGGER_SECONDS = 0.045;
const PATIENT_CARD_STAGGER_LIMIT = 6;

export const patientCardScrollVariants: Variants = {
	hidden: {
		filter: 'blur(4px)',
		opacity: 0,
		scale: 0.97,
		y: 28,
	},
	visible: (cardIndex: number) => ({
		filter: 'blur(0px)',
		opacity: 1,
		scale: 1,
		transition: {
			delay:
				Math.min(cardIndex, PATIENT_CARD_STAGGER_LIMIT) *
				PATIENT_CARD_STAGGER_SECONDS,
			duration: 0.46,
			ease: [0.22, 1, 0.36, 1],
		},
		y: 0,
	}),
};

export const patientCardScrollViewport: ViewportOptions = {
	amount: 0.18,
	margin: '0px 0px -8% 0px',
	once: true,
};

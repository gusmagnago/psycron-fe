import { palette } from '@psycron/theme/palette/palette.theme';
import { Moon, Sun, Sunset } from 'lucide-react';

import { FallbackIconWrapper, LummiHeroWrapper, LummiImage } from './LummiHero.styles';
import type { LummiHeroProps } from './LummiHero.types';

const FALLBACK_ICONS = {
	afternoon: <Sunset color={palette.secondary.main} size={64} />,
	evening: <Moon color={palette.tertiary.main} size={64} />,
	morning: <Sun color={palette.alert.main} size={64} />,
} as const;

const floatVariants = {
	animate: {
		y: [0, -8, 0],
		transition: {
			duration: 4,
			ease: 'easeInOut',
			repeat: Infinity,
			repeatType: 'loop' as const,
		},
	},
};

export const LummiHero = ({ band, imageConfig, size = 120 }: LummiHeroProps) => {
	const imageUrl = imageConfig?.[band];

	return (
		<LummiHeroWrapper
			animate='animate'
			aria-hidden='true'
			size={size}
			variants={floatVariants}
		>
			{imageUrl ? (
				<LummiImage alt='' src={imageUrl} />
			) : (
				<FallbackIconWrapper size={size}>
					{FALLBACK_ICONS[band]}
				</FallbackIconWrapper>
			)}
		</LummiHeroWrapper>
	);
};

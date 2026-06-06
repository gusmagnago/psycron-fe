import type { TimeOfDayBand } from '@psycron/hooks/useTimeOfDay';

import {
	cloudDriftCss,
	FallbackIconWrapper,
	GlowRing,
	LummiHeroWrapper,
	LummiImage,
	rainFallCss,
	raysSpinCss,
} from './LummiHero.styles';
import type { LummiHeroProps, WeatherType } from './LummiHero.types';

/* ── animated weather SVGs ───────────────────────────────────────── */
const CLOUD_PATH = 'M46 37a11 11 0 0 0 0-22 15.5 15.5 0 0 0-30 5A9 9 0 0 0 16 37z';
const RAIN_CLOUD_PATH = 'M46 32a11 11 0 0 0 0-22 15.5 15.5 0 0 0-30 5A9 9 0 0 0 16 32z';

const CloudyIcon = () => (
	<svg aria-hidden='true' height={64} viewBox='0 0 64 64' width={64}>
		<g css={cloudDriftCss}>
			<path
				d={CLOUD_PATH}
				fill='none'
				stroke='#979C9E'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
			/>
		</g>
	</svg>
);

const RainIcon = () => (
	<svg aria-hidden='true' height={64} viewBox='0 0 64 64' width={64}>
		<g css={cloudDriftCss}>
			<path
				d={RAIN_CLOUD_PATH}
				fill='none'
				stroke='#979C9E'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
			/>
		</g>
		<path css={rainFallCss(0)}    d='M27 47v4' fill='none' stroke='#9C7CFD' strokeLinecap='round' strokeWidth={2.4} />
		<path css={rainFallCss(0.25)} d='M34 47v5' fill='none' stroke='#9C7CFD' strokeLinecap='round' strokeWidth={2.4} />
		<path css={rainFallCss(0.5)}  d='M41 47v4' fill='none' stroke='#9C7CFD' strokeLinecap='round' strokeWidth={2.4} />
	</svg>
);

/* ── band icons (clear weather, custom animated SVGs) ────────────── */
const MorningIcon = () => (
	<svg aria-hidden='true' fill='none' height={64} strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 64 64' width={64}>
		<g css={raysSpinCss} stroke='#FBC02D' strokeWidth={2}>
			<path d='M32 8v5' />
			<path d='M14.5 14.5l3.5 3.5' />
			<path d='M49.5 14.5l-3.5 3.5' />
			<path d='M8 32h5' />
			<path d='M51 32h5' />
		</g>
		<path d='M20 40a12 12 0 0 1 24 0' stroke='#F9A825' strokeWidth={2} />
		<path d='M10 40h44' stroke='#F9A825' strokeWidth={2} />
		<path d='M16 47h32' opacity={0.6} stroke='#FBC02D' strokeWidth={2} />
	</svg>
);

const AfternoonIcon = () => (
	<svg aria-hidden='true' fill='none' height={64} strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 64 64' width={64}>
		<g css={raysSpinCss} stroke='#FBC02D' strokeWidth={2}>
			<path d='M32 6v6' />
			<path d='M32 52v6' />
			<path d='M6 32h6' />
			<path d='M52 32h6' />
			<path d='M13.5 13.5l4.2 4.2' />
			<path d='M46.5 46.5l4.2 4.2' />
			<path d='M50.5 13.5l-4.2 4.2' />
			<path d='M17.7 46.5l-4.2 4.2' />
		</g>
		<circle cx={32} cy={32} r={11} stroke='#F9A825' strokeWidth={2} />
	</svg>
);

const EveningIcon = () => (
	<svg aria-hidden='true' fill='none' height={64} strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 64 64' width={64}>
		<g css={raysSpinCss} stroke='#FBC02D' strokeWidth={2}>
			<path d='M32 10v4' />
			<path d='M15 17l3 3' />
			<path d='M49 17l-3 3' />
		</g>
		<path d='M21 41a11 11 0 0 1 22 0' stroke='#FF8A5C' strokeWidth={2} />
		<path d='M9 41h46' stroke='#FF8A5C' strokeWidth={2} />
		<path d='M15 48h34' opacity={0.7} stroke='#FBC02D' strokeWidth={2} />
	</svg>
);

const BAND_ICONS: Record<TimeOfDayBand, React.ReactElement> = {
	afternoon: <AfternoonIcon />,
	evening: <EveningIcon />,
	morning: <MorningIcon />,
};

/* ── weather icons ───────────────────────────────────────────────── */
const WEATHER_ICONS: Record<Exclude<WeatherType, 'clear'>, React.ReactElement> = {
	cloudy: <CloudyIcon />,
	rain: <RainIcon />,
};

/* ── glow colours ────────────────────────────────────────────────── */
const BAND_GLOW: Record<TimeOfDayBand, string> = {
	afternoon: 'rgba(251,192,45,.5)',
	evening: 'rgba(255,138,92,.5)',
	morning: 'rgba(251,192,45,.45)',
};

const WEATHER_GLOW: Record<Exclude<WeatherType, 'clear'>, string> = {
	cloudy: 'rgba(151,156,158,.35)',
	rain: 'rgba(156,124,253,.4)',
};

/* ── framer variants ─────────────────────────────────────────────── */
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

const glowVariants = {
	animate: {
		opacity: [0.55, 1, 0.55],
		scale: [0.9, 1.12, 0.9],
		transition: {
			duration: 4.5,
			ease: 'easeInOut',
			repeat: Infinity,
			repeatType: 'loop' as const,
		},
	},
};

export const LummiHero = ({ band, imageConfig, size = 120, weather = 'clear' }: LummiHeroProps) => {
	const imageUrl = imageConfig?.[band];
	const fallbackIcon = weather === 'clear' ? BAND_ICONS[band] : WEATHER_ICONS[weather];
	const glowColor = weather === 'clear' ? BAND_GLOW[band] : WEATHER_GLOW[weather as Exclude<WeatherType, 'clear'>];

	return (
		<LummiHeroWrapper
			animate='animate'
			aria-hidden='true'
			size={size}
			variants={weather === 'clear' ? floatVariants : undefined}
		>
			<GlowRing animate='animate' glowColor={glowColor} variants={glowVariants} />
			{imageUrl ? (
				<LummiImage alt='' src={imageUrl} />
			) : (
				<FallbackIconWrapper size={size}>
					{fallbackIcon}
				</FallbackIconWrapper>
			)}
		</LummiHeroWrapper>
	);
};

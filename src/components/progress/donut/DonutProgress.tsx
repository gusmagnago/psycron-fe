import { useId } from 'react';

import {
	DonutCenter,
	DonutFill,
	DonutMeta,
	DonutShell,
	DonutSvg,
	DonutTrack,
	DonutValue,
} from './DonutProgress.styles';
import type { DonutProgressProps } from './DonutProgress.types';

const DONUT_RADIUS = 44;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export const DonutProgress = ({
	label,
	meta,
	tone = 'primary',
	value,
}: DonutProgressProps) => {
	const id = useId().replace(/:/g, '');
	const gradientId = `donut-gradient-${id}`;
	const normalizedValue = Math.min(Math.max(value, 0), 100);
	const progressOffset =
		DONUT_CIRCUMFERENCE - (normalizedValue / 100) * DONUT_CIRCUMFERENCE;

	return (
		<DonutShell
			aria-label={label}
			progressValue={normalizedValue}
			role='img'
			tone={tone}
		>
			<DonutSvg aria-hidden='true' viewBox='0 0 112 112'>
				<defs>
					<linearGradient
						gradientUnits='userSpaceOnUse'
						id={gradientId}
						x1='20'
						x2='92'
						y1='82'
						y2='24'
					>
						<stop offset='0%' stopColor='var(--donut-gradient-start)' />
						<stop offset='100%' stopColor='var(--donut-gradient-end)' />
					</linearGradient>
				</defs>
				<DonutTrack cx='56' cy='56' r={DONUT_RADIUS} />
				<DonutFill
					animate={{ strokeDashoffset: progressOffset }}
					className='donut-progress__fill'
					cx='56'
					cy='56'
					initial={{ strokeDashoffset: DONUT_CIRCUMFERENCE }}
					r={DONUT_RADIUS}
					stroke={`url(#${gradientId})`}
					strokeDasharray={DONUT_CIRCUMFERENCE}
					transition={{ duration: 0.8, ease: 'easeOut' }}
				/>
			</DonutSvg>
			<DonutCenter className='donut-progress__center'>
				<DonutValue
					animate={{ opacity: 1 }}
					initial={{ opacity: 0 }}
					transition={{ duration: 0.4 }}
				>
					{label}
				</DonutValue>
				{meta ? <DonutMeta>{meta}</DonutMeta> : null}
			</DonutCenter>
		</DonutShell>
	);
};

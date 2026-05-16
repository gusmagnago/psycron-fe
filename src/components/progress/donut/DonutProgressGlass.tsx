import { type CSSProperties, useCallback, useId, useRef } from 'react';
import { useCountUp } from '@psycron/hooks/useCountUp';

import {
	DonutCenter,
	DonutGlassDisc,
	DonutGlassFrame,
	DonutGlassHighlight,
	DonutMeta,
	DonutPercent,
	DonutSvg,
} from './DonutProgressGlass.styles';
import { progressGradient } from './donutSpectrum';

export interface DonutProgressGlassProps {
	disableParallax?: boolean;
	label?: string;
	meta?: string;
	size?: number;
	stroke?: number;
	value: number;
}

export const DonutProgressGlass = ({
	disableParallax = false,
	label,
	meta,
	size = 180,
	stroke = 16,
	value,
}: DonutProgressGlassProps) => {
	const animated = useCountUp({ end: value });
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (animated / 100) * circumference;
	const { endColor, glow, startColor } = progressGradient(animated);
	const id = useId().replace(/:/g, '');
	const gradientId = `donut-glass-gradient-${id}`;
	const filterId = `donut-glass-filter-${id}`;
	const frameRef = useRef<HTMLDivElement>(null);
	const frameStyle = {
		'--donut-glow': glow,
		height: size,
		width: size,
	} as CSSProperties;

	const handleMove = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (disableParallax) return;

			const element = frameRef.current;
			if (!element) return;

			const rect = element.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width - 0.5;
			const y = (event.clientY - rect.top) / rect.height - 0.5;

			element.style.setProperty('--donut-rx', `${-y * 12}deg`);
			element.style.setProperty('--donut-ry', `${x * 14}deg`);
			element.style.setProperty('--donut-sx', `${x * 18}px`);
			element.style.setProperty('--donut-sy', `${y * 18}px`);
		},
		[disableParallax]
	);

	const handleLeave = useCallback(() => {
		const element = frameRef.current;
		if (!element) return;

		element.style.setProperty('--donut-rx', '0deg');
		element.style.setProperty('--donut-ry', '0deg');
		element.style.setProperty('--donut-sx', '0px');
		element.style.setProperty('--donut-sy', '0px');
	}, []);

	return (
		<DonutGlassFrame
			aria-label={`${Math.round(animated)}%`}
			onMouseLeave={handleLeave}
			onMouseMove={handleMove}
			ref={frameRef}
			role='img'
			style={frameStyle}
		>
			<DonutGlassDisc />
			<DonutSvg viewBox={`0 0 ${size} ${size}`}>
				<defs>
					<linearGradient
						gradientUnits='userSpaceOnUse'
						id={gradientId}
						x1={size * 0.15}
						x2={size * 0.85}
						y1={size * 0.85}
						y2={size * 0.15}
					>
						<stop offset='0%' stopColor={startColor} />
						<stop offset='100%' stopColor={endColor} />
					</linearGradient>
					<filter height='200%' id={filterId} width='200%' x='-50%' y='-50%'>
						<feGaussianBlur result='blurred' stdDeviation='5' />
						<feMerge>
							<feMergeNode in='blurred' />
							<feMergeNode in='SourceGraphic' />
						</feMerge>
					</filter>
				</defs>

				<circle
					cx={size / 2}
					cy={size / 2}
					fill='none'
					r={radius}
					stroke='rgba(6, 11, 14, 0.05)'
					strokeWidth={stroke}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					fill='none'
					filter={`url(#${filterId})`}
					r={radius}
					stroke={`url(#${gradientId})`}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap='round'
					strokeWidth={stroke}
					style={{
						transition: 'stroke-dashoffset 900ms cubic-bezier(.2,.7,.2,1)',
					}}
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>
			</DonutSvg>
			<DonutGlassHighlight />
			<DonutCenter>
				<DonutPercent>{label ?? `${Math.round(animated)}%`}</DonutPercent>
				{meta ? <DonutMeta>{meta}</DonutMeta> : null}
			</DonutCenter>
		</DonutGlassFrame>
	);
};

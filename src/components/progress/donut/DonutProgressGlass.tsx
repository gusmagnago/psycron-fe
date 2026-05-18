import { useCallback, useRef } from 'react';
import { useCountUp } from '@psycron/hooks/useCountUp';

import {
	DonutCenter,
	DonutGlassFrame,
	DonutMeta,
	DonutPercent,
	DonutProgress,
} from './DonutProgressGlass.styles';
import type { DonutFrameStyle, DonutProgressGlassProps } from './DonutProgressGlass.types';
import { PROGRESS_STOPS, sampleStops, toThickness } from './donutSpectrum';

export type { DonutProgressGlassProps };

export const DonutProgressGlass = ({
	disableParallax = false,
	label,
	meta,
	size = 180,
	stroke = 16,
	value,
}: DonutProgressGlassProps) => {
	const animated = useCountUp({ end: value });
	const frameRef = useRef<HTMLDivElement>(null);

	const frameStyle: DonutFrameStyle = {
		'--donut-label-font': `${Math.round(size * 0.2)}px`,
		'--donut-meta-font': `${Math.round(size * 0.115)}px`,
		'--donut-progress-color': sampleStops(PROGRESS_STOPS, animated / 100),
		height: size,
		width: size,
	};

	const handleMove = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (disableParallax) return;
			const el = frameRef.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width - 0.5;
			const y = (event.clientY - rect.top) / rect.height - 0.5;
			el.style.setProperty('--donut-rx', `${-y * 12}deg`);
			el.style.setProperty('--donut-ry', `${x * 14}deg`);
		},
		[disableParallax]
	);

	const handleLeave = useCallback(() => {
		const el = frameRef.current;
		if (!el) return;
		el.style.setProperty('--donut-rx', '0deg');
		el.style.setProperty('--donut-ry', '0deg');
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
			<DonutProgress
				enableTrackSlot
				size={size}
				thickness={toThickness(stroke, size)}
				value={animated}
				variant='determinate'
			/>

			<DonutCenter>
				<DonutPercent>{label ?? `${Math.round(animated)}%`}</DonutPercent>
				{meta ? <DonutMeta>{meta}</DonutMeta> : null}
			</DonutCenter>
		</DonutGlassFrame>
	);
};

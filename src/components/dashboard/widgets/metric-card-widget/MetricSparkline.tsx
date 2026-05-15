import type { SparklinePoint } from './MetricCardWidget.types';

export const MetricSparkline = ({ points }: { points: SparklinePoint[] }) => {
	if (points.length < 2) return null;

	const max = Math.max(...points.map((point) => point.value), 1);
	const width = 80;
	const height = 36;
	const step = width / (points.length - 1);
	const coordinates = points.map((point, index) => ({
		x: index * step,
		y: height - (point.value / max) * height,
	}));
	const path = coordinates
		.map(
			(coordinate, index) =>
				`${index === 0 ? 'M' : 'L'}${coordinate.x.toFixed(1)},${coordinate.y.toFixed(1)}`
		)
		.join(' ');

	return (
		<svg
			aria-hidden='true'
			fill='none'
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			width={width}
		>
			<path
				d={path}
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
			/>
		</svg>
	);
};

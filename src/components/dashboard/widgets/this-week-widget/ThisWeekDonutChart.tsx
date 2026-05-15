import { palette } from '@psycron/theme/palette/palette.theme';

const SIZE = 100;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const THIS_WEEK_COLORS = {
	blocked: palette.alert.main,
	cancelled: palette.error.main,
	completed: palette.success.main,
	upcoming: palette.primary.main,
} as const;

export const ThisWeekDonutChart = ({
	blocked,
	cancelled,
	completed,
	upcoming,
}: {
	blocked: number;
	cancelled: number;
	completed: number;
	upcoming: number;
}) => {
	const total = completed + upcoming + cancelled + blocked || 1;
	const segments = [
		{ key: 'completed', value: completed, color: THIS_WEEK_COLORS.completed },
		{ key: 'upcoming', value: upcoming, color: THIS_WEEK_COLORS.upcoming },
		{ key: 'cancelled', value: cancelled, color: THIS_WEEK_COLORS.cancelled },
		{ key: 'blocked', value: blocked, color: THIS_WEEK_COLORS.blocked },
	];

	let offset = 0;

	return (
		<svg
			aria-hidden='true'
			height={SIZE}
			viewBox={`0 0 ${SIZE} ${SIZE}`}
			width={SIZE}
		>
			<circle
				cx={SIZE / 2}
				cy={SIZE / 2}
				fill='none'
				r={RADIUS}
				stroke={palette.gray['01']}
				strokeWidth={STROKE}
			/>
			{segments.map(({ color, key, value }) => {
				const dash = (value / total) * CIRCUMFERENCE;
				const gap = CIRCUMFERENCE - dash;
				const rotation = (offset / total) * 360 - 90;
				offset += value;
				return (
					<circle
						cx={SIZE / 2}
						cy={SIZE / 2}
						fill='none'
						key={key}
						r={RADIUS}
						stroke={color}
						strokeDasharray={`${dash} ${gap}`}
						strokeLinecap='round'
						strokeWidth={STROKE}
						transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}
					/>
				);
			})}
		</svg>
	);
};

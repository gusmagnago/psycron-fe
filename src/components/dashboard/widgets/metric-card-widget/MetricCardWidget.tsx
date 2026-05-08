import { Skeleton } from '@mui/material';
import { Avatar as MUIAvatar } from '@mui/material';
import { useCountUp } from '@psycron/hooks/useCountUp';
import { TrendingDown, TrendingUp } from 'lucide-react';

import {
	AvatarStack,
	DeltaChip,
	MetricBottomRow,
	MetricIconBadge,
	MetricLabel,
	MetricRoot,
	MetricSubLabel,
	MetricTopRow,
	MetricValue,
	OverflowBadge,
	SparklineWrapper,
} from './MetricCardWidget.styles';
import type { MetricCardWidgetProps, SparklinePoint } from './MetricCardWidget.types';

const MAX_AVATARS = 5;

const stringToColor = (s: string): string => {
	let hash = 0;
	for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
	let color = '#';
	for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
	return color;
};

const Sparkline = ({ points }: { points: SparklinePoint[] }) => {
	if (points.length < 2) return null;
	const max = Math.max(...points.map((p) => p.value), 1);
	const w = 80;
	const h = 36;
	const step = w / (points.length - 1);
	const coords = points.map((p, i) => ({
		x: i * step,
		y: h - (p.value / max) * h,
	}));
	const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

	return (
		<svg aria-hidden='true' fill='none' height={h} viewBox={`0 0 ${w} ${h}`} width={w}>
			<path d={d} stroke='#00C777' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
		</svg>
	);
};

export const MetricCardWidget = ({
	avatars,
	delta,
	deltaLabel,
	icon,
	isLoading,
	label,
	prefix = '',
	sparkline,
	subLabel,
	suffix = '',
	value,
}: MetricCardWidgetProps) => {
	const animatedValue = useCountUp({ end: value });

	if (isLoading) {
		return (
			<MetricRoot>
				<Skeleton height={36} width={36} variant='rectangular' sx={{ borderRadius: 2 }} />
				<Skeleton height={44} width='55%' />
				<Skeleton height={16} width='40%' />
			</MetricRoot>
		);
	}

	const isDeltaPositive = (delta ?? 0) >= 0;
	const visibleAvatars = avatars?.slice(0, MAX_AVATARS) ?? [];
	const overflow = (avatars?.length ?? 0) - MAX_AVATARS;

	return (
		<MetricRoot>
			<MetricTopRow>
				{icon ? <MetricIconBadge>{icon}</MetricIconBadge> : null}
				{delta !== undefined ? (
					<DeltaChip
						aria-label={`${delta > 0 ? '+' : ''}${delta}% ${deltaLabel ?? ''}`}
						isPositive={isDeltaPositive}
					>
						{isDeltaPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
						{delta > 0 ? '+' : ''}
						{delta}%
					</DeltaChip>
				) : null}
			</MetricTopRow>

			<MetricValue
				animate={{ opacity: 1 }}
				initial={{ opacity: 0 }}
				transition={{ duration: 0.4 }}
			>
				{prefix}
				{animatedValue.toLocaleString()}
				{suffix}
			</MetricValue>

			<MetricLabel>{label}</MetricLabel>

			{subLabel ? <MetricSubLabel>{subLabel}</MetricSubLabel> : null}

			<MetricBottomRow>
				{visibleAvatars.length > 0 && (
					<AvatarStack>
						{visibleAvatars.map((av, i) => {
							const name = `${av.firstName} ${av.lastName}`;
							return (
								<MUIAvatar
									alt={name}
									key={av.id}
									sx={{
										bgcolor: stringToColor(name),
										border: '2px solid #fff',
										fontSize: 11,
										fontWeight: 700,
										height: 28,
										marginLeft: i === 0 ? 0 : '-8px',
										width: 28,
									}}
								>
									{av.firstName[0]}
									{av.lastName[0]}
								</MUIAvatar>
							);
						})}
						{overflow > 0 && <OverflowBadge>+{overflow}</OverflowBadge>}
					</AvatarStack>
				)}

				{sparkline && sparkline.length > 1 && (
					<SparklineWrapper>
						<Sparkline points={sparkline} />
					</SparklineWrapper>
				)}
			</MetricBottomRow>
		</MetricRoot>
	);
};

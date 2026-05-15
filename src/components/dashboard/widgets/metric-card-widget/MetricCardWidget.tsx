import { Skeleton } from '@mui/material';
import { Avatar as MUIAvatar } from '@mui/material';
import { ChevronDown, ChevronUp } from '@psycron/components/icons';
import { useCountUp } from '@psycron/hooks/useCountUp';

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
import type { MetricCardWidgetProps } from './MetricCardWidget.types';
import { MetricSparkline } from './MetricSparkline';

const MAX_AVATARS = 5;

const stringToColor = (s: string): string => {
	let hash = 0;
	for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
	let color = '#';
	for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
	return color;
};

export const MetricCardWidget = ({
	avatars,
	delta,
	deltaLabel,
	icon,
	isLoading,
	label,
	onClick,
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
		<MetricRoot
			isInteractive={Boolean(onClick)}
			onClick={onClick}
			onKeyDown={(event) => {
				if (!onClick) return;
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					onClick();
				}
			}}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			<MetricTopRow>
				{icon ? <MetricIconBadge>{icon}</MetricIconBadge> : null}
				{delta !== undefined ? (
					<DeltaChip
						aria-label={`${delta > 0 ? '+' : ''}${delta}% ${deltaLabel ?? ''}`}
						isPositive={isDeltaPositive}
					>
						{isDeltaPositive ? (
							<ChevronUp height={11} width={11} />
						) : (
							<ChevronDown height={11} width={11} />
						)}
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
						<MetricSparkline points={sparkline} />
					</SparklineWrapper>
				)}
			</MetricBottomRow>
		</MetricRoot>
	);
};

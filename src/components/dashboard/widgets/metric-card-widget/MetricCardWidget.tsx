import { useCallback } from 'react';
import { Skeleton } from '@mui/material';
import { ChevronDown, ChevronUp } from '@psycron/components/icons';
import { useCountUp } from '@psycron/hooks/useCountUp';
import { stringToColor } from '@psycron/utils/patient/patient.utils';

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
	StyledAvatar,
} from './MetricCardWidget.styles';
import type { MetricCardWidgetProps } from './MetricCardWidget.types';
import { MetricSparkline } from './MetricSparkline';

const MAX_AVATARS = 5;


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

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (!onClick) return;
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onClick();
			}
		},
		[onClick]
	);

	if (isLoading) {
		return (
			<MetricRoot>
				<Skeleton height={36} sx={{ borderRadius: 2 }} variant='rectangular' width={36} />
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
			onKeyDown={handleKeyDown}
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
						{isDeltaPositive ? <ChevronUp /> : <ChevronDown />}
						{delta > 0 ? '+' : ''}
						{delta}%
					</DeltaChip>
				) : null}
			</MetricTopRow>

			<MetricValue animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.4 }}>
				{prefix}
				{animatedValue.toLocaleString()}
				{suffix}
			</MetricValue>

			<MetricLabel>{label}</MetricLabel>

			{subLabel ? <MetricSubLabel>{subLabel}</MetricSubLabel> : null}

			<MetricBottomRow>
				{visibleAvatars.length > 0 && (
					<AvatarStack>
						{visibleAvatars.map((av) => {
							const name = `${av.firstName} ${av.lastName}`;
							return (
								<StyledAvatar alt={name} avatarColor={stringToColor(name)} key={av.id}>
									{av.firstName[0]}
									{av.lastName[0]}
								</StyledAvatar>
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

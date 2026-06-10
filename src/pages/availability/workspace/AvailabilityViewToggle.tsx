import {
	ViewToggleButton,
	ViewToggleGroup,
} from './AvailabilityViewToggle.styles';
import type {
	AvailabilityViewMode,
	AvailabilityViewToggleProps,
} from './AvailabilityViewToggle.types';

const VIEW_MODES: AvailabilityViewMode[] = ['day', 'week'];

export const AvailabilityViewToggle = ({
	dayLabel,
	onChange,
	value,
	viewModeLabel,
	weekLabel,
}: AvailabilityViewToggleProps) => {
	const labels: Record<AvailabilityViewMode, string> = {
		day: dayLabel,
		week: weekLabel,
	};

	return (
		<ViewToggleGroup
			aria-label={viewModeLabel}
			data-testid='availability-view-toggle'
			id='availability-view-toggle'
			role='group'
		>
			{VIEW_MODES.map((viewMode) => (
				<ViewToggleButton
					aria-pressed={value === viewMode}
					data-testid={`availability-view-${viewMode}-tab`}
					id={`availability-view-${viewMode}-tab`}
					isActive={value === viewMode}
					key={viewMode}
					onClick={() => onChange(viewMode)}
					type='button'
				>
					{labels[viewMode]}
				</ViewToggleButton>
			))}
		</ViewToggleGroup>
	);
};

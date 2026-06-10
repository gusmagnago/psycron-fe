import {
	LegendGroup,
	LegendItem,
	LegendLabel,
	LegendSwatch,
} from './AvailabilityLegend.styles';
import type { AvailabilityLegendItem } from './AvailabilityLegend.types';

interface AvailabilityLegendProps {
	items: AvailabilityLegendItem[];
}

export const AvailabilityLegend = ({ items }: AvailabilityLegendProps) => (
	<LegendGroup id='availability-legend' aria-label='Availability legend'>
		{items.map(({ borderColor, borderSide, color, label, opacity }) => (
			<LegendItem
				key={label}
				id={`legend-item-${label.toLowerCase().replace(/\s+/g, '-')}`}
			>
				<LegendSwatch
					color={color}
					borderColor={borderColor}
					borderSide={borderSide}
					swatchOpacity={opacity}
				/>
				<LegendLabel>{label}</LegendLabel>
			</LegendItem>
		))}
	</LegendGroup>
);

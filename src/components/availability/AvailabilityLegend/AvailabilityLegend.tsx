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
	<LegendGroup>
		{items.map(({ borderColor, color, label, opacity }) => (
			<LegendItem key={label}>
				<LegendSwatch
					color={color}
					borderColor={borderColor}
					swatchOpacity={opacity}
				/>
				<LegendLabel>{label}</LegendLabel>
			</LegendItem>
		))}
	</LegendGroup>
);

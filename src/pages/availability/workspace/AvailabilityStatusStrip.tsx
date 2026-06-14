import {
	StatusBadge,
	StatusDescription,
	StatusLine,
	StatusList,
	StatusMark,
	StatusTitle,
	WorkspaceSectionLabel,
} from './AvailabilityStatusStrip.styles';
import type { AvailabilityStatusStripProps } from './AvailabilityStatusStrip.types';

export const AvailabilityStatusStrip = ({
	items,
	title,
}: AvailabilityStatusStripProps) => (
	<section
		aria-labelledby='availability-status-strip-title'
		data-testid='availability-status-strip'
		id='availability-status-strip'
	>
		<WorkspaceSectionLabel id='availability-status-strip-title'>
			{title}
		</WorkspaceSectionLabel>
		<StatusList>
			{items.map((item) => (
				<StatusLine
					data-testid={`availability-status-${item.id}`}
					id={`availability-status-${item.id}`}
					key={item.id}
				>
					<StatusMark aria-hidden='true' tone={item.tone}>
						{item.icon}
					</StatusMark>
					<div>
						<StatusTitle>{item.title}</StatusTitle>
						<StatusDescription>{item.description}</StatusDescription>
					</div>
					<StatusBadge tone={item.tone}>{item.badge}</StatusBadge>
				</StatusLine>
			))}
		</StatusList>
	</section>
);

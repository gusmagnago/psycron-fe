import type { AvailabilitySourceListProps } from './AvailabilitySourceList.types';
import {
	StatusBadge,
	StatusDescription,
	StatusLine,
	StatusList,
	StatusMark,
	StatusTitle,
	WorkspaceSectionLabel,
} from './AvailabilityStatusStrip.styles';

export const AvailabilitySourceList = ({
	items,
	title,
}: AvailabilitySourceListProps) => (
	<section
		aria-labelledby='availability-source-list-title'
		data-testid='availability-source-list'
		id='availability-source-list'
	>
		<WorkspaceSectionLabel id='availability-source-list-title'>
			{title}
		</WorkspaceSectionLabel>
		<StatusList>
			{items.map((item) => (
				<StatusLine
					data-testid={`availability-source-${item.id}`}
					id={`availability-source-${item.id}`}
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

import { CheckSuccess, Google, Info, TriangleAlert } from '@psycron/components/icons';

import { StatusNoteWrapper } from './StatusNote.styles';
import type { StatusNoteProps, StatusNoteType } from './StatusNote.types';

const statusIcons: Record<StatusNoteType, typeof Info> = {
	google: Google,
	info: Info,
	success: CheckSuccess,
	warning: TriangleAlert,
};

export const StatusNote = ({
	id,
	testId,
	text,
	type = 'info',
}: StatusNoteProps) => {
	const Icon = statusIcons[type];

	return (
		<StatusNoteWrapper
			data-testid={testId}
			id={id}
			noteType={type}
			role={type === 'warning' ? 'alert' : 'note'}
		>
			<span aria-hidden='true'>
				<Icon />
			</span>
			<span>{text}</span>
		</StatusNoteWrapper>
	);
};

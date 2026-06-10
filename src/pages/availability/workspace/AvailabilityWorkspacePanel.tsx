import { useEffect } from 'react';
import {
	ChevronLeft,
	ChevronRight,
} from '@psycron/components/icons';

import {
	WorkspacePanelBody,
	WorkspacePanelClose,
	WorkspacePanelHeader,
	WorkspacePanelRoot,
	WorkspacePanelSubtitle,
	WorkspacePanelTitle,
} from './AvailabilityWorkspacePanel.styles';
import type { AvailabilityWorkspacePanelProps } from './AvailabilityWorkspacePanel.types';

export const AvailabilityWorkspacePanel = ({
	ariaLabel,
	children,
	closeLabel,
	id,
	isOpen,
	onClose,
	panelRef,
	side,
	subtitle,
	testId,
	title,
}: AvailabilityWorkspacePanelProps) => {
	const titleId = `${id}-title`;

	useEffect(() => {
		panelRef.current?.toggleAttribute('inert', !isOpen);
	}, [isOpen, panelRef]);

	return (
		<WorkspacePanelRoot
			aria-hidden={!isOpen}
			aria-label={ariaLabel}
			data-testid={testId}
			id={id}
			isOpen={isOpen}
			ref={panelRef}
			side={side}
		>
			<WorkspacePanelHeader>
				<div>
					<WorkspacePanelTitle id={titleId}>{title}</WorkspacePanelTitle>
					{subtitle ? (
						<WorkspacePanelSubtitle>{subtitle}</WorkspacePanelSubtitle>
					) : null}
				</div>
				<WorkspacePanelClose
					aria-controls={id}
					aria-label={closeLabel}
					data-testid={`${testId}-close`}
					id={`${id}-close`}
					onClick={onClose}
					type='button'
				>
					{side === 'left' ? <ChevronLeft /> : <ChevronRight />}
				</WorkspacePanelClose>
			</WorkspacePanelHeader>
			<WorkspacePanelBody>{children}</WorkspacePanelBody>
		</WorkspacePanelRoot>
	);
};

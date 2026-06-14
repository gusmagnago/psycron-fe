import { useEffect } from 'react';
import { ChevronRight } from '@psycron/components/icons';

import {
	WorkspacePanelBody,
	WorkspacePanelClose,
	WorkspacePanelHeader,
	WorkspacePanelRoot,
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
	testId,
	title,
}: AvailabilityWorkspacePanelProps) => {
	const titleId = `${id}-title`;
	const headerId = `${id}-header`;
	const bodyId = `${id}-body`;
	const closeId = `${id}-close`;

	useEffect(() => {
		panelRef.current?.toggleAttribute('inert', !isOpen);
	}, [isOpen, panelRef]);

	return (
		<WorkspacePanelRoot
			aria-hidden={!isOpen}
			aria-label={ariaLabel}
			aria-labelledby={titleId}
			data-testid={testId}
			id={id}
			isOpen={isOpen}
			ref={panelRef}
		>
			<WorkspacePanelHeader data-testid={`${testId}-header`} id={headerId}>
				<WorkspacePanelClose
					aria-controls={id}
					aria-label={closeLabel}
					data-testid={`${testId}-close`}
					id={closeId}
					onClick={onClose}
					type='button'
				>
					<ChevronRight aria-hidden='true' />
				</WorkspacePanelClose>
				<WorkspacePanelTitle data-testid={`${testId}-title`} id={titleId}>
					{title}
				</WorkspacePanelTitle>
			</WorkspacePanelHeader>
			<WorkspacePanelBody data-testid={`${testId}-body`} id={bodyId}>
				{children}
			</WorkspacePanelBody>
		</WorkspacePanelRoot>
	);
};

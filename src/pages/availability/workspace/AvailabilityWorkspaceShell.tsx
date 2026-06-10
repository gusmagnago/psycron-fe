import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from '@psycron/components/icons';
import { Loader } from '@psycron/components/loader/Loader';
import useViewport from '@psycron/hooks/useViewport';

import { AvailabilityWorkspaceHeader } from './AvailabilityWorkspaceHeader';
import { AvailabilityWorkspacePanel } from './AvailabilityWorkspacePanel';
import {
	SkipLink,
	WorkspaceEdgeToggle,
	WorkspaceFrame,
	WorkspaceLoaderRegion,
	WorkspaceMain,
	WorkspaceMainContent,
	WorkspaceRoot,
	WorkspaceScrim,
} from './AvailabilityWorkspaceShell.styles';
import type {
	AvailabilityWorkspacePanelSide,
	AvailabilityWorkspaceShellHandle,
	AvailabilityWorkspaceShellProps,
} from './AvailabilityWorkspaceShell.types';

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

export const AvailabilityWorkspaceShell = forwardRef<
	AvailabilityWorkspaceShellHandle,
	AvailabilityWorkspaceShellProps
>(
	(
		{
			actions,
			children,
			contentMode = 'calendar',
			footer,
			isLoading = false,
			leftPanel,
			rightPanel,
			subtitle,
			title,
			viewbar,
		},
		ref
	) => {
		const { t } = useTranslation();
		const { isSmallerThanTablet } = useViewport();
		const [openPanel, setOpenPanel] =
			useState<AvailabilityWorkspacePanelSide | null>(null);
		const leftPanelRef = useRef<HTMLElement>(null);
		const rightPanelRef = useRef<HTMLElement>(null);
		const leftToggleRef = useRef<HTMLButtonElement>(null);
		const rightToggleRef = useRef<HTMLButtonElement>(null);

		const isLeftOpen = openPanel === 'left';
		const isRightOpen = openPanel === 'right';
		const isAnyPanelOpen = openPanel !== null;

		const getPanelElement = useCallback(
			(side: AvailabilityWorkspacePanelSide): HTMLElement | null =>
				side === 'left' ? leftPanelRef.current : rightPanelRef.current,
			[]
		);

		const focusToggle = useCallback(
			(side: AvailabilityWorkspacePanelSide): void => {
				const toggle =
					side === 'left' ? leftToggleRef.current : rightToggleRef.current;
				toggle?.focus();
			},
			[]
		);

		const closePanel = useCallback(
			(shouldReturnFocus = true): void => {
				const side = openPanel;
				setOpenPanel(null);
				if (side && shouldReturnFocus) {
					window.requestAnimationFrame(() => focusToggle(side));
				}
			},
			[focusToggle, openPanel]
		);

		const togglePanel = (side: AvailabilityWorkspacePanelSide): void => {
			setOpenPanel((current) => (current === side ? null : side));
		};

		useImperativeHandle(
			ref,
			() => ({
				openRightPanel: () => setOpenPanel('right'),
			}),
			[]
		);

		useEffect(() => {
			if (!openPanel) return;

			const handleKeyDown = (event: KeyboardEvent): void => {
				if (event.key === 'Escape') {
					closePanel();
					return;
				}

				if (!isSmallerThanTablet || event.key !== 'Tab') return;

				const panel = getPanelElement(openPanel);
				if (!panel) return;

				const focusableElements = Array.from(
					panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
				).filter((element) => !element.hasAttribute('disabled'));

				if (focusableElements.length === 0) return;

				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];

				if (event.shiftKey && document.activeElement === firstElement) {
					event.preventDefault();
					lastElement.focus();
				}

				if (!event.shiftKey && document.activeElement === lastElement) {
					event.preventDefault();
					firstElement.focus();
				}
			};

			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}, [closePanel, getPanelElement, isSmallerThanTablet, openPanel]);

		useEffect(() => {
			if (!openPanel || !isSmallerThanTablet) return;

			const panel = getPanelElement(openPanel);
			if (!panel) return;

			const frameId = window.requestAnimationFrame(() => {
				const firstFocusable =
					panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
				firstFocusable?.focus();
			});

			return () => window.cancelAnimationFrame(frameId);
		}, [getPanelElement, isSmallerThanTablet, openPanel]);

		return (
			<WorkspaceRoot
				data-testid='availability-page-root'
				id='availability-page-root'
			>
				<SkipLink href='#availability-calendar-grid'>
					{t('availability.workspace.skip-calendar')}
				</SkipLink>
				<WorkspaceFrame
					aria-label={t('availability.workspace.workspace-label')}
					data-testid='availability-workspace'
					id='availability-workspace'
				>
					<WorkspaceEdgeToggle
						aria-controls='availability-left-sidebar'
						aria-expanded={isLeftOpen}
						aria-label={t(
							isLeftOpen
								? 'availability.workspace.close-controls'
								: 'availability.workspace.open-controls'
						)}
						data-testid='availability-left-sidebar-toggle'
						id='availability-left-sidebar-toggle'
						isAnyPanelOpen={isAnyPanelOpen}
						onClick={() => togglePanel('left')}
						panelSide='left'
						ref={leftToggleRef}
						type='button'
					>
						<ChevronRight />
					</WorkspaceEdgeToggle>
					<WorkspaceScrim
						aria-hidden='true'
						data-testid='availability-drawer-scrim'
						id='availability-drawer-scrim'
						isVisible={isAnyPanelOpen}
						onClick={() => closePanel()}
						tabIndex={-1}
						type='button'
					/>
					<WorkspaceEdgeToggle
						aria-controls='availability-right-sidebar'
						aria-expanded={isRightOpen}
						aria-label={t(
							isRightOpen
								? 'availability.workspace.close-readiness'
								: 'availability.workspace.open-readiness'
						)}
						data-testid='availability-right-sidebar-toggle'
						id='availability-right-sidebar-toggle'
						isAnyPanelOpen={isAnyPanelOpen}
						onClick={() => togglePanel('right')}
						panelSide='right'
						ref={rightToggleRef}
						type='button'
					>
						<ChevronLeft />
					</WorkspaceEdgeToggle>
					<AvailabilityWorkspacePanel
						ariaLabel={t('availability.workspace.controls-label')}
						closeLabel={t('availability.workspace.close-controls')}
						id='availability-left-sidebar'
						isOpen={isLeftOpen}
						panelRef={leftPanelRef}
						side='left'
						testId='availability-left-sidebar'
						title={t('availability.workspace.left-panel-title')}
						onClose={() => closePanel()}
					>
						{leftPanel}
					</AvailabilityWorkspacePanel>
					<WorkspaceMain
						aria-labelledby='availability-page-title'
						data-testid='availability-main'
						id='availability-main'
					>
						<AvailabilityWorkspaceHeader
							actions={actions}
							actionsLabel={t('availability.workspace.actions-label')}
							subtitle={subtitle}
							title={title}
						/>
						{viewbar}
						<WorkspaceMainContent
							contentMode={contentMode}
							id='availability-main-content'
						>
							{isLoading ? (
								<WorkspaceLoaderRegion
									id='availability-main-loader'
									data-testid='availability-main-loader'
								>
									<Loader />
								</WorkspaceLoaderRegion>
							) : (
								children
							)}
						</WorkspaceMainContent>
						{footer}
					</WorkspaceMain>
					<AvailabilityWorkspacePanel
						ariaLabel={t('availability.workspace.readiness-label')}
						closeLabel={t('availability.workspace.close-readiness')}
						id='availability-right-sidebar'
						isOpen={isRightOpen}
						panelRef={rightPanelRef}
						side='right'
						subtitle={t('availability.workspace.right-panel-subtitle')}
						testId='availability-right-sidebar'
						title={t('availability.workspace.right-panel-title')}
						onClose={() => closePanel()}
					>
						{rightPanel}
					</AvailabilityWorkspacePanel>
				</WorkspaceFrame>
			</WorkspaceRoot>
		);
	}
);

AvailabilityWorkspaceShell.displayName = 'AvailabilityWorkspaceShell';

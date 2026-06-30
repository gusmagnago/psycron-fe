import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from '@psycron/components/icons';
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
			onPanelOpenChange,
			panel,
			subtitle,
			title,
			viewbar,
		},
		ref
	) => {
		const { t } = useTranslation();
		const { isSmallerThanTablet } = useViewport();
		const [isPanelOpen, setIsPanelOpen] = useState(false);
		const panelRef = useRef<HTMLElement>(null);
		const toggleRef = useRef<HTMLButtonElement>(null);

		const focusToggle = useCallback((): void => {
			toggleRef.current?.focus();
		}, []);

		const closePanel = useCallback(
			(shouldReturnFocus = true): void => {
				setIsPanelOpen(false);
				if (shouldReturnFocus) {
					window.requestAnimationFrame(() => focusToggle());
				}
			},
			[focusToggle]
		);

		const togglePanel = (): void => {
			setIsPanelOpen((current) => !current);
		};

		useImperativeHandle(
			ref,
			() => ({
				openPanel: () => setIsPanelOpen(true),
			}),
			[]
		);

		useEffect(() => {
			onPanelOpenChange?.(isPanelOpen);
		}, [isPanelOpen, onPanelOpenChange]);

		useEffect(() => {
			if (!isPanelOpen) return;

			const handleKeyDown = (event: KeyboardEvent): void => {
				if (event.key === 'Escape') {
					closePanel();
					return;
				}

				if (!isSmallerThanTablet || event.key !== 'Tab') return;

				const panelElement = panelRef.current;
				if (!panelElement) return;

				const focusableElements = Array.from(
					panelElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
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
		}, [closePanel, isPanelOpen, isSmallerThanTablet]);

		useEffect(() => {
			if (!isPanelOpen || !isSmallerThanTablet) return;

			const panelElement = panelRef.current;
			if (!panelElement) return;

			const frameId = window.requestAnimationFrame(() => {
				const firstFocusable =
					panelElement.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
				firstFocusable?.focus();
			});

			return () => window.cancelAnimationFrame(frameId);
		}, [isPanelOpen, isSmallerThanTablet]);

		// The readiness sidebar (edge toggle + scrim + panel) belongs only to the
		// calendar scope — the strict /availability index. Keep it off settings
		// ('page') and the Jupiter onboarding conversation ('chat').
		const showReadinessPanel = Boolean(panel) && contentMode === 'calendar';

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
					{showReadinessPanel ? (
						<>
							<WorkspaceScrim
								aria-hidden='true'
								data-testid='availability-drawer-scrim'
								id='availability-drawer-scrim'
								isVisible={isPanelOpen}
								onClick={() => closePanel()}
								tabIndex={-1}
								type='button'
							/>
							<WorkspaceEdgeToggle
								aria-controls='availability-right-sidebar'
								aria-expanded={isPanelOpen}
								aria-label={t(
									isPanelOpen
										? 'availability.workspace.close-readiness'
										: 'availability.workspace.open-readiness'
								)}
								data-testid='availability-right-sidebar-toggle'
								id='availability-right-sidebar-toggle'
								isOwnPanelOpen={isPanelOpen}
								onClick={togglePanel}
								ref={toggleRef}
								type='button'
							>
								<ChevronLeft aria-hidden='true' />
							</WorkspaceEdgeToggle>
						</>
					) : null}
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
					{showReadinessPanel ? (
						<AvailabilityWorkspacePanel
							ariaLabel={t('availability.workspace.readiness-label')}
							closeLabel={t('availability.workspace.close-readiness')}
							id='availability-right-sidebar'
							isOpen={isPanelOpen}
							panelRef={panelRef}
							testId='availability-right-sidebar'
							title={t('availability.workspace.right-panel-title')}
							onClose={() => closePanel()}
						>
							{panel}
						</AvailabilityWorkspacePanel>
					) : null}
				</WorkspaceFrame>
			</WorkspaceRoot>
		);
	}
);

AvailabilityWorkspaceShell.displayName = 'AvailabilityWorkspaceShell';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { CloseButton } from '@psycron/components/button/close/CloseButton';

import { Divider } from '../divider/Divider';

import {
	DrawerActions,
	DrawerActionsSection,
	DrawerBackdrop,
	DrawerContent,
	DrawerHeader,
	DrawerPanel,
	DrawerTitle,
} from './Drawer.styles';
import type { IDrawer } from './Drawer.types';

export const Drawer = ({
	actions,
	ariaLabel,
	backdropId,
	backdropTestId,
	children,
	closeButtonId,
	closeButtonTestId,
	contentId,
	contentTestId,
	'data-testid': testId,
	headerExtra,
	onClose,
	title,
	id,
}: IDrawer) => {
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const drawerPanelRef = useRef<HTMLDivElement>(null);
	const onCloseRef = useRef(onClose);
	const restoreFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		restoreFocusRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		const previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		closeButtonRef.current?.focus();

		const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
			if (event.key === 'Escape') {
				event.preventDefault();
				onCloseRef.current();
				return;
			}

			if (event.key !== 'Tab' || !drawerPanelRef.current) return;

			const focusableElements = Array.from(
				drawerPanelRef.current.querySelectorAll<HTMLElement>(
					'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
				)
			);
			const firstElement = focusableElements.at(0);
			const lastElement = focusableElements.at(-1);
			if (!firstElement || !lastElement) return;

			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = previousBodyOverflow;
			restoreFocusRef.current?.focus();
		};
	}, []);

	return (
		<>
			<DrawerBackdrop
				aria-hidden='true'
				data-testid={backdropTestId}
				id={backdropId}
				onClick={onClose}
				role='presentation'
			/>
			<DrawerPanel
				aria-label={ariaLabel}
				aria-modal='true'
				data-testid={testId}
				id={id}
				ref={drawerPanelRef}
				role='dialog'
			>
				<DrawerHeader>
					<Box textAlign='left'>
						<DrawerTitle>{title}</DrawerTitle>
						{headerExtra}
					</Box>
					<CloseButton
						buttonId={closeButtonId}
						buttonTestId={closeButtonTestId}
						onClick={onClose}
						ref={closeButtonRef}
					/>
				</DrawerHeader>
				<DrawerContent
					data-testid={contentTestId}
					id={contentId}
				>
					{children}
				</DrawerContent>
				{actions && (
					<DrawerActionsSection>
						<Divider />
						<DrawerActions>{actions}</DrawerActions>
					</DrawerActionsSection>
				)}
			</DrawerPanel>
		</>
	);
};

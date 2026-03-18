import { DrawerBackdrop, DrawerContent, DrawerPanel } from './Drawer.styles';
import type { IDrawer } from './Drawer.types';

export const Drawer = ({ ariaLabel, children, onClose }: IDrawer) => (
	<>
		<DrawerBackdrop onClick={onClose} role='presentation' aria-hidden='true' />
		<DrawerPanel role='dialog' aria-modal='true' aria-label={ariaLabel}>
			<DrawerContent>{children}</DrawerContent>
		</DrawerPanel>
	</>
);

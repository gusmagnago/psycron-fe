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
	children,
	headerExtra,
	onClose,
	title,
}: IDrawer) => (
	<>
		<DrawerBackdrop aria-hidden='true' onClick={onClose} role='presentation' />
		<DrawerPanel aria-label={ariaLabel} aria-modal='true' role='dialog'>
			<DrawerContent>
				<DrawerHeader>
					<Box textAlign='left'>
						<DrawerTitle>{title}</DrawerTitle>
						{headerExtra}
					</Box>
					<CloseButton onClick={onClose} />
				</DrawerHeader>
				{children}
				{actions && (
					<DrawerActionsSection>
						<Divider />
						<DrawerActions>{actions}</DrawerActions>
					</DrawerActionsSection>
				)}
			</DrawerContent>
		</DrawerPanel>
	</>
);

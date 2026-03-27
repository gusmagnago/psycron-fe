import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';

import { Drawer } from './Drawer';
import { DrawerBody, DrawerDesc } from './Drawer.styles';
import type { ISettingsDrawer } from './SettingsDrawer.types';

export const SettingsDrawer = ({
	ariaLabel,
	children,
	desc,
	isSaving,
	onClose,
	onSave,
	saveDisabled,
	saveLabel,
	showCancel,
	title,
}: ISettingsDrawer) => {
	const { t } = useTranslation();

	return (
		<Drawer
			ariaLabel={ariaLabel}
			onClose={onClose}
			title={title}
			actions={
				<>
					<Button
						disabled={isSaving || saveDisabled}
						fullWidth
						onClick={onSave}
						variant='contained'
					>
						{isSaving ? t('common.saving') : (saveLabel ?? t('common.save'))}
					</Button>
					{showCancel && (
						<Button fullWidth onClick={onClose} variant='outlined'>
							{t('common.cancel')}
						</Button>
					)}
				</>
			}
		>
			<DrawerBody>
				{desc && <DrawerDesc>{desc}</DrawerDesc>}
				{children}
			</DrawerBody>
		</Drawer>
	);
};

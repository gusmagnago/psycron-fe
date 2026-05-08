import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Check, Settings } from 'lucide-react';

import {
	BannerRow,
	ControlsBar,
	CustomizeButton,
	EditModeBanner,
	ResetButton,
} from './CustomizeControl.styles';
import type { CustomizeControlProps } from './CustomizeControl.types';

const bannerVariants = {
	hidden: { height: 0, opacity: 0, y: -8 },
	visible: { height: 'auto', opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
	exit: { height: 0, opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const CustomizeControl = ({
	isCustomizing,
	onReset,
	onToggle,
}: CustomizeControlProps) => {
	const { t } = useTranslation();

	return (
		<>
			<ControlsBar>
				<CustomizeButton
					aria-label={
						isCustomizing
							? t('page.dashboard.customize.done')
							: t('page.dashboard.customize.open')
					}
					isActive={isCustomizing}
					onClick={() => onToggle(!isCustomizing)}
				>
					{isCustomizing ? <Check size={14} /> : <Settings size={14} />}
					{isCustomizing
						? t('page.dashboard.customize.done')
						: t('page.dashboard.customize.open')}
				</CustomizeButton>
			</ControlsBar>

			<AnimatePresence>
				{isCustomizing && (
					<EditModeBanner
						animate='visible'
						exit='exit'
						initial='hidden'
						variants={bannerVariants}
					>
						<BannerRow>
							<span>{t('page.dashboard.customize.hint')}</span>
							{onReset && (
								<ResetButton onClick={onReset}>
									{t('page.dashboard.customize.reset')}
								</ResetButton>
							)}
						</BannerRow>
					</EditModeBanner>
				)}
			</AnimatePresence>
		</>
	);
};

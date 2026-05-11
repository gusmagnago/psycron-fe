import { useTranslation } from 'react-i18next';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { AnimatePresence } from 'framer-motion';
import { Brush, Check } from 'lucide-react';

import {
	BannerRow,
	ControlsBar,
	CustomizeIconWrap,
	EditModeBanner,
	ResetButton,
} from './CustomizeControl.styles';
import type { CustomizeControlProps } from './CustomizeControl.types';

const bannerVariants = {
	hidden: { height: 0, opacity: 0, y: -8 },
	visible: {
		height: 'auto',
		opacity: 1,
		y: 0,
		transition: { duration: 0.25, ease: 'easeOut' },
	},
	exit: { height: 0, opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const CustomizeControl = ({
	isCustomizing,
	onReset,
	onToggle,
}: CustomizeControlProps) => {
	const { t } = useTranslation();

	const label = isCustomizing
		? t('page.dashboard.customize.done')
		: t('page.dashboard.customize.open');

	return (
		<>
			<ControlsBar>
				<Tooltip
					aria-label={label}
					onClick={() => onToggle(!isCustomizing)}
					placement='bottom'
					title={label}
				>
					<CustomizeIconWrap isActive={isCustomizing}>
						{isCustomizing ? <Check size={16} /> : <Brush size={16} />}
					</CustomizeIconWrap>
				</Tooltip>
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

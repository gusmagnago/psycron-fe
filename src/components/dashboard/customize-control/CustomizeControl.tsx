import { useTranslation } from 'react-i18next';
import { Settings } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { AnimatePresence } from 'framer-motion';

import {
	BannerRow,
	ControlsBar,
	CustomizeToggle,
	EditModeBanner,
	OrganizeButton,
	ResetButton,
} from './CustomizeControl.styles';
import type { CustomizeControlProps } from './CustomizeControl.types';

const bannerVariants = {
	hidden: { height: 0, opacity: 0, y: -8 },
	visible: {
		height: 'auto',
		opacity: 1,
		y: 0,
		transition: { bounce: 0.12, duration: 0.42, type: 'spring' },
	},
	exit: { height: 0, opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const CustomizeControl = ({
	isCustomizing,
	onOrganize,
	onReset,
	onToggle,
}: CustomizeControlProps) => {
	const { t } = useTranslation();

	const ariaLabel = isCustomizing
		? t('page.dashboard.customize.done')
		: t('page.dashboard.customize.open');
	const label = t('page.dashboard.customize.open');

	return (
		<>
			<ControlsBar>
				<Tooltip
					aria-label={ariaLabel}
					placement='bottom'
					title={ariaLabel}
				>
					<CustomizeToggle
						aria-pressed={isCustomizing}
						className='customize'
						onClick={() => onToggle(!isCustomizing)}
						type='button'
					>
						<Settings className='ic' />
						{label}
					</CustomizeToggle>
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
							<BannerRow>
								{onOrganize && (
									<OrganizeButton onClick={onOrganize}>
										{t('page.dashboard.customize.organize')}
									</OrganizeButton>
								)}
								{onReset && (
									<ResetButton onClick={onReset}>
										{t('page.dashboard.customize.reset')}
									</ResetButton>
								)}
							</BannerRow>
						</BannerRow>
					</EditModeBanner>
				)}
			</AnimatePresence>
		</>
	);
};

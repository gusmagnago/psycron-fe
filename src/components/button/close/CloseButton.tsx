import { useTranslation } from 'react-i18next';
import { Close } from '@psycron/components/icons/Close';

import { StyledCloseButton } from './CloseButton.styles';
import type { ICloseButtonProps } from './CloseButton.types';

export const CloseButton = ({ ariaLabel, onClick }: ICloseButtonProps) => {
	const { t } = useTranslation();

	return (
		<StyledCloseButton
			aria-label={ariaLabel ?? t('common.close')}
			onClick={onClick}
			secondary
			small
		>
			<Close />
		</StyledCloseButton>
	);
};

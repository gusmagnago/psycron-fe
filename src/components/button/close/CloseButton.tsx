import { useTranslation } from 'react-i18next';
import { Close } from '@psycron/components/icons/Close';

import { StyledCloseButton } from './CloseButton.styles';
import type { ICloseButtonProps } from './CloseButton.types';

export const CloseButton = ({
	ariaLabel,
	disabled,
	onClick,
}: ICloseButtonProps) => {
	const { t } = useTranslation();

	return (
		<StyledCloseButton
			aria-label={ariaLabel ?? t('common.close')}
			disabled={disabled}
			onClick={onClick}
			tertiary
			small
		>
			<Close />
		</StyledCloseButton>
	);
};

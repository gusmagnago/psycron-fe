import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Close } from '@psycron/components/icons/Close';

import { StyledCloseButton } from './CloseButton.styles';
import type { ICloseButtonProps } from './CloseButton.types';

export const CloseButton = forwardRef<HTMLButtonElement, ICloseButtonProps>(
	(
		{ ariaLabel, buttonId, buttonTestId, disabled, onClick }: ICloseButtonProps,
		ref
	) => {
		const { t } = useTranslation();

		return (
			<StyledCloseButton
				aria-label={ariaLabel ?? t('common.close')}
				data-testid={buttonTestId}
				disabled={disabled}
				id={buttonId}
				onClick={onClick}
				ref={ref}
				tertiary
				small
			>
				<Close />
			</StyledCloseButton>
		);
	}
);

CloseButton.displayName = 'CloseButton';

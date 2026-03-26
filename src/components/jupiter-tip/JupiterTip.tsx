import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { CloseButton } from '@psycron/components/button/close/CloseButton';
import { Jupiter } from '@psycron/components/icons';

import {
	JupiterIconWrapper,
	JupiterTipContent,
	JupiterTipRoot,
	JupiterTipText,
	JupiterTipTitle,
} from './JupiterTip.styles';
import type { IJupiterTip } from './JupiterTip.types';

export const JupiterTip = ({
	actionLabel,
	ariaLabel,
	onAction,
	onDismiss,
	text,
	title,
}: IJupiterTip) => {
	const { t } = useTranslation();

	return (
		<JupiterTipRoot aria-label={ariaLabel ?? title} role='complementary'>
			<JupiterIconWrapper>
				<Jupiter aria-hidden='true' />
			</JupiterIconWrapper>
			<JupiterTipContent>
				<JupiterTipTitle>{title}</JupiterTipTitle>
				<JupiterTipText>{text}</JupiterTipText>
				{onAction && actionLabel ? (
					<Button onClick={onAction} tertiary small>
						{actionLabel}
					</Button>
				) : null}
			</JupiterTipContent>
			{onDismiss ? (
				<CloseButton
					aria-label={t('jupiter.post-publish.banner-dismiss')}
					onClick={onDismiss}
				/>
			) : null}
		</JupiterTipRoot>
	);
};

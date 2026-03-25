import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@psycron/components/button/Button';
import { zIndexHover } from '@psycron/theme/zIndex';

import { EditUserButtonWrapper, EditUserFooter } from './FormFooter.styles';
import type { FormFooterProps } from './FormFooter.types';

export const FormFooter = ({ disabled }: FormFooterProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<EditUserFooter as='footer' zIndex={zIndexHover}>
			<EditUserButtonWrapper>
				<Button type='submit' disabled={disabled}>
					{t('components.user-details.save')}
				</Button>
				<Button secondary onClick={() => navigate(-1)}>
					{t('globals.cancel')}
				</Button>
			</EditUserButtonWrapper>
		</EditUserFooter>
	);
};

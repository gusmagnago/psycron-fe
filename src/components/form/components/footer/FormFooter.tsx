import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@psycron/components/button/Button';

import { EditUserButtonWrapper, EditUserFooter } from './FormFooter.styles';

export const FormFooter = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<EditUserFooter component='footer' zIndex={10}>
			<EditUserButtonWrapper>
				<Button type='submit'>{t('components.user-details.save')}</Button>
				<Button secondary onClick={() => navigate(-1)}>
					{t('globals.cancel')}
				</Button>
			</EditUserButtonWrapper>
		</EditUserFooter>
	);
};

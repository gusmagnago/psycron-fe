import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import i18n from '@psycron/i18n';
import { SIGNIN } from '@psycron/pages/urls';

import { OtpWrapper } from './WhatsAppOtpChallenge.styles';

export const WhatsAppOtpChallenge = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { verifyWhatsAppOtp, isVerifyWhatsAppOtpLoading, hasPendingWhatsAppChallenge } =
		useAuth();

	const [otp, setOtp] = useState('');

	if (!hasPendingWhatsAppChallenge) {
		navigate(`/${i18n.resolvedLanguage}/${SIGNIN}`, { replace: true });
		return null;
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (otp.length === 6) verifyWhatsAppOtp(otp);
	};

	return (
		<OtpWrapper component='form' onSubmit={handleSubmit}>
			<Text variant='h5'>{t('page.auth.whatsapp-otp.title')}</Text>
			<Text variant='body2'>{t('page.auth.whatsapp-otp.description')}</Text>
			<TextField
				autoFocus
				disabled={isVerifyWhatsAppOtpLoading}
				fullWidth
				inputProps={{ inputMode: 'numeric', maxLength: 6, pattern: '[0-9]*' }}
				label={t('page.auth.whatsapp-otp.label')}
				onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
				value={otp}
			/>
			<Button
				disabled={otp.length !== 6 || isVerifyWhatsAppOtpLoading}
				fullWidth
				loading={isVerifyWhatsAppOtpLoading}
				type='submit'
				variant='contained'
			>
				{t('page.auth.whatsapp-otp.submit')}
			</Button>
		</OtpWrapper>
	);
};

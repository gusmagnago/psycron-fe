import { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { requestEmailVerification } from '@psycron/api/auth';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import { SIGNIN } from '@psycron/pages/urls';

const REDIRECT_DELAY_MS = 1200;

type VerifyState = 'verifying' | 'success' | 'expired';

export const VerifyEmail = () => {
	const { i18n, t } = useTranslation();
	const { showAlert } = useAlert();
	const { verifyEmailToken, isVerifyEmailLoading } = useAuth();

	const [params] = useSearchParams();
	const navigate = useNavigate();

	const token = params.get('token') ?? '';

	const [verifyState, setVerifyState] = useState<VerifyState>('verifying');
	const [resendEmail, setResendEmail] = useState('');
	const [isResending, setIsResending] = useState(false);

	useEffect(() => {
		const run = async () => {
			if (!token) {
				setVerifyState('expired');
				return;
			}

			try {
				const res = await verifyEmailToken(token);
				showAlert({ severity: 'success', message: res.message });
				setVerifyState('success');

				window.setTimeout(() => {
					navigate(`/${i18n.resolvedLanguage}/${SIGNIN}`, { replace: true });
				}, REDIRECT_DELAY_MS);
			} catch {
				setVerifyState('expired');
			}
		};

		void run();
	}, [i18n.resolvedLanguage, navigate, showAlert, t, token, verifyEmailToken]);

	const handleResend = async () => {
		if (!resendEmail.trim()) {
			showAlert({
				severity: 'error',
				message: t('verifyEmail.resendEmailRequired', 'Please enter your email address.'),
			});
			return;
		}

		setIsResending(true);
		try {
			await requestEmailVerification(resendEmail.trim());
			showAlert({
				severity: 'success',
				message: t('verifyEmail.resendSuccess', 'Verification email sent. Check your inbox.'),
			});
		} catch {
			showAlert({
				severity: 'error',
				message: t('verifyEmail.resendFailed', 'Could not send the email. Please try again.'),
			});
		} finally {
			setIsResending(false);
		}
	};

	return (
		<div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
			<h1>{t('verifyEmail.title', 'Verify your email')}</h1>

			{isVerifyEmailLoading && (
				<p>{t('verifyEmail.loading', 'Verifying…')}</p>
			)}

			{!isVerifyEmailLoading && verifyState === 'success' && (
				<p>{t('verifyEmail.help', 'You can close this page after verification.')}</p>
			)}

			{!isVerifyEmailLoading && verifyState === 'expired' && (
				<div>
					<p>
						{t(
							'verifyEmail.invalidOrExpired',
							'Invalid or expired link. Enter your email to receive a new one.'
						)}
					</p>
					<input
						aria-label={t('verifyEmail.emailLabel', 'Email address')}
						disabled={isResending}
						onChange={(e) => setResendEmail(e.target.value)}
						placeholder={t('verifyEmail.emailPlaceholder', 'your@email.com')}
						style={{ display: 'block', marginBottom: 12, padding: '8px 12px', width: '100%' }}
						type="email"
						value={resendEmail}
					/>
					<button
						disabled={isResending}
						onClick={() => void handleResend()}
						style={{ padding: '8px 20px' }}
						type="button"
					>
						{isResending
							? t('verifyEmail.resending', 'Sending…')
							: t('verifyEmail.resendButton', 'Resend verification email')}
					</button>
				</div>
			)}
		</div>
	);
};

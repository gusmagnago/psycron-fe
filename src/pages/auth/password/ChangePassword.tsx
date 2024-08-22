import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import type { AlertProps } from '@mui/material';
import { Box } from '@mui/material';
import { resetPassword } from '@psycron/api/auth';
import type { CustomError } from '@psycron/api/error';
import { Button } from '@psycron/components/button/Button';
import { PasswordInput } from '@psycron/components/form/components/password/PasswordInput';
import { SignLayout } from '@psycron/components/form/components/shared/SignLayout';
import { useAlert } from '@psycron/context/alert/AlertContext';
import i18n from '@psycron/i18n';
import { REQPASSRESET } from '@psycron/pages/urls';
import { useMutation } from '@tanstack/react-query';

import { AuthPageWrapper } from '../index.styles';

import type { IResetPass } from './ChangePassword.types';

export const ChangePassword = () => {
	const { t } = useTranslation();
	const { token } = useParams<{ token: string }>();

	const [resetPassResetError, setPasswordResetError] = useState<string | null>(
		null
	);
	const { showAlert } = useAlert();
	const navigate = useNavigate();

	const { register, handleSubmit } = useForm();

	const passwordReset = useMutation({
		mutationFn: resetPassword,
		onSuccess: (data) => {
			showAlert({
				message: data.message,
				severity: data.status as AlertProps['severity'],
			});
		},
		onError: (error: CustomError) => {
			setPasswordResetError(error.message);
			if (error.statusCode === 404) {
				showAlert({
					message: error.message,
					severity: 'error',
				});
				setTimeout(() => {
					navigate(`/${i18n.language}/${REQPASSRESET}`, { replace: true });
				}, 6000);
			}
		},
	});

	const onSubmit = (data: IResetPass) => {
		passwordReset.mutate({
			...data,
			token,
		});
	};

	return (
		<AuthPageWrapper>
			<SignLayout isReset>
				<Box component='form' onSubmit={handleSubmit(onSubmit)}>
					<PasswordInput
						errors={resetPassResetError}
						register={register}
						hasToConfirm
					/>
					<Box
						display='flex'
						flexDirection='column'
						justifyContent='center'
						alignItems='center'
					>
						<Button type='submit' fullWidth>
							{t('page.reset-password.change-password')}
						</Button>
					</Box>
				</Box>
			</SignLayout>
		</AuthPageWrapper>
	);
};

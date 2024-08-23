import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';

import { NameForm } from '../components/name/NameForm';
import { PasswordInput } from '../components/password/PasswordInput';
import { SignLayout } from '../components/shared/SignLayout';
import { InputFields } from '../components/shared/styles';

import type { SignUpFormTypes } from './SignUp.types';

export const SignUp = ({
	handleSubmit,
	errors,
	onSubmit,
	register,
}: SignUpFormTypes) => {
	const { t } = useTranslation();

	const { signUpError } = useAuth();

	return (
		<SignLayout>
			<Box component='form' onSubmit={handleSubmit(onSubmit)}>
				<NameForm errors={errors} register={register} />
				<InputFields
					label={t('globals.email')}
					fullWidth
					id='email'
					{...register('email')}
					autoComplete='email'
					error={!!errors.email || !!signUpError?.length}
					helperText={errors.email?.message || signUpError}
				/>
				<PasswordInput errors={errors} register={register} hasToConfirm />
				<Box>
					<Button type='submit' fullWidth>
						{t('components.form.signup.title')}
					</Button>
				</Box>
			</Box>
		</SignLayout>
	);
};

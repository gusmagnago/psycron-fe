import { useTranslation } from 'react-i18next';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';

import { PasswordInput } from '../components/password/PasswordInput';
import { SignLayout } from '../components/shared/SignLayout';
import { InputFields } from '../components/shared/styles';

import type { SignInFormTypes } from './SignIn.types';

export const SignIn = ({
	handleSubmit,
	errors,
	onSubmit,
	register,
}: SignInFormTypes) => {
	const { t } = useTranslation();

	return (
		<SignLayout isSignin>
			<Box component='form' onSubmit={handleSubmit(onSubmit)}>
				<InputFields
					label={t('globals.email')}
					fullWidth
					id='email'
					{...register('email')}
					autoComplete='email'
					error={!!errors.email}
					helperText={errors.email?.message}
				/>
				<PasswordInput errors={errors} register={register} />
				<Box>
					<Button type='submit' fullWidth color='primary' variant='contained'>
						{t('components.form.signin.title')}
					</Button>
					<Box>
						<FormControlLabel
							control={<Checkbox />}
							label={t('components.form.keep-loggedin')}
							{...register('stayConnected')}
						/>
					</Box>
				</Box>
			</Box>
		</SignLayout>
	);
};

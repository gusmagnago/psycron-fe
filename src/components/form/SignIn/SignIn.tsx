import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Checkbox } from '@psycron/components/checkbox/Checkbox';

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
				<Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
					<Button type='submit' fullWidth>
						{t('components.form.signin.title')}
					</Button>
					<Box>
						<Checkbox
							labelKey={t('components.form.keep-loggedin')}
							{...register('stayConnected')}
						/>
					</Box>
				</Box>
			</Box>
		</SignLayout>
	);
};

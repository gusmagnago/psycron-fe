import type { Resolver, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid } from '@mui/material';

import { PasswordInput } from '../components/password/PasswordInput';
import { SignLayout } from '../components/shared/SignLayout';
import { InputFields } from '../components/shared/styles';

import { signUpSchema } from './schema/SignUpSchema';
import type { ISignUpForm } from './SignUp.types';

export const SignUp = () => {
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ISignUpForm>({
		resolver: yupResolver(signUpSchema) as unknown as Resolver<ISignUpForm>,
	});

	const onSubmit: SubmitHandler<ISignUpForm> = (data) => {
		console.log('data', data);
	};

	return (
		<SignLayout>
			<Box component='form' onSubmit={handleSubmit(onSubmit)}>
				<Grid container columnSpacing={4}>
					<Grid item xs={12} sm={6} md={6}>
						<InputFields
							label={t('components.form.signup.firstName')}
							fullWidth
							id='firstName'
							{...register('firstName')}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={6}>
						<InputFields
							label={t('components.form.signup.lastName')}
							fullWidth
							id='lastName'
							{...register('lastName')}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>
					</Grid>
				</Grid>
				<InputFields
					label={t('globals.email')}
					fullWidth
					id='email'
					{...register('email')}
					autoComplete='email'
					error={!!errors.email}
					helperText={errors.email?.message}
				/>
				<PasswordInput errors={errors} register={register} hasToConfirm />
				<Box>
					<Button type='submit' fullWidth color='primary' variant='contained'>
						{t('components.form.signup.title')}
					</Button>
				</Box>
			</Box>
		</SignLayout>
	);
};

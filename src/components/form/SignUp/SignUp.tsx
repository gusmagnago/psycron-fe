import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Link, Typography } from '@mui/material';
import { Brand } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowPress } from '@psycron/theme/shadow/shadow.theme';

import { signUpSchema } from './schema/SignUpSchema';
import { InputFields, LogoWrapper, SignUpWrapper } from './SignUp.styles';
import type { ISignUpForm } from './SignUp.types';

export const SignUp = () => {
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ISignUpForm>({
		resolver: yupResolver(signUpSchema),
	});

	const onSubmit: SubmitHandler<ISignUpForm> = (data) => {
		console.log('data', data);
	};

	return (
		<SignUpWrapper
			component='form'
			onSubmit={handleSubmit(onSubmit)}
			height={'100%'}
			borderRadius={10}
			boxShadow={shadowPress}
		>
			<LogoWrapper display='flex' justifyContent='center'>
				<Brand color={palette.primary.main} />
			</LogoWrapper>
			<Box display='flex' flexDirection='row'>
				<InputFields
					label={t('components.form.signup.firstName')}
					fullWidth
					id='firstName'
					{...register('firstName')}
					error={!!errors.firstName}
					helperText={errors.firstName?.message}
				/>
				<InputFields
					label={t('components.form.signup.lastName')}
					fullWidth
					id='lastName'
					{...register('lastName')}
					error={!!errors.lastName}
					helperText={errors.lastName?.message}
				/>
			</Box>
			<InputFields
				label={t('globals.email')}
				fullWidth
				id='email'
				{...register('email')}
				autoComplete='email'
				error={!!errors.email}
				helperText={errors.email?.message}
			/>
			<InputFields
				label={t('globals.password')}
				id='password'
				fullWidth
				type='password'
				autoComplete='password'
				{...register('password')}
				error={!!errors.password}
				helperText={errors.password?.message}
			/>
			<InputFields
				label={t('components.form.confirm-password')}
				fullWidth
				id='confirmPassword'
				type='password'
				autoComplete='password'
				{...register('confirmPassword')}
				error={!!errors.confirmPassword}
				helperText={errors.confirmPassword?.message}
			/>
			<Box>
				<Button type='submit' fullWidth color='primary' variant='contained'>
					{t('components.form.signup.title')}
				</Button>
				<Box my={3} display='flex' justifyContent='center'>
					<Typography variant='caption'>
						{t('components.form.signup.already-have-acc')}
						<Link> {t('components.form.signup.signin-here-link')}</Link>
					</Typography>
				</Box>
			</Box>
		</SignUpWrapper>
	);
};

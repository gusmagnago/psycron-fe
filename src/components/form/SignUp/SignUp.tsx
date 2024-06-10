import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Link, Typography } from '@mui/material';
import { Brand } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowPress } from '@psycron/theme/shadow/shadow.theme';

import { signUpSchema } from './schema/SignUpSchema';
import { InputFields, LogoWrapper, SignUpWrapper } from './SignUp.styles';
import type { ISignUpForm } from './SignUp.types';

export const SignUp = () => {
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
		<SignUpWrapper component='form' onSubmit={handleSubmit(onSubmit)} height={'100%'} borderRadius={10} boxShadow={shadowPress}>
			<LogoWrapper display='flex' justifyContent='center'>
				<Brand color={palette.primary.main}/>
			</LogoWrapper>
			<Box display='flex' flexDirection='row'>
				<InputFields
					label='first name'
					fullWidth
					id='firstName'
					{...register('firstName')}
					error={!!errors.firstName}
					helperText={errors.firstName?.message}
				/>
				<InputFields
					label='last name'
					fullWidth
					id='lastName'
					{...register('lastName')}
					error={!!errors.lastName}
					helperText={errors.lastName?.message}
				/>
			</Box>
			<InputFields
				label='email'
				fullWidth
				id='email'
				{...register('email')}
				autoComplete='email'
				error={!!errors.email}
				helperText={errors.email?.message}
			/>
			<InputFields
				fullWidth
				id='password'
				label='Password'
				type='password'
				autoComplete='password'
				{...register('password')}
				error={!!errors.password}
				helperText={errors.password?.message}
			/>
			<InputFields
				fullWidth
				id='confirmPassword'
				label='Confirm Password'
				type='password'
				autoComplete='password'
				{...register('confirmPassword')}
				error={!!errors.confirmPassword}
				helperText={errors.confirmPassword?.message}
			/>
			<Box>
				<Button type='submit' fullWidth color='primary' variant='contained'>
          Sign Up
				</Button>
				<Box my={3} display='flex' justifyContent='center'>
					
					<Typography variant='caption'>
            Already have an account? <Link> Sign in here</Link>
					</Typography>
				</Box>
			</Box>
		</SignUpWrapper>
	);
};

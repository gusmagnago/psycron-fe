import type { Path, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Button, Checkbox, FormControlLabel, Grid } from '@mui/material';

import { PasswordInput } from '../components/password/PasswordInput';
import { SignLayout } from '../components/shared/SignLayout';
import { InputFields } from '../components/shared/styles';
import type { ISignInForm } from '../SignIn/SignIn.types';
import type { ISignUpForm } from '../SignUp/SignUp.types';

import type { FormProps } from './FormComponent.types';

export const FormComponent = <
  T extends UseFormRegister<ISignUpForm | ISignInForm>,
>({
		fields,
		handleSubmit,
		onSubmit,
		errors,
		register,
		isSignIn,
		submitButtonLabel,
		additionalComponent,
	}: FormProps<T>) => {
	const { t } = useTranslation();

	console.log('🚀 ~ errors:', errors.root);

	return (
		<SignLayout isSignin={isSignIn}>
			<Box component='form' onSubmit={handleSubmit(onSubmit)}>
				<Grid container columnSpacing={4}>
					{fields.map((field) => (
						<Grid
							item
							xs={12}
							sm={field.type === 'checkbox' ? 12 : 6}
							key={field.id}
						>
							{field.type === 'checkbox' ? (
								<FormControlLabel
									control={<Checkbox />}
									label={t(field.label)}
									{...register(field.id as Path<T>)}
								/>
							) : field.type === 'password' ? (
								<PasswordInput
									errors={errors}
									register={register}
									hasToConfirm={!isSignIn}
								/>
							) : (
								<InputFields
									label={t(field.label)}
									fullWidth
									id={field.id}
									type={field.type || 'text'}
									{...register(field.id as Path<T>)}
									error={!!errors.root?.type}
									helperText={errors[field.id as Path<T>]?.message as string}
								/>
							)}
						</Grid>
					))}
				</Grid>
				<PasswordInput
					errors={errors}
					register={register}
					hasToConfirm={!isSignIn}
				/>
				<Box>
					<Button type='submit' fullWidth color='primary' variant='contained'>
						{t(submitButtonLabel)}
					</Button>
					{additionalComponent}
				</Box>
			</Box>
		</SignLayout>
	);
};

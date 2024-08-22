import { useEffect, useState } from 'react';
import type { FieldError, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextFieldProps } from '@mui/material';
import { Box, IconButton, InputAdornment } from '@mui/material';
import { NotVisible, Visible } from '@psycron/components/icons';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';

import { InputFields } from '../shared/styles';

import type { PasswordInputProps } from './PasswordInput.types';

export const PasswordInput = <T extends FieldValues>({
	hasToConfirm,
	errors,
	register,
	defaultPasswordHash,
	disabled,
}: PasswordInputProps<T> & TextFieldProps) => {
	const { t } = useTranslation();

	const { signInError } = useAuth();

	const passwordInputId: Path<T> = 'password' as Path<T>;
	const confirmPasswordInputId: Path<T> = 'confirmPassword' as Path<T>;

	const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({
		[passwordInputId]: false,
		[confirmPasswordInputId]: false,
	});

	const [passwordValue, setPasswordValue] = useState<string>('');
	const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('');

	useEffect(() => {
		if (defaultPasswordHash) {
			setPasswordValue(defaultPasswordHash);
		}
	}, [defaultPasswordHash]);

	const toggleVisibility = (id: Path<T>) => {
		setIsVisible((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const handleInputChange = (id: Path<T>, value: string) => {
		if (id === passwordInputId) {
			setPasswordValue(value);
		} else if (id === confirmPasswordInputId) {
			setConfirmPasswordValue(value);
		}
	};

	const getHelperText = (fieldId: Path<T>): React.ReactNode => {
		// Se existir um erro no formulário ou signInError, retornar a mensagem apropriada
		if (typeof signInError === 'string') {
			return signInError; // Erro externo (ex.: do servidor)
		}
		if (typeof errors === 'string') {
			return errors; // Também pode ser um erro externo em forma de string
		} else if (
			errors &&
			errors[fieldId] &&
			'message' in (errors[fieldId] as FieldError)
		) {
			return (errors[fieldId] as FieldError).message; // Erro do formulário
		}
		return null;
	};

	return (
		<Box>
			<InputFields
				label={t('globals.password')}
				id={passwordInputId}
				fullWidth
				type={!isVisible[passwordInputId] ? 'password' : 'text'}
				{...register(passwordInputId)}
				error={!!getHelperText(passwordInputId)}
				helperText={getHelperText(passwordInputId)}
				value={passwordValue}
				autoComplete='password'
				onChange={(e) => {
					handleInputChange(passwordInputId, e.target.value);
				}}
				disabled={disabled}
				InputProps={{
					endAdornment: passwordValue?.length ? (
						<InputAdornment position='end'>
							<IconButton
								onMouseEnter={() => toggleVisibility(passwordInputId)}
								onMouseLeave={() => toggleVisibility(passwordInputId)}
								edge='end'
							>
								{!isVisible[passwordInputId] ? <NotVisible /> : <Visible />}
							</IconButton>
						</InputAdornment>
					) : null,
				}}
			/>
			{hasToConfirm ? (
				<InputFields
					label={t('components.form.confirm-password')}
					fullWidth
					id={confirmPasswordInputId}
					type={!isVisible[confirmPasswordInputId] ? 'password' : 'text'}
					{...register(confirmPasswordInputId)}
					error={!!getHelperText(confirmPasswordInputId)}
					helperText={getHelperText(confirmPasswordInputId)}
					value={confirmPasswordValue}
					autoComplete='confirm-password'
					onChange={(e) => {
						handleInputChange(confirmPasswordInputId, e.target.value);
					}}
					InputProps={{
						endAdornment: confirmPasswordValue?.length ? (
							<InputAdornment position='end'>
								<IconButton
									onMouseEnter={() => toggleVisibility(confirmPasswordInputId)}
									onMouseLeave={() => toggleVisibility(confirmPasswordInputId)}
									edge='end'
								>
									{!isVisible[confirmPasswordInputId] ? (
										<NotVisible />
									) : (
										<Visible />
									)}
								</IconButton>
							</InputAdornment>
						) : null,
					}}
				/>
			) : null}
		</Box>
	);
};

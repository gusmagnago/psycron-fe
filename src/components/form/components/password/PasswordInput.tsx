import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, InputAdornment, type TextFieldProps } from '@mui/material';
import { NotVisible, Visible } from '@psycron/components/icons';

import { InputFields } from '../shared/styles';

import type { PasswordInputProps } from './PasswordInput.types';

export const PasswordInput = ({
	hasToConfirm,
	errors,
	register,
}: PasswordInputProps & TextFieldProps) => {
	const { t } = useTranslation();

	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

	const toggleVisibility = () => {
		setIsVisible((prev) => !prev);
	};

	const toggleConfirmVisibility = () => {
		setIsConfirmVisible((prev) => !prev);
	};

	return (
		<>
			<InputFields
				label={t('globals.password')}
				id='password'
				fullWidth
				type={!isVisible ? 'password' : 'text' }
				autoComplete='password'
				{...register('password')}
				error={!!errors.password}
				helperText={errors.password?.message}
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton
								onMouseEnter={toggleVisibility}
								onMouseLeave={toggleVisibility}
								edge='end'
								tabIndex={-1}
							>
								{!isVisible ?  <NotVisible /> : <Visible /> }
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			{hasToConfirm ? (
				<InputFields
					label={t('components.form.confirm-password')}
					fullWidth
					id='confirmPassword'
					type={!isConfirmVisible ? 'password' : 'text' }
					autoComplete='password'
					{...register('confirmPassword')}
					error={!!errors.confirmPassword}
					helperText={errors.confirmPassword?.message}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									onMouseEnter={toggleConfirmVisibility}
									onMouseLeave={toggleConfirmVisibility}
									edge='end'
									tabIndex={-1}
								>
									{!isConfirmVisible ? <NotVisible /> : <Visible /> }
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			) : null}
		</>
	);
};

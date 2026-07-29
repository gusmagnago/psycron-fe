import type { FieldValues, Path } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';

import { NameFormWrapper, NameInputWrapper } from './NameForm.styles';
import type { NameFormProps } from './NameForm.types';

export const NameForm = <T extends FieldValues>({
	disabled,
	required,
	fields,
	defaultFirstName,
	defaultLastName,
	placeholderFirstName,
	placeholderLastName,
	labelFirstName,
	labelLastName,
	showDateOfBirth = false,
	testId,
}: NameFormProps<T>) => {
	const { t } = useTranslation();

	const {
		register,
		formState: { errors },
	} = useFormContext<T>();

	const firstNamePath = fields?.firstName ?? ('firstName' as Path<T>);
	const lastNamePath = fields?.lastName ?? ('lastName' as Path<T>);
	const dateOfBirthPath = fields?.dateOfBirth ?? ('dateOfBirth' as Path<T>);

	const firstNameError = errors[firstNamePath];
	const lastNameError = errors[lastNamePath];

	return (
		<NameFormWrapper data-testid={testId} id={testId}>
			<NameInputWrapper>
				<TextField
					label={labelFirstName ?? t('components.form.signup.first-name')}
					fullWidth
					id={String(firstNamePath)}
					defaultValue={defaultFirstName}
					placeholder={
						placeholderFirstName ?? t('components.input.text.first-name')
					}
					{...register(firstNamePath, {
						required: required
							? t('components.form.validation.required', {
									name: labelFirstName ?? t('components.form.signup.first-name'),
								})
							: false,
					})}
					error={Boolean(firstNameError)}
					helperText={
						typeof firstNameError?.message === 'string'
							? firstNameError.message
							: undefined
					}
					required={required}
					disabled={disabled}
				/>
			</NameInputWrapper>

			<NameInputWrapper>
				<TextField
					label={labelLastName ?? t('components.form.signup.last-name')}
					fullWidth
					id={String(lastNamePath)}
					defaultValue={defaultLastName}
					placeholder={
						placeholderLastName ?? t('components.input.text.last-name')
					}
					{...register(lastNamePath, {
						required: required
							? t('components.form.validation.required', {
									name: labelLastName ?? t('components.form.signup.last-name'),
								})
							: false,
					})}
					error={Boolean(lastNameError)}
					helperText={
						typeof lastNameError?.message === 'string'
							? lastNameError.message
							: undefined
					}
					required={required}
					disabled={disabled}
				/>
			</NameInputWrapper>

			{showDateOfBirth ? (
				<NameInputWrapper>
					<TextField
						type='date'
						label={t('components.form.signup.date-of-birth', 'Date of birth')}
						fullWidth
						id={String(dateOfBirthPath)}
						{...register(dateOfBirthPath)}
						disabled={disabled}
						slotProps={{
							inputLabel: { shrink: true },
							htmlInput: { 'data-testid': 'name-form-date-of-birth' },
						}}
					/>
				</NameInputWrapper>
			) : null}
		</NameFormWrapper>
	);
};

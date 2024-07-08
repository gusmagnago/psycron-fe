import i18n from '@psycron/i18n';
import { object, ref, string } from 'yup';

import { yupLocalizedErrorMessage } from '../../utils';
import { emailRegexValidation, passwordRegexValidation } from '../../utils';

export const signUpSchema = object({
	firstName: string().required(
		yupLocalizedErrorMessage('components.form.validation.required', {
			name: i18n.t('components.form.signup.firstName'),
		}),
	),
	lastName: string().required(
		yupLocalizedErrorMessage('components.form.validation.required', {
			name: i18n.t('components.form.signup.lastName'),
		}),
	),
	email: string()
		.trim()
		.matches(
			emailRegexValidation,
			yupLocalizedErrorMessage('components.form.validation.invalid', {
				name: i18n.t('globals.email'),
			}),
		)
		.email()
		.required(
			yupLocalizedErrorMessage('components.form.validation.required', {
				name: i18n.t('globals.email'),
			}),
		),
	password: string()
		.trim()
		.min(
			9,
			yupLocalizedErrorMessage('components.form.validation.characters', {
				numChar: 9,
			}),
		)
		.matches(
			passwordRegexValidation,
			yupLocalizedErrorMessage('components.form.validation.pass-rules'),
		)
		.required(
			yupLocalizedErrorMessage('components.form.validation.required', {
				name: i18n.t('globals.password'),
			}),
		),
	confirmPassword: string()
		.trim()
		.oneOf(
			[ref('password')],
			yupLocalizedErrorMessage('components.form.validation.match', {
				name: i18n.t('globals.password'),
			}),
		)
		.required(
			yupLocalizedErrorMessage('components.form.validation.required', {
				name: i18n.t('components.form.confirm-password'),
			}),
		),
});

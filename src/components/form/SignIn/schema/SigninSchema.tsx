import i18n from '@psycron/i18n';
import { boolean, object, string } from 'yup';

import { emailRegexValidation, yupLocalizedErrorMessage } from '../../utils';

export const signInSchema = object({
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
		.required(
			yupLocalizedErrorMessage('components.form.validation.required', {
				name: i18n.t('globals.password'),
			}),
		),
	stayConnected: boolean(),
});

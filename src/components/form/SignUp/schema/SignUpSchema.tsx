import { object, ref, string } from 'yup';

import { emailRegexValidation, passwordRegexValidation } from '../../utils';

export const signUpSchema = object({
	firstName: string().required('first name is required'),
	lastName: string().required('last name is required'),
	email: string()
		.trim()
		.matches(emailRegexValidation, 'email is invalid')
		.email()
		.required('email is required'),
	password: string()
		.trim()
		.min(9, 'password must be at least 9 characters')
		.matches(
			passwordRegexValidation,
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		)
		.required('password is required'),
	confirmPassword: string()
		.trim()
		.oneOf([ref('password')], 'passwords must match')
		.required('confirm password is required'),
});

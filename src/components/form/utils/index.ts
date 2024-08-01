import i18n from '@psycron/i18n';

export const emailRegexValidation =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegexValidation =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const yupLocalizedErrorMessage = (
	key: string,
	params?: Record<string, unknown>,
) => {
	return i18n.t(key, params);
};

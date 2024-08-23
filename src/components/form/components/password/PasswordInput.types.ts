import type {
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';

export interface PasswordInputProps<T extends FieldValues> {
	defaultPasswordHash?: string;
	disabled?: boolean;
	errors: FieldErrors<T> | string | null;
	hasToConfirm?: boolean;
	register: UseFormRegister<T>;
}

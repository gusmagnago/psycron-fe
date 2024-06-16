import type {
	FieldErrors, FieldValues,
	UseFormRegister,
} from 'react-hook-form';

export interface PasswordInputProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  hasToConfirm?: boolean;
  register: UseFormRegister<T>;
}

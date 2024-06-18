import type {
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';

export interface NameFormProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}
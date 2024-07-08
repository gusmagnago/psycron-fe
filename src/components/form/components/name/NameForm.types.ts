import type {
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';

export interface NameFormProps<T extends FieldValues> {
    disabled?: boolean;
    errors: FieldErrors<T>;
    placeholderFirstName?: string;
    placeholderLastName?: string;
    register: UseFormRegister<T>;
}

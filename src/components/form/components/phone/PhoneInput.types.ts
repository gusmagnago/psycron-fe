import type {
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';

export interface PhoneInputProps<T extends FieldValues> {
    defaultValue?: string;
    disabled?: boolean;
    errors: FieldErrors<T>;
    register: UseFormRegister<T>;
    registerName: 'phone' | 'whatsapp';
}

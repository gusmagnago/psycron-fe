import type {
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';

export interface PhoneInputProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  registerName: 'phone' | 'whatsapp'
}
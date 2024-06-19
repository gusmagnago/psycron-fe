import type {
	FieldErrors,
	FieldValues,
	UseFormGetValues,
	UseFormRegister,
	UseFormSetValue,
} from 'react-hook-form';

export interface ContactsFormProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  getPhoneValue: UseFormGetValues<FieldValues>;
  hasWpp?: boolean;
  register: UseFormRegister<T>;
  setPhoneValue: UseFormSetValue<FieldValues>;
}

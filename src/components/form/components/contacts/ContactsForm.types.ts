import type {
	FieldErrors,
	FieldValues,
	UseFormGetValues,
	UseFormRegister,
	UseFormSetValue,
} from 'react-hook-form';

export interface ContactsFormProps<T extends FieldValues> {
  defaultValues?: {
    defaultEmail?: string;
    defaultPhone?: string;
    defaultWpp?: string
  },
  disabled?:boolean;
  errors: FieldErrors<T>;
  getPhoneValue: UseFormGetValues<FieldValues>;
  hasWpp?: boolean;
  register: UseFormRegister<T>;
  setPhoneValue: UseFormSetValue<FieldValues>;
}

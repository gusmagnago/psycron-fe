import type {
	FieldErrors,
	FieldValues,
	UseFormGetValues,
	UseFormRegister,
	UseFormSetValue,
} from 'react-hook-form';
import type { IContactInfo } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface ContactsFormProps<T extends FieldValues> {
	defaultValues: IContactInfo;
	disabled?: boolean;
	errors: FieldErrors<T>;
	getPhoneValue: UseFormGetValues<FieldValues>;
	hasWpp?: boolean;
	register: UseFormRegister<T>;
	setPhoneValue: UseFormSetValue<FieldValues>;
}

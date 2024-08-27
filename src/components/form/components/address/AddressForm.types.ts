import type {
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';
import type { IAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface AddressComponentProps<T extends FieldValues> {
	defaultValues?: IAddress;
	disabled?: boolean;
	errors: FieldErrors<T>;
	register: UseFormRegister<T>;
	showGoogleAddressSearch?: boolean;
}

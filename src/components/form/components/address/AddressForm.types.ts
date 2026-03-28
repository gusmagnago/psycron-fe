import type { FieldValues, Path } from 'react-hook-form';

export interface AddressFormFields<T extends FieldValues> {
	city?: Path<T>;
	country?: Path<T>;
	postcode?: Path<T>;
	street?: Path<T>;
}

export interface AddressFormProps<T extends FieldValues> {
	disabled?: boolean;
	fields?: AddressFormFields<T>;
	showGoogleAddressSearch?: boolean;
}

import type {
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';

export interface AddressComponent {
  address: string;
  administrativeArea: string;
  city: string;
  country: string;
  moreInfo?: string;
  postalCode: string;
  route: string;
  streetNumber: string;
  sublocality: string;
}

export interface AddressComponentProps<T extends FieldValues> {
  defaultValues?: AddressComponent,
  disabled?:boolean,
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

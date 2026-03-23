import type { FieldValues, Path } from 'react-hook-form';
import type { TextFieldProps } from '@mui/material';
import type { IContactInfo } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type ContactsFormFields<T extends FieldValues> = {
	email?: Path<T>;
	hasWhatsApp?: Path<T>;
	isPhoneWpp?: Path<T>;
	phone?: Path<T>;
	whatsapp?: Path<T>;
};

export type ContactsFormProps<T extends FieldValues> = {
	atLeastOneContact?: boolean;
	defaultValues?: IContactInfo;
	disabled?: boolean;
	fields?: ContactsFormFields<T>;
	fullWidth?: boolean;
	labelEmail?: string;
	placeholderEmail?: string;
	required?: boolean;
} & Omit<TextFieldProps, 'defaultValue' | 'required' | 'disabled'>;

import type { ReactNode } from 'react';
import type {
	FieldErrors,
	FieldValues,
	UseFormHandleSubmit,
	UseFormRegister} from 'react-hook-form';

export interface FormField {
    id: string;
    label: string;
    type: string
}

export interface FormProps<T extends FieldValues> {
  additionalComponent?: ReactNode;
  errors: FieldErrors<T>;
  fields: FormField[];
  handleSubmit: UseFormHandleSubmit<T, undefined>;
  isSignIn?: boolean;
  onSubmit: (data: T) => void;
  register: UseFormRegister<T>;
  submitButtonLabel: string;
}
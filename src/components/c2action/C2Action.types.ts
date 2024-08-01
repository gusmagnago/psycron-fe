import type {
	FieldErrors,
	FieldValues,
	UseFormHandleSubmit,
	UseFormRegister,
} from 'react-hook-form';

export interface IC2ActionProps<T extends FieldValues> {
  bttnText: string;
  errors: FieldErrors<T>;
  handleSubmit: UseFormHandleSubmit<T, undefined>;
  i18nKey?: string;
  label: string;
  onSubmit: (data: T) => void;
  register: UseFormRegister<T>;
}

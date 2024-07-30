import type {
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';

export interface IC2ActionProps<T extends FieldValues> {
  i18nKey: string;
  handleSubmit: UseFormHandleSubmit<T, undefined>;
  onSubmit: (data: T) => void;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  label: string;
  bttnText: string;
}

import type { ReactNode } from 'react';
import type { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

export interface FormWrapperField {
  id: string;
  label: string;
  type: string;
}

export interface FormWrapperProps<T extends FieldValues> {
  children: ReactNode;
  formDescription: string;
  formTitle: string;
  handleSubmit: UseFormHandleSubmit<T, undefined>;
  onSubmit: (data: T) => void;
  submitButtonLabel: string;
}

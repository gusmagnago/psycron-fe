import type { SyntheticEvent } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

export interface ICheckboxProps<T extends FieldValues> {
    labelKey: string;
    onChange?:
        | ((event: SyntheticEvent<Element, Event>, checked: boolean) => void)
        | undefined;
    register?: UseFormRegister<T>;
    registerName?: Path<T>;
    value?: unknown;
}

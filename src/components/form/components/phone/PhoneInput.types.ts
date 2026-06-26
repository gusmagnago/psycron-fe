import type { FieldValues, Path } from 'react-hook-form';

export type PhoneInputComponentProps<T extends FieldValues> = {
	defaultValue?: string;
	disabled?: boolean;
	labelKey?: string;
	name: Path<T>;
	required?: boolean;
	testId?: string;
	validateFn?: (value: string) => string | true;
};

export type StyledPhoneInputProps = {
	hasError?: boolean;
	isDisabled?: boolean;
	isFocused?: boolean;
};

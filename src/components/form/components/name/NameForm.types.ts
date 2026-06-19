import type { FieldValues, Path } from 'react-hook-form';

export type NameFormFields<T extends FieldValues> = {
	dateOfBirth?: Path<T>;
	firstName: Path<T>;
	lastName: Path<T>;
};

export interface NameFormProps<T extends FieldValues> {
	/** Initial values (if you really need them). Prefer useForm({ defaultValues }). */
	defaultFirstName?: string;
	defaultLastName?: string;

	disabled?: boolean;

	/** Override which RHF fields to bind to (default: firstName/lastName). */
	fields?: NameFormFields<T>;
	/** Optional label overrides */
	labelFirstName?: string;

	labelLastName?: string;
	/** Placeholders shown when empty. */
	placeholderFirstName?: string;

	placeholderLastName?: string;
	required?: boolean;
	/** Opt-in: render an optional date-of-birth field (used on the edit page). */
	showDateOfBirth?: boolean;
}

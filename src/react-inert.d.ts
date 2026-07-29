import 'react';

// The `inert` attribute is used for accessible collapse/expand regions but is
// not present in this version of @types/react (React 18.3), which also does not
// recognize `inert` as a boolean DOM attribute at runtime — passing `inert={true}`
// warns and serializes wrongly. The correct React-18 form is the empty-string
// (attribute-present) value, so we type it as `'' | undefined`.
declare module 'react' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface HTMLAttributes<T> {
		inert?: '' | undefined;
	}
}

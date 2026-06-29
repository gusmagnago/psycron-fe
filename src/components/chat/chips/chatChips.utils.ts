/**
 * Builds a namespaced `${prefix}-${suffix}` test id (also used as the element
 * `id`), or `undefined` when no prefix was provided so the attribute is omitted.
 */
export const chipTestId = (
	prefix: string | undefined,
	suffix: string
): string | undefined => (prefix ? `${prefix}-${suffix}` : undefined);

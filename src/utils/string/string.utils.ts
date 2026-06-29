/**
 * Converts a kebab/slug string to a readable Title Case label.
 * e.g. `speech-therapist` → `Speech Therapist`.
 */
export const slugToTitleCase = (slug: string): string =>
	slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

// ─── Chip key → canonical speciality name ─────────────────────────────────────

export const SPECIALTY_CHIP_KEY_MAP: Record<string, string> = {
	'chip-occupational-therapist': 'occupational-therapist',
	'chip-nutritionist': 'nutritionist',
	'chip-physiotherapist': 'physiotherapist',
	'chip-psychiatrist': 'psychiatrist',
	'chip-psychologist': 'psychologist',
	'chip-speech-therapist': 'speech-therapist',
};

// ─── Canonical speciality name → default sessionType chip key ─────────────────
// Configurable — not hardcoded in component logic.
// Drives the session-type suggestion in the Jupiter flow; always overridable.

export const SPECIALTY_SESSION_TYPE_DEFAULTS: Record<string, string> = {
	// Healthcare
	'occupational-therapist': 'chip-in-person',
	nutritionist: 'chip-both',
	physiotherapist: 'chip-in-person',
	psychiatrist: 'chip-both',
	psychologist: 'chip-both',
	'speech-therapist': 'chip-in-person',
	nurse: 'chip-in-person',
	// Wellness
	acupuncture: 'chip-in-person',
	'drainage-massage': 'chip-in-person',
	'massage-therapist': 'chip-in-person',
	meditation: 'chip-both',
	reiki: 'chip-in-person',
	'tantric-massage': 'chip-in-person',
	yoga: 'chip-both',
	// Alternative
	astrology: 'chip-both',
	'card-reading': 'chip-both',
	medium: 'chip-both',
	// Aesthetics
	'aesthetic-nurse': 'chip-in-person',
	'tattoo-artist': 'chip-in-person',
	// Movement
	'dance-instructor': 'chip-in-person',
	pilates: 'chip-in-person',
	'personal-trainer': 'chip-in-person',
};

export const SPECIALTY_SESSION_TYPE_FALLBACK = 'chip-both';

// ─── Category lookup (FE only — not stored in DB) ────────────────────────────
// Used for calendar filtering. Derivable at any time from canonical name.

export const SPECIALTY_CATEGORIES: Record<string, string> = {
	// Healthcare
	'occupational-therapist': 'healthcare',
	nutritionist: 'healthcare',
	physiotherapist: 'healthcare',
	psychiatrist: 'healthcare',
	psychologist: 'healthcare',
	'speech-therapist': 'healthcare',
	nurse: 'healthcare',
	// Wellness
	acupuncture: 'wellness',
	'drainage-massage': 'wellness',
	'massage-therapist': 'wellness',
	meditation: 'wellness',
	reiki: 'wellness',
	'tantric-massage': 'wellness',
	yoga: 'wellness',
	// Alternative
	astrology: 'alternative',
	'card-reading': 'alternative',
	medium: 'alternative',
	// Aesthetics
	'aesthetic-nurse': 'aesthetics',
	'tattoo-artist': 'aesthetics',
	// Movement
	'dance-instructor': 'movement',
	pilates: 'movement',
	'personal-trainer': 'movement',
};

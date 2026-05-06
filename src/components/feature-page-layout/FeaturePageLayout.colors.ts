import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';

import type { FeaturePageLayoutColors } from './FeaturePageLayout.types';

const makeFeatureColors = (base: string): FeaturePageLayoutColors => ({
	accent: base,
	accentBorder: hexToRgba(base, 0.18),
	accentHoverBorder: hexToRgba(base, 0.24),
	accentSelectedBorder: hexToRgba(base, 0.3),
	accentSoft: hexToRgba(base, 0.12),
	accentSofter: hexToRgba(base, 0.04),
	accentStrongSoft: hexToRgba(base, 0.22),
});

export const FEATURE_PAGE_COLORS = {
	/** Action center — conflicts & cancellation recovery. Secondary pink. */
	action: makeFeatureColors(palette.secondary.main),
	/** Availability management. Primary sky blue. */
	availability: makeFeatureColors(palette.primary.main),
	/** Notification feed & delivery tracking. Tertiary purple. */
	notifications: makeFeatureColors(palette.tertiary.main),
	/** Patient management. Success green. */
	patients: makeFeatureColors(palette.success.main),
} as const satisfies Record<string, FeaturePageLayoutColors>;

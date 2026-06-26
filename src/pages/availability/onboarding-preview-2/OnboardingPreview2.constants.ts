export type InventoryTone =
	| 'blue'
	| 'green'
	| 'neutral'
	| 'purple'
	| 'red'
	| 'yellow';

export interface InventoryItem {
	description: string;
	existing: string;
	name: string;
	notes: string[];
	source: string;
	tags: string[];
}

export interface InventorySection {
	description: string;
	items: InventoryItem[];
	level: string;
	shortName: string;
	tone: InventoryTone;
}

export interface ComponentMapItem {
	name: string;
	route: string;
	use: string;
}

export interface DataTagGroup {
	description: string;
	name: string;
	tags: string[];
}

export interface FlowTemplate {
	name: string;
	path: string;
	states: string[];
}

export const SOURCE_PREVIEW = {
	href: 'file:///private/tmp/psycron-jupiter-onboarding-preview.html',
	label: '/private/tmp/psycron-jupiter-onboarding-preview.html',
	title: 'Jupiter onboarding interactive mock',
};

export const COMPONENT_MAP: ComponentMapItem[] = [
	{
		name: 'JupiterConversation',
		route: 'src/pages/availability/jupiter-conversation',
		use: 'Owns chat stream, grouped bubbles, chips, composer, and flow transitions.',
	},
	{
		name: 'SingleSelectChips / MultiSelectChips',
		route: 'src/components/chat/chips',
		use: 'Existing chip primitives for single-select, multi-select, custom input, and continue states.',
	},
	{
		name: 'GoogleCalendarPermissions',
		route: 'src/pages/availability/google-calendar-path',
		use: 'Permission explainer card for the OAuth branch.',
	},
	{
		name: 'GoogleCalendarPicker',
		route: 'src/pages/availability/google-calendar-path',
		use: 'Calendar selection card after Google connection.',
	},
	{
		name: 'GoogleCalendarSuccess',
		route: 'src/pages/availability/google-calendar-path',
		use: 'Post-connect choice between importing existing schedule and defining hours manually.',
	},
	{
		name: 'AvailabilityPreviewCard',
		route: 'src/pages/availability/availability-preview-card',
		use: 'Final review card before publish.',
	},
	{
		name: 'Button, Text, Icons',
		route: 'src/components',
		use: 'Shared Psycron atoms for actions, text rendering, and Lucide-wrapped iconography.',
	},
];

export const INVENTORY_SECTIONS: InventorySection[] = [
	{
		description:
			'The smallest values that make the mock feel like Psycron: colors, spacing, elevation, radius, and motion.',
		level: 'Electrons',
		shortName: 'Tokens',
		tone: 'purple',
		items: [
			{
				description:
					'Primitive color roles from the mock mapped to existing Psycron palette slots.',
				existing:
					'palette.brand.purple, palette.brand.google, palette.success, palette.warning, palette.error, palette.background, palette.gray',
				name: 'Color Roles',
				notes: [
					'Purple anchors Jupiter and primary actions.',
					'Google blue is only used for calendar connection context.',
					'Status colors require an icon or text label, never color alone.',
				],
				source: 'CSS variables: --purple, --google, --success, --warning, --error, --paper, --default',
				tags: ['status-note.*', 'status-pill', 'chip.google', 'pub'],
			},
			{
				description:
					'Four-point spacing and radius scale used by bubbles, dock, cards, chips, and preview rows.',
				existing: 'spacing.xxs, spacing.xs, spacing.extraSmall, spacing.small, spacing.mediumSmall, spacing.medium',
				name: 'Spacing And Radius',
				notes: [
					'Bubble corners use 16px as the main radius and 4px for owner-side anchors.',
					'Mobile bubble max-width becomes 100%.',
					'Touch controls stay at 38-42px in the mock and should be 40px+ in React.',
				],
				source: 'CSS variables: --xxs, --xs, --es, --sm, --ms, --md',
				tags: ['bubble', 'chip', 'composer', 'box'],
			},
			{
				description:
					'Neumorphic and app-shell shadows used to separate controls without heavy borders.',
				existing: 'shadowSmall, shadowMedium, shadowMain, shadowMediumPurple',
				name: 'Elevation',
				notes: [
					'Use the purple shadow for active primary chips or publish actions.',
					'Use inset shadow only for composer-like input surfaces.',
				],
				source: 'CSS variables: --shadow-small, --shadow-medium, --shadow-main, --shadow-purple, --shadow-inset',
				tags: ['frame', 'chip.primary', 'composer', 'box'],
			},
			{
				description:
					'Motion cues for Jupiter identity, grouped messages, typing, and animated ellipsis text.',
				existing:
					'CSS keyframes in page-specific styles; honor prefers-reduced-motion before production use',
				name: 'Motion Tokens',
				notes: [
					'Jupiter avatar float/blink gives identity without blocking comprehension.',
					'Grouped bubble merge animation should be transform/opacity only.',
					'Every “…” from Jupiter should use the animated ellipsis treatment.',
				],
				source: 'keyframes: jupFloat, jupBlink, mergeIn, blink, ellipsisPulse',
				tags: ['avatar', 'typing', 'animated-ellipsis'],
			},
		],
	},
	{
		description:
			'Single-purpose primitives used repeatedly across the onboarding interface.',
		level: 'Atoms',
		shortName: 'Primitives',
		tone: 'blue',
		items: [
			{
				description:
					'Owner-specific message surface with fit-content width and grouped corner rules.',
				existing: 'BotBubble, UserBubble in JupiterConversation.styles.tsx',
				name: 'Chat Bubble',
				notes: [
					'Bot anchor: top-left 4px on the first bubble.',
					'User anchor: bottom-right 4px on the last bubble.',
					'Consecutive bubbles remove the touching inner corner only.',
				],
				source: '.bubble, .bot .bubble, .user .bubble',
				tags: ['jupiter-onboarding-bubble-bot-*', 'jupiter-onboarding-bubble-user-*'],
			},
			{
				description:
					'Pill action used for binary choices, custom options, recurrence, Google choices, and publish controls.',
				existing: 'Button plus SingleSelectChips/MultiSelectChips',
				name: 'Chip Button',
				notes: [
					'Primary and selected states use purple.',
					'Google state uses Google blue.',
					'Success/danger states are reserved for confirm/change answers.',
				],
				source: '.chip, .chip.primary, .chip.google, .chip.success, .chip.danger',
				tags: ['jupiter-onboarding-*-chip-*'],
			},
			{
				description:
					'Small inline icon used by status notes and permission rows.',
				existing: 'Info, CheckSuccess, Google, TriangleAlert from @psycron/components/icons',
				name: 'Status Icon',
				notes: [
					'Size should stay compact: 12-15px in notes and rows.',
					'Warning notes use alert semantics.',
				],
				source: 'CHECK, INFO, ALERT, GOOGLE_ICON inline SVG references',
				tags: ['status-note', 'perm'],
			},
			{
				description:
					'Input and send action for custom time, duration, and timezone answers.',
				existing: 'OtherInput, OtherSendButton from chat chips styles',
				name: 'Composer Input',
				notes: [
					'Disabled until Custom is selected for chip-backed questions.',
					'Enter key and send button submit the same value.',
				],
				source: '.composer input, .send',
				tags: ['jupiter-onboarding-composer-input', 'jupiter-onboarding-*-custom-send'],
			},
		],
	},
	{
		description:
			'Small composed pieces that combine atoms into reusable answer, note, and row patterns.',
		level: 'Molecules',
		shortName: 'Compositions',
		tone: 'green',
		items: [
			{
				description:
					'Avatar, sender label, and one or more bubbles rendered as one message run.',
				existing: 'BotMessageGroup, UserMessageGroup, BotStack, Avatar',
				name: 'Message Group',
				notes: [
					'Only the first bot message in a run shows the Jupiter icon.',
					'Groups create larger spacing only when the sender changes.',
				],
				source: '.group, .stack, .sender, .avatar',
				tags: ['jupiter-onboarding-message-bot-*', 'jupiter-onboarding-message-user-*'],
			},
			{
				description:
					'Small explanatory note below a question or imported state.',
				existing: 'Recommended page-specific StatusNote component when reintroduced',
				name: 'Status Note',
				notes: [
					'No background or box shadow.',
					'10px regular text.',
					'Type variants: info, success, warning, google.',
				],
				source: '.status-note.info, .status-note.success, .status-note.warning, .status-note.google',
				tags: [
					'jupiter-onboarding-session-duration-note',
					'jupiter-onboarding-import-flag',
					'jupiter-onboarding-recurrence-note',
				],
			},
			{
				description:
					'Multi-select chip set with an inline continue action after at least one selection.',
				existing: 'MultiSelectChips',
				name: 'Multi-select Answer Group',
				notes: [
					'Used for working days and specialties.',
					'Continue button is hidden until there is a selected value.',
				],
				source: 'multiChips(prefix, opts, confirmLabel)',
				tags: ['jupiter-onboarding-working-days-chips', 'jupiter-onboarding-working-days-continue'],
			},
			{
				description:
					'Label, value, dot, and data tag for each preview attribute.',
				existing: 'AvailabilityPreviewCard row composition',
				name: 'Preview Row',
				notes: [
					'Rows include calendar, days, hours, duration, session type, timezone, and recurrence in the mock.',
					'Value nodes carry their own data tag for assertions.',
				],
				source: '.prow-row, .pdot, .plabel, .pval',
				tags: ['jupiter-onboarding-preview-row-*', 'jupiter-onboarding-preview-value-*'],
			},
		],
	},
	{
		description:
			'Large page regions that own layout, accessibility boundaries, or a complete onboarding decision point.',
		level: 'Organisms',
		shortName: 'Blocks',
		tone: 'yellow',
		items: [
			{
				description:
					'Header copy above the conversation frame in the availability workspace.',
				existing: 'AvailabilityWorkspaceRouteFrame and AvailabilityWorkspaceShell',
				name: 'Workspace Header',
				notes: [
					'Provides the practitioner-facing page title and operational subtitle.',
					'Should stay outside the chat scroll region.',
				],
				source: '.app-header',
				tags: ['availability-workspace-header'],
			},
			{
				description:
					'Conversation frame with stream, reading column, dock, and mobile/desktop sizing.',
				existing: 'GenerateAvailability + JupiterConversation',
				name: 'Jupiter Onboarding Shell',
				notes: [
					'The stream is the live region.',
					'The dock owns chips and composer controls.',
					'Frame responds to mobile with wider bubbles.',
				],
				source: '.frame, .chat, .stream, .reading, .dock',
				tags: ['jupiter-onboarding-root', 'jupiter-onboarding-stream', 'jupiter-onboarding-dock'],
			},
			{
				description:
					'Inline OAuth explainer with permission list, privacy note, and back/continue actions.',
				existing: 'GoogleCalendarPermissions',
				name: 'Google Permissions Card',
				notes: [
					'Needs role/label/description treatment when rendered inside the stream.',
					'Permission rows should say what Google access enables in practitioner terms.',
				],
				source: 'permissionsBox()',
				tags: ['jupiter-onboarding-google-permissions', 'jupiter-onboarding-google-permission-*'],
			},
			{
				description:
					'Calendar list and confirmation action after Google connection.',
				existing: 'GoogleCalendarPicker',
				name: 'Calendar Picker Card',
				notes: [
					'Calendar name is important context for imported-source messaging.',
					'Primary calendar gets a badge but still remains selectable.',
				],
				source: 'pickerBox()',
				tags: ['jupiter-onboarding-calendar-picker', 'jupiter-onboarding-calendar-list'],
			},
			{
				description:
					'Final state review with source status, rows, footer, publish state, and reset action.',
				existing: 'AvailabilityPreviewCard',
				name: 'Availability Preview Card',
				notes: [
					'Publish copy changes by source and by state.',
					'Success state disables publish so it cannot be triggered twice.',
					'Footer explains the consequence of Google import/manual setup.',
				],
				source: 'previewBox(data)',
				tags: ['jupiter-onboarding-preview-card', 'jupiter-onboarding-preview-publish'],
			},
		],
	},
	{
		description:
			'Reusable screen-level paths in the onboarding journey.',
		level: 'Templates',
		shortName: 'Flows',
		tone: 'red',
		items: [
			{
				description:
					'Starts with Google already connected, skips OAuth, then offers import or manual setup.',
				existing: 'useJupiterFlow Google status branch',
				name: 'Google Connected Template',
				notes: [
					'Best path to fastest value when the user has already connected Google.',
					'Should make the imported outcome visible before asking for publish.',
				],
				source: 'start(true)',
				tags: ['jupiter-onboarding-google-success', 'jupiter-onboarding-import-flag'],
			},
			{
				description:
					'Starts with no Google connection and introduces permissions before the picker.',
				existing: 'GoogleCalendarPermissions + GoogleCalendarPicker + GoogleCalendarSuccess',
				name: 'No Google Template',
				notes: [
					'Uses a custom screen before the OAuth permission handoff.',
					'Back returns to the start choice.',
				],
				source: 'start(false)',
				tags: ['jupiter-onboarding-google-permissions', 'jupiter-onboarding-calendar-picker'],
			},
			{
				description:
					'Collects days, hours, duration, session type, timezone, recurrence, then preview.',
				existing: 'manual path in useJupiterFlow',
				name: 'Manual Setup Template',
				notes: [
					'Every question includes a lightweight note explaining why Jupiter asks.',
					'Custom composer appears only when useful.',
				],
				source: 'manualFromDays(ctx)',
				tags: ['jupiter-onboarding-working-days-chips', 'jupiter-onboarding-time-range-chips'],
			},
		],
	},
	{
		description:
			'The full page route that documents this inventory and lets the team validate component coverage.',
		level: 'Page',
		shortName: 'Route',
		tone: 'neutral',
		items: [
			{
				description:
					'React documentation board for the onboarding mock, available in the app shell.',
				existing: 'This route: /preview-2',
				name: 'Onboarding Preview 2',
				notes: [
					'Use it to review component boundaries before production implementation.',
					'Keep it testable even when no availability record exists.',
				],
				source: 'OnboardingPreview2.tsx',
				tags: ['availability-preview-2-root'],
			},
		],
	},
];

export const DATA_TAG_GROUPS: DataTagGroup[] = [
	{
		description: 'Top-level shell and scroll regions.',
		name: 'Shell',
		tags: [
			'availability-workspace-header',
			'jupiter-onboarding-root',
			'jupiter-onboarding-stream',
			'jupiter-onboarding-dock',
		],
	},
	{
		description: 'Conversation rendering and grouped message assertions.',
		name: 'Conversation',
		tags: [
			'jupiter-onboarding-message-bot-*',
			'jupiter-onboarding-message-user-*',
			'jupiter-onboarding-bubble-bot-*',
			'jupiter-onboarding-bubble-user-*',
			'jupiter-onboarding-avatar',
		],
	},
	{
		description: 'Question controls, custom input, and send actions.',
		name: 'Controls',
		tags: [
			'jupiter-onboarding-*-chips',
			'jupiter-onboarding-*-chip-*',
			'jupiter-onboarding-*-continue',
			'jupiter-onboarding-composer',
			'jupiter-onboarding-composer-send',
		],
	},
	{
		description: 'Google connection, import, and calendar selection surfaces.',
		name: 'Google Path',
		tags: [
			'jupiter-onboarding-google-permissions',
			'jupiter-onboarding-google-permission-*',
			'jupiter-onboarding-calendar-picker',
			'jupiter-onboarding-calendar-option-*',
			'jupiter-onboarding-import-flag',
		],
	},
	{
		description: 'Final review, publish states, and reset path.',
		name: 'Preview',
		tags: [
			'jupiter-onboarding-preview-card',
			'jupiter-onboarding-preview-status',
			'jupiter-onboarding-preview-row-*',
			'jupiter-onboarding-preview-value-*',
			'jupiter-onboarding-preview-publish',
			'jupiter-onboarding-preview-reset',
		],
	},
];

export const FLOW_TEMPLATES: FlowTemplate[] = [
	{
		name: 'Google Already Connected',
		path: 'Start → Google success → Use existing schedule → Import summary → Questions → Preview',
		states: [
			'Skips OAuth',
			'Imports working days and hours',
			'Shows import flag with calendar name',
			'Publishes with source-specific copy',
		],
	},
	{
		name: 'No Google, Connect',
		path: 'Start → Permissions → Calendar picker → Google success → Import or set hours',
		states: [
			'Explains permission value before OAuth',
			'Lets practitioner choose calendar',
			'Preserves manual fallback',
			'Uses Google source note before the next choice',
		],
	},
	{
		name: 'Manual Setup',
		path: 'Start → Working days → Hours → Duration → Session type → Timezone → Recurrence → Preview',
		states: [
			'Fastest no-Google path',
			'Custom composer appears only when needed',
			'Question notes explain why each answer matters',
			'Preview warns that external busy time is not checked',
		],
	},
];

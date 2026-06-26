import { useEffect, useRef, useState } from 'react';
import { CheckSuccess, Google, Jupiter } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
	BotBubble,
	UserBubble,
} from '../jupiter-conversation/JupiterConversation.styles';
import { JupiterThinking } from '../jupiter-conversation/JupiterThinking';
import { StatusNote } from '../jupiter-conversation/status-note/StatusNote';
import type { StatusNoteType } from '../jupiter-conversation/status-note/StatusNote.types';

import {
	AvatarAtom,
	BoxShellAtom,
	CalendarBadge,
	CalendarOptionAtom,
	ChipAtom,
	DoneAtom,
	Dot,
	PermissionItemAtom,
	PreviewPublishButton,
	PreviewResetButton,
	PreviewRowAtom,
	PreviewRowLabel,
	PreviewRowValue,
	SenderLabel,
	StatusPillAtom,
} from './AvailabilityComponentsPreview.styles';
import { ComposerDemo } from './ComposerDemo';
import {
	BoxButtonRow,
	BoxList,
	BoxMuted,
	BoxTitle,
	ExampleChat,
	ExampleChipsRow,
	ExampleDock,
	ExampleDockInner,
	ExampleFrame,
	ExampleGroup,
	ExampleHeader,
	ExampleHeaderSubtitle,
	ExampleHeaderTitle,
	ExampleReading,
	ExampleStack,
	ExampleStream,
	PreviewHead,
	PreviewRows,
	PublishGroup,
} from './FullViewExample.styles';

const TID = 'jupiter-onboarding';
const TYPING_DELAY = 700;
const SETTLE_DELAY = 250;
const DETECTED_TZ = 'America/Sao_Paulo';

type ControlKind =
	| 'none'
	| 'permissions'
	| 'picker'
	| 'preview'
	| 'recurrence'
	| 'session-duration'
	| 'session-type'
	| 'start'
	| 'success'
	| 'time-range'
	| 'timezone'
	| 'timezone-custom'
	| 'working-days';

type Source = 'google-import' | 'google-manual' | 'manual';
type PublishState = 'idle' | 'publishing' | 'success';

interface Note {
	id: string;
	text: string;
	type: StatusNoteType;
}

interface Message {
	avatarId?: string;
	bubbles: { id: string; text: string }[];
	id: string;
	note?: Note;
	sender: 'bot' | 'user';
	senderId?: string;
	stackId: string;
}

interface Answers {
	calendarName?: string;
	days?: string;
	duration?: string;
	hours?: string;
	recurrence?: string;
	source: Source;
	type?: string;
	tz?: string;
}

const CALENDARS = [
	{ color: '#683fff', id: 'primary', name: 'Gustavo (Primary)', primary: true },
	{ color: '#00C777', id: 'work', name: 'Work', primary: false },
	{ color: '#FF99C8', id: 'clinic', name: 'Clinic room', primary: false },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Message + note builders (keep ids stable + unique per turn) ─────────────

const noteOf = (key: string, type: StatusNoteType, text: string): Note => ({
	id: `${TID}-${key}`,
	text,
	type,
});

const botQuestion = (key: string, text: string, note?: Note): Message => ({
	avatarId: `${TID}-avatar-${key}`,
	bubbles: [{ id: `${TID}-bubble-bot-${key}`, text }],
	id: `${TID}-message-bot-${key}`,
	note,
	sender: 'bot',
	senderId: `${TID}-sender-${key}`,
	stackId: `${TID}-stack-${key}`,
});

const userReply = (key: string, text: string): Message => ({
	bubbles: [{ id: `${TID}-bubble-user-${key}`, text }],
	id: `${TID}-message-user-${key}`,
	sender: 'user',
	stackId: `${TID}-stack-user-${key}`,
});

const greetingMessage: Message = {
	avatarId: `${TID}-avatar-0`,
	bubbles: [
		{ id: `${TID}-bubble-bot-0`, text: 'Hi! I\'m Jupiter, your scheduling assistant.' },
		{
			id: `${TID}-bubble-bot-1`,
			text: 'Let\'s set up your availability — how would you like to begin?',
		},
	],
	id: `${TID}-message-bot-0`,
	note: noteOf(
		'start-choice-note',
		'info',
		'This choice decides whether I infer your schedule from Google or build clean availability from your answers.'
	),
	sender: 'bot',
	senderId: `${TID}-sender-0`,
	stackId: `${TID}-stack-0`,
};

const SOURCE_COPY: Record<
	Source,
	{ footer: string; publish: Record<PublishState, string>; status: string }
> = {
	'google-import': {
		footer:
			'This schedule was inferred from your calendar. Review it now; you can fine-tune everything afterwards.',
		publish: {
			idle: 'Publish imported availability',
			publishing: 'Publishing imported availability…',
			success: 'Imported availability published',
		},
		status: 'Imported from Google',
	},
	'google-manual': {
		footer:
			'Google busy time will be respected. You can fine-tune everything in the calendar afterwards.',
		publish: {
			idle: 'Publish with Google sync',
			publishing: 'Publishing with Google sync…',
			success: 'Google-synced availability published',
		},
		status: 'Google connected',
	},
	manual: {
		footer:
			'Google is not connected yet. Psycron can publish these hours now, but external busy time will not be checked.',
		publish: {
			idle: 'Publish without Google',
			publishing: 'Publishing without Google…',
			success: 'Availability published',
		},
		status: 'Manual setup',
	},
};

// Interactive composition of the catalog atoms walking the full onboarding:
// start → (Google connect → permissions → picker → success → import/manual) or
// (manual) → days → hours → duration → type → timezone → recurrence → preview
// → publish → done. Each bot turn shows the typing dots before its message.
export const FullViewExample = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [typing, setTyping] = useState(false);
	const [control, setControl] = useState<ControlKind>('none');
	const [selectedCalendarId, setSelectedCalendarId] = useState('primary');
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [answers, setAnswers] = useState<Answers>({ source: 'manual' });
	const [publishState, setPublishState] = useState<PublishState>('idle');
	const hasStarted = useRef(false);

	const sleep = (ms: number) =>
		new Promise((resolve) =>
			setTimeout(resolve, prefersReducedMotion() ? 0 : ms)
		);

	const addUserMessage = (message: Message) =>
		setMessages((prev) => [...prev, message]);

	const addBotMessage = async (message: Message) => {
		setTyping(true);
		await sleep(TYPING_DELAY);
		setTyping(false);
		setMessages((prev) => [...prev, message]);
		await sleep(SETTLE_DELAY);
	};

	// Push a bot question then hand control to its dock affordance.
	const ask = async (message: Message, next: ControlKind) => {
		setControl('none');
		await addBotMessage(message);
		setControl(next);
	};

	useEffect(() => {
		if (hasStarted.current) return;
		hasStarted.current = true;
		(async () => {
			await addBotMessage(greetingMessage);
			setControl('start');
		})();
		// Run-once greeting on mount; deps intentionally empty (dev-only preview).
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const resetToStart = () => {
		setMessages([greetingMessage]);
		setSelectedDays([]);
		setAnswers({ source: 'manual' });
		setPublishState('idle');
		setControl('start');
	};

	// ─── Google branch ─────────────────────────────────────────────────────────

	const handleConnectGoogle = async () => {
		addUserMessage(userReply('connect', 'Connect Google Calendar'));
		await ask(
			botQuestion(
				'2',
				'Great — I\'ll need permission to read your Google Calendar.',
				noteOf(
					'google-permission-note',
					'google',
					'Google access lets Psycron detect busy time and avoid showing unsafe booking slots to patients.'
				)
			),
			'permissions'
		);
	};

	const handleAllowAccess = async () => {
		setControl('none');
		addUserMessage(userReply('allow', 'Allow access'));
		await addBotMessage(botQuestion('4', 'Connecting to Google…'));
		await sleep(TYPING_DELAY);
		setControl('picker');
	};

	const handleConfirmCalendar = async () => {
		const picked = CALENDARS.find((cal) => cal.id === selectedCalendarId);
		const calendarName = picked?.name ?? 'Google Calendar';
		setAnswers((prev) => ({ ...prev, calendarName, source: 'google-manual' }));
		addUserMessage(userReply('calendar', calendarName));
		await ask(
			{
				avatarId: `${TID}-avatar-6`,
				bubbles: [
					{ id: `${TID}-bubble-bot-4`, text: 'Your Google Calendar is connected!' },
					{
						id: `${TID}-bubble-bot-5`,
						text: 'Want me to use your existing schedule, or set your hours from scratch?',
					},
				],
				id: `${TID}-message-bot-6`,
				note: noteOf(
					'google-source-choice-note',
					'google',
					'Use existing schedule if Google reflects your real practice. Set hours from scratch if Google is noisy or incomplete.'
				),
				sender: 'bot',
				senderId: `${TID}-sender-6`,
				stackId: `${TID}-stack-6`,
			},
			'success'
		);
	};

	const handleUseExisting = async () => {
		setControl('none');
		addUserMessage(userReply('use-existing', 'Use my existing schedule as availability'));
		await addBotMessage(
			botQuestion('importing', 'Give me a moment — importing your schedule from Google Calendar…')
		);
		setAnswers((prev) => ({
			...prev,
			days: 'Mon, Wed, Thu, Fri',
			hours: '09:00 – 18:30',
			source: 'google-import',
		}));
		await ask(
			botQuestion(
				'imported',
				'Done! I found Mon, Wed, Thu, Fri, around 09:00 – 18:30 (in your timezone).',
				noteOf(
					'import-flag',
					'success',
					`Imported from ${
						CALENDARS.find((c) => c.id === selectedCalendarId)?.name ??
						'Google Calendar'
					}`
				)
			),
			'none'
		);
		await askSessionDuration();
	};

	const handleDefineHours = async () => {
		setAnswers((prev) => ({ ...prev, source: 'google-manual' }));
		addUserMessage(userReply('define-hours', 'Set hours from scratch'));
		await askWorkingDays();
	};

	// ─── Manual branch ───────────────────────────────────────────────────────

	const handleCreateManually = async () => {
		setAnswers({ calendarName: 'Not connected', source: 'manual' });
		addUserMessage(userReply('manual', 'Create manually'));
		await askWorkingDays();
	};

	const askWorkingDays = () =>
		ask(
			botQuestion(
				'working-days',
				'Which days do you usually work?',
				noteOf(
					'working-days-note',
					'info',
					'Only selected days become patient-bookable. You can still block exceptions later in the calendar.'
				)
			),
			'working-days'
		);

	const handleWorkingDaysContinue = async () => {
		if (!selectedDays.length) return;
		const label = selectedDays.join(', ');
		setAnswers((prev) => ({ ...prev, days: label }));
		setControl('none');
		addUserMessage(userReply('working-days', label));
		await ask(
			botQuestion(
				'time-range',
				'What hours, roughly?',
				noteOf(
					'time-range-note',
					'info',
					'This sets the outer working window. Booked sessions and Google busy time can still block parts of the day.'
				)
			),
			'time-range'
		);
	};

	const handlePickTimeRange = async (label: string) => {
		setAnswers((prev) => ({ ...prev, hours: label }));
		setControl('none');
		addUserMessage(userReply('time-range', label));
		await askSessionDuration();
	};

	// ─── Shared tail (duration → preview) ────────────────────────────────────

	const askSessionDuration = () =>
		ask(
			botQuestion(
				'session-duration',
				'How long is a typical session?',
				noteOf(
					'session-duration-note',
					'info',
					'Session length controls how Psycron splits your available hours into patient-bookable slots.'
				)
			),
			'session-duration'
		);

	const handlePickDuration = async (label: string) => {
		setAnswers((prev) => ({ ...prev, duration: label }));
		setControl('none');
		addUserMessage(userReply('session-duration', label));
		await ask(
			botQuestion(
				'session-type',
				'Are your sessions online, in person, or both?',
				noteOf(
					'session-type-note',
					'info',
					'Patients need to know whether a slot needs a video link, an address, or a choice before they book.'
				)
			),
			'session-type'
		);
	};

	const handlePickType = async (label: string) => {
		setAnswers((prev) => ({ ...prev, type: label }));
		setControl('none');
		addUserMessage(userReply('session-type', label));
		await ask(
			botQuestion(
				'timezone',
				`Your timezone looks like ${DETECTED_TZ}. Is that right?`,
				noteOf(
					'timezone-note',
					'warning',
					'Timezone protects bookings across Brazil, Portugal, travel, and daylight-saving changes.'
				)
			),
			'timezone'
		);
	};

	const askRecurrence = () =>
		ask(
			botQuestion(
				'recurrence',
				'Should this repeat weekly or monthly?',
				noteOf(
					'recurrence-note',
					'info',
					'Weekly repeats the same times every week. Monthly repeats once per month — better for occasional clinic days.'
				)
			),
			'recurrence'
		);

	const handleTimezoneYes = async () => {
		setAnswers((prev) => ({ ...prev, tz: DETECTED_TZ }));
		setControl('none');
		addUserMessage(userReply('timezone', 'Yes, that\'s right'));
		await askRecurrence();
	};

	const handleTimezoneNo = async () => {
		setControl('none');
		addUserMessage(userReply('timezone', 'No, change it'));
		await ask(
			botQuestion('timezone-followup', 'No problem — type your timezone.'),
			'timezone-custom'
		);
	};

	const handleTimezoneCustom = async (tz: string) => {
		setAnswers((prev) => ({ ...prev, tz }));
		setControl('none');
		addUserMessage(userReply('timezone-custom', tz));
		await askRecurrence();
	};

	const handlePickRecurrence = async (label: string) => {
		setAnswers((prev) => ({ ...prev, recurrence: label }));
		setControl('none');
		addUserMessage(userReply('recurrence', label));
		await ask(
			botQuestion(
				'preview',
				'Here\'s what I\'ve got — review and publish.',
				noteOf(
					'preview-note',
					'success',
					'This is the last check before patients can see these times on your booking page.'
				)
			),
			'preview'
		);
	};

	const handlePublish = async () => {
		if (publishState !== 'idle') return;
		setPublishState('publishing');
		await sleep(900);
		setPublishState('success');
		setControl('none');
		await addBotMessage(
			botQuestion(
				'done',
				'All set. Your availability is live. You can tweak it any time in the calendar.'
			)
		);
		setControl('done');
	};

	// ─── Render ──────────────────────────────────────────────────────────────

	const renderMessage = (message: Message) => {
		if (message.sender === 'user') {
			return (
				<ExampleGroup
					key={message.id}
					id={message.id}
					data-testid={message.id}
					sender='user'
				>
					<ExampleStack id={message.stackId} sender='user'>
						{message.bubbles.map((bubble, index) => (
							<UserBubble
								key={bubble.id}
								id={bubble.id}
								isFirst={index === 0}
								isLast={index === message.bubbles.length - 1}
							>
								{bubble.text}
							</UserBubble>
						))}
					</ExampleStack>
				</ExampleGroup>
			);
		}

		return (
			<ExampleGroup
				key={message.id}
				id={message.id}
				data-testid={message.id}
				sender='bot'
			>
				<AvatarAtom id={message.avatarId} aria-hidden='true'>
					<Jupiter />
				</AvatarAtom>
				<ExampleStack id={message.stackId} sender='bot'>
					<SenderLabel id={message.senderId}>Jupiter</SenderLabel>
					{message.bubbles.map((bubble, index) => (
						<BotBubble
							key={bubble.id}
							id={bubble.id}
							isFirst={index === 0}
							isLast={index === message.bubbles.length - 1}
						>
							{bubble.text}
						</BotBubble>
					))}
					{message.note && (
						<StatusNote
							id={message.note.id}
							testId={message.note.id}
							type={message.note.type}
							text={message.note.text}
						/>
					)}
				</ExampleStack>
			</ExampleGroup>
		);
	};

	const previewRows = [
		{ color: palette.brand.google, key: 'calendar', label: 'Calendar', value: answers.calendarName ?? 'Not connected' },
		{ color: palette.primary.main, key: 'days', label: 'Days', value: answers.days ?? '—' },
		{ color: palette.secondary.main, key: 'hours', label: 'Hours', value: answers.hours ?? '—' },
		{ color: palette.tertiary.main, key: 'duration', label: 'Session', value: answers.duration ?? '—' },
		{ color: palette.success.main, key: 'session-type', label: 'Type', value: answers.type ?? '—' },
		{ color: palette.info.main, key: 'timezone', label: 'Timezone', value: answers.tz ?? DETECTED_TZ },
		{ color: palette.warning.main, key: 'recurrence', label: 'Repeats', value: answers.recurrence ?? '—' },
	];

	const sourceCopy = SOURCE_COPY[answers.source];

	const renderChip = (
		key: string,
		label: string,
		onClick: () => void,
		variant?: 'google' | 'primary'
	) => (
		<ChipAtom
			id={`${TID}-${key}`}
			data-testid={`${TID}-${key}`}
			type='button'
			chipVariant={variant}
			onClick={onClick}
		>
			{variant === 'google' && <Google />}
			{label}
		</ChipAtom>
	);

	return (
		<ExampleFrame data-testid={`${TID}-root`}>
			<ExampleHeader data-testid='availability-workspace-header'>
				<ExampleHeaderTitle>Create availability</ExampleHeaderTitle>
				<ExampleHeaderSubtitle>
					Set up your working availability with Jupiter, then review it in the
					calendar workspace.
				</ExampleHeaderSubtitle>
			</ExampleHeader>

			<ExampleChat>
				<ExampleStream id={`${TID}-stream`} data-testid={`${TID}-stream`}>
					<ExampleReading id={`${TID}-reading`}>
						{messages.map(renderMessage)}

						{typing && (
							<ExampleGroup
								id={`${TID}-typing`}
								data-testid={`${TID}-typing`}
								sender='bot'
							>
								<AvatarAtom aria-hidden='true'>
									<Jupiter />
								</AvatarAtom>
								<ExampleStack sender='bot'>
									<JupiterThinking />
								</ExampleStack>
							</ExampleGroup>
						)}
					</ExampleReading>
				</ExampleStream>

				<ExampleDock id={`${TID}-dock`} data-testid={`${TID}-dock`}>
					<ExampleDockInner id={`${TID}-dock-inner`}>
						{control === 'start' && (
							<ExampleChipsRow
								id={`${TID}-calendar-chips`}
								data-testid={`${TID}-calendar-chips`}
							>
								{renderChip(
									'calendar-chip-google',
									'Connect Google Calendar',
									handleConnectGoogle,
									'google'
								)}
								{renderChip(
									'calendar-chip-manual',
									'Create manually',
									handleCreateManually
								)}
							</ExampleChipsRow>
						)}

						{control === 'permissions' && (
							<BoxShellAtom
								id={`${TID}-google-permissions`}
								data-testid={`${TID}-google-permissions`}
								role='group'
								aria-labelledby={`${TID}-google-permissions-title`}
								aria-describedby={`${TID}-google-permissions-desc`}
							>
								<BoxTitle id={`${TID}-google-permissions-title`}>
									Connect Google Calendar
								</BoxTitle>
								<BoxList aria-label='Google Calendar access Psycron will request'>
									<PermissionItemAtom as='li' id={`${TID}-google-permission-1`}>
										<CheckSuccess aria-hidden='true' focusable='false' />
										<span>See the times you are busy</span>
									</PermissionItemAtom>
									<PermissionItemAtom as='li' id={`${TID}-google-permission-2`}>
										<CheckSuccess aria-hidden='true' focusable='false' />
										<span>Read your existing working hours</span>
									</PermissionItemAtom>
									<PermissionItemAtom as='li' id={`${TID}-google-permission-3`}>
										<CheckSuccess aria-hidden='true' focusable='false' />
										<span>Add new sessions you book in Psycron</span>
									</PermissionItemAtom>
								</BoxList>
								<BoxMuted id={`${TID}-google-permissions-desc`}>
									We never edit or share your existing events. You can disconnect
									Google any time.
								</BoxMuted>
								<BoxButtonRow>
									<ChipAtom
										id={`${TID}-google-permissions-back`}
										data-testid={`${TID}-google-permissions-back`}
										type='button'
										aria-label='Go back without connecting Google Calendar'
										onClick={resetToStart}
									>
										Back
									</ChipAtom>
									<ChipAtom
										id={`${TID}-google-permissions-continue`}
										data-testid={`${TID}-google-permissions-continue`}
										type='button'
										chipVariant='primary'
										onClick={handleAllowAccess}
									>
										Allow access
									</ChipAtom>
								</BoxButtonRow>
							</BoxShellAtom>
						)}

						{control === 'picker' && (
							<BoxShellAtom
								id={`${TID}-calendar-picker`}
								data-testid={`${TID}-calendar-picker`}
							>
								<BoxTitle>Which calendar should I read?</BoxTitle>
								<BoxList id={`${TID}-calendar-list`} aria-label='Choose a calendar'>
									{CALENDARS.map((cal) => (
										<CalendarOptionAtom
											key={cal.id}
											as='li'
											id={`${TID}-calendar-option-${cal.id}`}
											data-testid={`${TID}-calendar-option-${cal.id}`}
											role='radio'
											aria-checked={selectedCalendarId === cal.id}
											selected={selectedCalendarId === cal.id}
											onClick={() => setSelectedCalendarId(cal.id)}
										>
											<Dot dotColor={cal.color} />
											{cal.name}
											{cal.primary && <CalendarBadge>Primary</CalendarBadge>}
										</CalendarOptionAtom>
									))}
								</BoxList>
								<ChipAtom
									id={`${TID}-calendar-picker-confirm`}
									data-testid={`${TID}-calendar-picker-confirm`}
									type='button'
									chipVariant='primary'
									onClick={handleConfirmCalendar}
								>
									Use this calendar
								</ChipAtom>
							</BoxShellAtom>
						)}

						{control === 'success' && (
							<ExampleChipsRow
								id={`${TID}-google-success-chips`}
								data-testid={`${TID}-google-success-chips`}
							>
								{renderChip(
									'google-success-chip-use-existing',
									'Use my existing schedule',
									handleUseExisting,
									'primary'
								)}
								{renderChip(
									'google-success-chip-define-hours',
									'Set hours from scratch',
									handleDefineHours
								)}
							</ExampleChipsRow>
						)}

						{control === 'working-days' && (
							<ExampleChipsRow
								id={`${TID}-working-days-chips`}
								data-testid={`${TID}-working-days-chips`}
							>
								{DAYS.map((day) => (
									<ChipAtom
										key={day}
										id={`${TID}-working-days-chip-${day.toLowerCase()}`}
										data-testid={`${TID}-working-days-chip-${day.toLowerCase()}`}
										type='button'
										role='checkbox'
										aria-checked={selectedDays.includes(day)}
										checked={selectedDays.includes(day)}
										onClick={() =>
											setSelectedDays((prev) =>
												prev.includes(day)
													? prev.filter((d) => d !== day)
													: [...prev, day]
											)
										}
									>
										{day}
									</ChipAtom>
								))}
								<ChipAtom
									id={`${TID}-working-days-continue`}
									data-testid={`${TID}-working-days-continue`}
									type='button'
									chipVariant='primary'
									onClick={handleWorkingDaysContinue}
								>
									Continue
								</ChipAtom>
							</ExampleChipsRow>
						)}

						{control === 'time-range' && (
							<ExampleChipsRow
								id={`${TID}-time-range-chips`}
								data-testid={`${TID}-time-range-chips`}
							>
								{renderChip('time-range-chip-1', 'Morning (08:00–12:00)', () =>
									handlePickTimeRange('Morning (08:00–12:00)')
								)}
								{renderChip('time-range-chip-2', 'Afternoon (13:00–18:00)', () =>
									handlePickTimeRange('Afternoon (13:00–18:00)')
								)}
								{renderChip('time-range-chip-3', 'Full day (08:00–18:00)', () =>
									handlePickTimeRange('Full day (08:00–18:00)')
								)}
							</ExampleChipsRow>
						)}

						{control === 'session-duration' && (
							<ExampleChipsRow
								id={`${TID}-session-duration-chips`}
								data-testid={`${TID}-session-duration-chips`}
							>
								{renderChip('session-duration-chip-45', '45 min', () =>
									handlePickDuration('45 min'), 'primary'
								)}
								{renderChip('session-duration-chip-60', '60 min', () =>
									handlePickDuration('60 min')
								)}
							</ExampleChipsRow>
						)}

						{control === 'session-type' && (
							<ExampleChipsRow
								id={`${TID}-session-type-chips`}
								data-testid={`${TID}-session-type-chips`}
							>
								{renderChip('session-type-chip-online', 'Online', () =>
									handlePickType('Online')
								)}
								{renderChip('session-type-chip-in-person', 'In person', () =>
									handlePickType('In person')
								)}
								{renderChip('session-type-chip-both', 'Both', () =>
									handlePickType('Both')
								)}
							</ExampleChipsRow>
						)}

						{control === 'timezone' && (
							<ExampleChipsRow
								id={`${TID}-timezone-chips`}
								data-testid={`${TID}-timezone-chips`}
							>
								{renderChip(
									'timezone-chip-yes',
									'Yes, that\'s right',
									handleTimezoneYes
								)}
								{renderChip('timezone-chip-no', 'No, change it', handleTimezoneNo)}
							</ExampleChipsRow>
						)}

						{control === 'timezone-custom' && (
							<ComposerDemo
								idPrefix={`${TID}-timezone`}
								placeholder='Type your timezone, e.g. Europe/Lisbon'
								onSubmit={handleTimezoneCustom}
							/>
						)}

						{control === 'recurrence' && (
							<ExampleChipsRow
								id={`${TID}-recurrence-chips`}
								data-testid={`${TID}-recurrence-chips`}
							>
								{renderChip('recurrence-chip-weekly', 'Weekly', () =>
									handlePickRecurrence('Weekly'), 'primary'
								)}
								{renderChip('recurrence-chip-monthly', 'Monthly', () =>
									handlePickRecurrence('Monthly')
								)}
							</ExampleChipsRow>
						)}

						{control === 'preview' && (
							<BoxShellAtom
								id={`${TID}-preview-card`}
								data-testid={`${TID}-preview-card`}
							>
								<PreviewHead>
									<BoxTitle>Your availability</BoxTitle>
									<StatusPillAtom data-testid={`${TID}-preview-status`}>
										{sourceCopy.status}
									</StatusPillAtom>
								</PreviewHead>
								<PreviewRows>
									{previewRows.map((row) => (
										<PreviewRowAtom
											key={row.key}
											id={`${TID}-preview-row-${row.key}`}
											data-testid={`${TID}-preview-row-${row.key}`}
										>
											<Dot dotColor={row.color} dotSize={10} />
											<PreviewRowLabel>{row.label}</PreviewRowLabel>
											<PreviewRowValue>{row.value}</PreviewRowValue>
										</PreviewRowAtom>
									))}
								</PreviewRows>
								<BoxMuted id={`${TID}-preview-footer`}>
									{sourceCopy.footer}
								</BoxMuted>
								<PublishGroup>
									<PreviewPublishButton
										id={`${TID}-preview-publish`}
										data-testid={`${TID}-preview-publish`}
										type='button'
										data-publish-state={publishState}
										aria-live='polite'
										aria-busy={publishState === 'publishing'}
										disabled={publishState !== 'idle'}
										onClick={handlePublish}
									>
										{sourceCopy.publish[publishState]}
									</PreviewPublishButton>
									<PreviewResetButton
										id={`${TID}-preview-reset`}
										data-testid={`${TID}-preview-reset`}
										type='button'
										onClick={resetToStart}
									>
										Start over
									</PreviewResetButton>
								</PublishGroup>
							</BoxShellAtom>
						)}

						{control === 'done' && (
							<DoneAtom id={`${TID}-done`} data-testid={`${TID}-done`}>
								Onboarding complete
							</DoneAtom>
						)}
					</ExampleDockInner>
				</ExampleDock>
			</ExampleChat>
		</ExampleFrame>
	);
};

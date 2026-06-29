import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseJupiterInput } from '@psycron/api/jupiter';
import { OtherInput } from '@psycron/components/chat/chips/ChatChips.styles';
import type { IChipOption } from '@psycron/components/chat/chips/ChatChips.types';
import { MultiSelectChips } from '@psycron/components/chat/chips/MultiSelectChips';
import { SingleSelectChips } from '@psycron/components/chat/chips/SingleSelectChips';
import { ChevronLeft, Google, Jupiter, Send } from '@psycron/components/icons';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';

import { AvailabilityPreviewCard } from '../availability-preview-card/AvailabilityPreviewCard';
import { GoogleCalendarPermissions } from '../google-calendar-path/GoogleCalendarPermissions';
import { GoogleCalendarPicker } from '../google-calendar-path/GoogleCalendarPicker';
import { GoogleCalendarSuccess } from '../google-calendar-path/GoogleCalendarSuccess';

import { AnimatedEllipsisText } from './animated-ellipsis-text/AnimatedEllipsisText';
import { StatusNote } from './status-note/StatusNote';
import {
	Avatar,
	BackButton,
	BotBubble,
	BotMessageGroup,
	BotStack,
	CardWrapper,
	ChipsInline,
	ConversationDock,
	ConversationDockInner,
	ConversationReading,
	ConversationStream,
	InputRow,
	SendButton,
	UserBubble,
	UserMessageGroup,
} from './JupiterConversation.styles';
import { JupiterThinking } from './JupiterThinking';
import { useJupiterFlow } from './useJupiterFlow';

const TID = 'jupiter-onboarding';

export const JupiterConversation = () => {
	const { t } = useTranslation();
	const bottomRef = useRef<HTMLDivElement | null>(null);
	const dockRef = useRef<HTMLDivElement | null>(null);

	const [dockHeight, setDockHeight] = useState(0);
	const [customInputFor, setCustomInputFor] = useState<string | null>(null);
	const [customValue, setCustomValue] = useState('');
	const [isParsing, setIsParsing] = useState(false);
	const specialtyRetryCount = useRef(0);

	const { therapistId, userDetails } = useUserDetails();

	const {
		step,
		answers,
		messages,
		calendarList,
		isBotTyping,
		isImporting,
		isLoadingCalendars,
		isPublishing,
		specialityKey,
		workingDaysKey,
		detectedTimezone,
		initFlow,
		handleCalendarChoice,
		handleCalendarPicked,
		handleContinueWithoutSync,
		handleGoogleBack,
		handleGoogleContinue,
		handleGooglePostConnect,
		handlePublish,
		handleRecurrencePattern,
		handleReset,
		handleRetrySync,
		handleSessionDuration,
		handleSessionType,
		handleSpecialty,
		handleSpecialtyFromText,
		handleTimeRange,
		handleTimezone,
		handleTimezoneSelect,
		handleWorkingDays,
		handleWorkingDaysFromText,
		retrySpeciality,
		retryWorkingDays,
	} = useJupiterFlow({
		therapistId,
		userSpecialities: userDetails?.specialities,
	});

	const handleSpecialtyOtherSubmit = useCallback(
		async (raw: string) => {
			// After 2 failed parse attempts, accept raw input to unblock the user
			if (specialtyRetryCount.current >= 2) {
				specialtyRetryCount.current = 0;
				handleSpecialtyFromText([raw]);
				return;
			}

			setIsParsing(true);
			const result = await parseJupiterInput('specialty', raw);
			setIsParsing(false);

			if (result.valid && Array.isArray(result.parsed)) {
				const flag = 'flag' in result ? result.flag : 'accepted';
				if (flag === 'rejected') {
					specialtyRetryCount.current += 1;
					retrySpeciality(true);
				} else if (flag === 'rephrase') {
					specialtyRetryCount.current += 1;
					retrySpeciality(false);
				} else {
					specialtyRetryCount.current = 0;
					handleSpecialtyFromText(result.parsed);
				}
			} else {
				specialtyRetryCount.current += 1;
				retrySpeciality(false);
			}
		},
		[handleSpecialtyFromText, retrySpeciality]
	);

	const handleWorkingDaysOtherSubmit = useCallback(
		async (raw: string) => {
			setIsParsing(true);
			const result = await parseJupiterInput('working-days', raw);
			setIsParsing(false);

			if (result.valid && Array.isArray(result.parsed)) {
				handleWorkingDaysFromText(result.parsed);
			} else {
				retryWorkingDays();
			}
		},
		[handleWorkingDaysFromText, retryWorkingDays]
	);

	useEffect(() => {
		initFlow();
	}, [initFlow]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, step, isBotTyping]);

	// Track the glass dock's height so the stream reserves matching bottom space:
	// the latest message rests just above the dock while older ones scroll behind.
	useEffect(() => {
		const dockElement = dockRef.current;
		if (!dockElement) return;

		const updateHeight = () => setDockHeight(dockElement.offsetHeight);
		updateHeight();

		const observer = new ResizeObserver(updateHeight);
		observer.observe(dockElement);
		return () => observer.disconnect();
	}, [step]);

	const chipOptions = useMemo(
		() => ({
			calendar: [
				{
					icon: (
						<span aria-hidden='true'>
							<Google />
						</span>
					),
					key: 'google',
					label: t('jupiter.calendar-choice.chip-google'),
					variant: 'google' as const,
				},
				{
					key: 'manual',
					label: t('jupiter.calendar-choice.chip-manual'),
					variant: 'secondary' as const,
				},
			] satisfies IChipOption[],
			days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => ({
				key: `chip-${d}`,
				label: t(`jupiter.working-days.chip-${d}`),
			})) satisfies IChipOption[],
			timeRange: [
				{ key: 'chip-1', label: t('jupiter.time-range.chip-1') },
				{ key: 'chip-2', label: t('jupiter.time-range.chip-2') },
				{ key: 'chip-3', label: t('jupiter.time-range.chip-3') },
				{
					key: 'chip-custom',
					label: t('jupiter.time-range.chip-custom'),
					variant: 'outline' as const,
				},
			] satisfies IChipOption[],
			duration: [
				{ key: 'chip-45', label: t('jupiter.session-duration.chip-45') },
				{ key: 'chip-60', label: t('jupiter.session-duration.chip-60') },
				{
					key: 'chip-custom',
					label: t('jupiter.session-duration.chip-custom'),
					variant: 'outline' as const,
				},
			] satisfies IChipOption[],
			sessionType: [
				{ key: 'chip-online', label: t('jupiter.session-type.chip-online') },
				{
					key: 'chip-in-person',
					label: t('jupiter.session-type.chip-in-person'),
				},
				{ key: 'chip-both', label: t('jupiter.session-type.chip-both') },
			] satisfies IChipOption[],
			timezone: [
				{
					key: 'chip-yes',
					label: t('jupiter.timezone.chip-yes'),
					variant: 'success' as const,
				},
				{
					key: 'chip-no',
					label: t('jupiter.timezone.chip-no'),
					variant: 'danger' as const,
				},
			] satisfies IChipOption[],
			specialty: [
				{ key: 'chip-psychologist', label: t('jupiter.specialty.chip-psychologist') },
				{ key: 'chip-physiotherapist', label: t('jupiter.specialty.chip-physiotherapist') },
				{ key: 'chip-nutritionist', label: t('jupiter.specialty.chip-nutritionist') },
				{ key: 'chip-psychiatrist', label: t('jupiter.specialty.chip-psychiatrist') },
				{ key: 'chip-speech-therapist', label: t('jupiter.specialty.chip-speech-therapist') },
				{
					key: 'chip-occupational-therapist',
					label: t('jupiter.specialty.chip-occupational-therapist'),
				},
				{
					key: 'chip-other',
					label: t('jupiter.specialty.chip-other'),
					variant: 'outline' as const,
				},
			] satisfies IChipOption[],
			recurrencePattern: [
				{
					key: 'chip-weekly',
					label: t('jupiter.recurrence-pattern.chip-weekly'),
					variant: 'primary' as const,
				},
				{
					key: 'chip-monthly',
					label: t('jupiter.recurrence-pattern.chip-monthly'),
					variant: 'secondary' as const,
				},
			] satisfies IChipOption[],
		}),
		[t]
	);

	const submitCustomInput = useCallback(
		async (
			stepKey: 'time-range' | 'session-duration',
			onValue: (label: string) => void
		) => {
			const raw = customValue.trim();
			if (!raw || isParsing) return;
			setIsParsing(true);
			const result = await parseJupiterInput(stepKey, raw);
			setIsParsing(false);
			if (result.valid && typeof result.parsed === 'string') {
				onValue(result.parsed);
				setCustomInputFor(null);
				setCustomValue('');
			} else {
				setCustomValue('');
			}
		},
		[customValue, isParsing]
	);

	const renderSelectWithCustom = (
		stepKey: 'time-range' | 'session-duration',
		options: IChipOption[],
		onValue: (label: string) => void,
		placeholder: string
	) => {
		if (customInputFor === stepKey) {
			return (
				<ChipsInline data-testid={`${TID}-${stepKey}-custom`}>
					<InputRow>
						<BackButton
							data-testid={`${TID}-${stepKey}-custom-back`}
							onClick={() => {
								setCustomInputFor(null);
								setCustomValue('');
							}}
						>
							<ChevronLeft />
						</BackButton>
						<OtherInput
							autoFocus
							size='small'
							placeholder={placeholder}
							value={customValue}
							disabled={isParsing}
							data-testid={`${TID}-${stepKey}-custom-input`}
							onChange={(e) => setCustomValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') submitCustomInput(stepKey, onValue);
							}}
							sx={{ mt: 0 }}
						/>
						<SendButton
							hasValue={!!customValue.trim()}
							disabled={!customValue.trim() || isParsing}
							data-testid={`${TID}-${stepKey}-custom-send`}
							onClick={() => submitCustomInput(stepKey, onValue)}
						>
							<Send />
						</SendButton>
					</InputRow>
					{isParsing && (
						<JupiterThinking />
					)}
				</ChipsInline>
			);
		}

		return (
			<ChipsInline data-testid={`${TID}-step-${stepKey}`}>
				<SingleSelectChips
					key={stepKey}
					options={options}
					testIdPrefix={`${TID}-${stepKey}`}
					onSelect={(key) => {
						if (key === 'chip-custom') {
							setCustomInputFor(stepKey);
							return;
						}
						const label = options.find((o) => o.key === key)?.label ?? key;
						onValue(label);
					}}
				/>
			</ChipsInline>
		);
	};

	const renderStepChips = () => {
		switch (step) {
			case 'specialty':
				return (
					<ChipsInline data-testid={`${TID}-step-specialty`}>
						<MultiSelectChips
							key={specialityKey}
							options={chipOptions.specialty}
							testIdPrefix={`${TID}-specialty`}
							onConfirm={handleSpecialty}
							confirmLabel={t('jupiter.specialty.continue')}
							otherChipKey='chip-other'
							otherPlaceholder={t('jupiter.specialty.other-placeholder')}
							onOtherSubmit={handleSpecialtyOtherSubmit}
						/>
						{isParsing && <JupiterThinking />}
					</ChipsInline>
				);

			case 'calendar-choice':
				return (
					<ChipsInline data-testid={`${TID}-step-calendar-choice`}>
						<SingleSelectChips
							key='calendar-choice'
							options={chipOptions.calendar}
							testIdPrefix={`${TID}-calendar`}
							onSelect={handleCalendarChoice}
						/>
					</ChipsInline>
				);

			case 'working-days':
				return (
					<ChipsInline data-testid={`${TID}-step-working-days`}>
						<MultiSelectChips
							key={workingDaysKey}
							options={chipOptions.days}
							testIdPrefix={`${TID}-working-days`}
							onConfirm={handleWorkingDays}
							confirmLabel={t('jupiter.working-days.continue')}
							otherPlaceholder={t('jupiter.working-days.other-placeholder')}
							onOtherSubmit={handleWorkingDaysOtherSubmit}
						/>
						{isParsing && <JupiterThinking />}
					</ChipsInline>
				);

			case 'time-range':
				return renderSelectWithCustom(
					'time-range',
					chipOptions.timeRange,
					handleTimeRange,
					t('jupiter.time-range.chip-custom')
				);

			case 'session-duration':
				return renderSelectWithCustom(
					'session-duration',
					chipOptions.duration,
					handleSessionDuration,
					t('jupiter.session-duration.chip-custom')
				);

			case 'session-type':
				return (
					<ChipsInline data-testid={`${TID}-step-session-type`}>
						<SingleSelectChips
							key='session-type'
							options={chipOptions.sessionType}
							testIdPrefix={`${TID}-session-type`}
							onSelect={handleSessionType}
						/>
					</ChipsInline>
				);

			case 'timezone':
				if (answers.timezoneConfirmed === false) {
					return (
						<ChipsInline data-testid={`${TID}-step-timezone-custom`}>
							<InputRow>
								<OtherInput
									autoFocus
									size='small'
									placeholder={detectedTimezone}
									value={customValue}
									data-testid={`${TID}-timezone-custom-input`}
									onChange={(e) => setCustomValue(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && customValue.trim()) {
											handleTimezoneSelect(customValue.trim());
											setCustomValue('');
										}
									}}
									sx={{ mt: 0 }}
								/>
								<SendButton
									hasValue={!!customValue.trim()}
									disabled={!customValue.trim()}
									data-testid={`${TID}-timezone-custom-send`}
									onClick={() => {
										if (customValue.trim()) {
											handleTimezoneSelect(customValue.trim());
											setCustomValue('');
										}
									}}
								>
									<Send />
								</SendButton>
							</InputRow>
						</ChipsInline>
					);
				}
				return (
					<ChipsInline data-testid={`${TID}-step-timezone`}>
						<SingleSelectChips
							key='timezone'
							options={chipOptions.timezone}
							testIdPrefix={`${TID}-timezone`}
							onSelect={handleTimezone}
						/>
					</ChipsInline>
				);

			case 'recurrence-pattern':
				return (
					<ChipsInline data-testid={`${TID}-step-recurrence-pattern`}>
						<SingleSelectChips
							key='recurrence-pattern'
							options={chipOptions.recurrencePattern}
							testIdPrefix={`${TID}-recurrence`}
							onSelect={handleRecurrencePattern}
						/>
					</ChipsInline>
				);

			case 'preview':
				return (
					<AvailabilityPreviewCard
						answers={answers}
						detectedTimezone={detectedTimezone}
						isPublishing={isPublishing}
						onContinueWithoutSync={handleContinueWithoutSync}
						onPublish={handlePublish}
						onReset={handleReset}
						onRetrySync={handleRetrySync}
					/>
				);

			case 'google-permissions':
				return (
					<GoogleCalendarPermissions
						onContinue={handleGoogleContinue}
						onBack={handleGoogleBack}
					/>
				);

			case 'calendar-picker':
				if (isLoadingCalendars || calendarList.length === 0) return null;
				return (
					<GoogleCalendarPicker
						calendars={calendarList}
						onSelect={handleCalendarPicked}
						onBack={handleGoogleBack}
					/>
				);

			case 'google-success':
				return (
					<GoogleCalendarSuccess
						isImporting={isImporting}
						onSelect={handleGooglePostConnect}
					/>
				);

			case 'done':
				return null;

			default:
				return null;
		}
	};

	return (
		<CardWrapper data-testid={`${TID}-root`} id={`${TID}-root`}>
			<ConversationStream
				bottomInset={dockHeight}
				data-testid={`${TID}-stream`}
				id={`${TID}-stream`}
			>
				<ConversationReading
					aria-live='polite'
					data-testid={`${TID}-reading`}
					id={`${TID}-reading`}
				>
					{messages.map((msg, index) => {
					// Group consecutive messages from the same sender so they render as
					// one merged box (tight gap + squared inner corners).
					const prev = messages[index - 1];
					const next = messages[index + 1];
					const isFirstInGroup = !prev || prev.sender !== msg.sender;
					const isLastInGroup = !next || next.sender !== msg.sender;
					const isGroupStart = index > 0 && isFirstInGroup;

					return msg.sender === 'bot' ? (
						<BotMessageGroup
							key={index}
							isGroupStart={isGroupStart}
							data-testid={`${TID}-message-bot-${index}`}
						>
							<Avatar isVisible={!!msg.showIcon} aria-hidden='true'>
								<Jupiter />
							</Avatar>
							<BotStack>
								<BotBubble
									isFirst={isFirstInGroup}
									isLast={isLastInGroup}
									data-testid={`${TID}-bubble-bot-${index}`}
								>
									<AnimatedEllipsisText text={msg.content} />
								</BotBubble>
								{msg.note && (
									<StatusNote
										id={msg.note.testId}
										testId={msg.note.testId}
										text={msg.note.text}
										type={msg.note.type}
									/>
								)}
							</BotStack>
						</BotMessageGroup>
					) : (
						<UserMessageGroup
							key={index}
							isGroupStart={isGroupStart}
							data-testid={`${TID}-message-user-${index}`}
						>
							<UserBubble
								isFirst={isFirstInGroup}
								isLast={isLastInGroup}
								data-testid={`${TID}-bubble-user-${index}`}
							>
								{msg.content}
							</UserBubble>
						</UserMessageGroup>
					);
				})}
					{isBotTyping && (
						<BotMessageGroup
							isGroupStart
							data-testid={`${TID}-message-bot-typing`}
						>
							<Avatar aria-hidden='true'>
								<Jupiter />
							</Avatar>
							<BotStack>
								<JupiterThinking />
							</BotStack>
						</BotMessageGroup>
					)}
					<div ref={bottomRef} data-testid={`${TID}-stream-bottom`} />
				</ConversationReading>
			</ConversationStream>
			<ConversationDock
				ref={dockRef}
				data-testid={`${TID}-dock`}
				id={`${TID}-dock`}
			>
				<ConversationDockInner
					data-testid={`${TID}-dock-inner`}
					id={`${TID}-dock-inner`}
				>
					{renderStepChips()}
				</ConversationDockInner>
			</ConversationDock>
		</CardWrapper>
	);
};

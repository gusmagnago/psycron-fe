import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseJupiterInput } from '@psycron/api/jupiter';
import { OtherInput } from '@psycron/components/chat/chips/ChatChips.styles';
import type { IChipOption } from '@psycron/components/chat/chips/ChatChips.types';
import { MultiSelectChips } from '@psycron/components/chat/chips/MultiSelectChips';
import { SingleSelectChips } from '@psycron/components/chat/chips/SingleSelectChips';
import { Divider } from '@psycron/components/divider/Divider';
import { ChevronLeft, Jupiter, Send } from '@psycron/components/icons';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';

import { AvailabilityPreviewCard } from '../availability-preview-card/AvailabilityPreviewCard';
import { GoogleCalendarPermissions } from '../google-calendar-path/GoogleCalendarPermissions';
import { GoogleCalendarPicker } from '../google-calendar-path/GoogleCalendarPicker';
import { GoogleCalendarSuccess } from '../google-calendar-path/GoogleCalendarSuccess';

import {
	BackButton,
	BotBubble,
	BotMessageGroup,
	CardHeader,
	CardSubtitle,
	CardTitle,
	CardWrapper,
	ChipsInline,
	ConversationContainer,
	IconRow,
	InputRow,
	PublishingMessageWrapper,
	PublishingOverlay,
	SendButton,
	UserBubble,
	UserMessageGroup,
} from './JupiterConversation.styles';
import { JupiterThinking } from './JupiterThinking';
import { useJupiterFlow } from './useJupiterFlow';

export const JupiterConversation = () => {
	const { t } = useTranslation();
	const bottomRef = useRef<HTMLDivElement | null>(null);

	const [customInputFor, setCustomInputFor] = useState<string | null>(null);
	const [customValue, setCustomValue] = useState('');
	const [isParsing, setIsParsing] = useState(false);

	const { therapistId, userDetails } = useUserDetails();

	const {
		step,
		answers,
		messages,
		calendarList,
		isImporting,
		isLoadingCalendars,
		isPublishing,
		specialityKey,
		workingDaysKey,
		detectedTimezone,
		initFlow,
		handleCalendarChoice,
		handleCalendarPicked,
		handleGoogleBack,
		handleGoogleContinue,
		handleGooglePostConnect,
		handlePublish,
		handleRecurrencePattern,
		handleReset,
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
			setIsParsing(true);
			const result = await parseJupiterInput('specialty', raw);
			setIsParsing(false);

			if (result.valid && Array.isArray(result.parsed)) {
				const flag = 'flag' in result ? result.flag : 'accepted';
				if (flag === 'rejected') {
					retrySpeciality(true);
				} else if (flag === 'rephrase') {
					retrySpeciality(false);
				} else {
					handleSpecialtyFromText(result.parsed);
				}
			} else {
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
	}, [messages, step]);

	const chipOptions = useMemo(
		() => ({
			calendar: [
				{
					key: 'google',
					label: t('jupiter.calendar-choice.chip-google'),
					variant: 'primary' as const,
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
				<ChipsInline>
					<InputRow>
						<BackButton
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
							onChange={(e) => setCustomValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') submitCustomInput(stepKey, onValue);
							}}
							sx={{ mt: 0 }}
						/>
						<SendButton
							hasValue={!!customValue.trim()}
							disabled={!customValue.trim() || isParsing}
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
			<ChipsInline>
				<SingleSelectChips
					key={stepKey}
					options={options}
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
					<ChipsInline>
						<MultiSelectChips
							key={specialityKey}
							options={chipOptions.specialty}
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
					<ChipsInline>
						<SingleSelectChips
							key='calendar-choice'
							options={chipOptions.calendar}
							onSelect={handleCalendarChoice}
						/>
					</ChipsInline>
				);

			case 'working-days':
				return (
					<ChipsInline>
						<MultiSelectChips
							key={workingDaysKey}
							options={chipOptions.days}
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
					<ChipsInline>
						<SingleSelectChips
							key='session-type'
							options={chipOptions.sessionType}
							onSelect={handleSessionType}
						/>
					</ChipsInline>
				);

			case 'timezone':
				if (answers.timezoneConfirmed === false) {
					return (
						<ChipsInline>
							<InputRow>
								<OtherInput
									autoFocus
									size='small'
									placeholder={detectedTimezone}
									value={customValue}
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
					<ChipsInline>
						<SingleSelectChips
							key='timezone'
							options={chipOptions.timezone}
							onSelect={handleTimezone}
						/>
					</ChipsInline>
				);

			case 'recurrence-pattern':
				return (
					<ChipsInline>
						<SingleSelectChips
							key='recurrence-pattern'
							options={chipOptions.recurrencePattern}
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
						onPublish={handlePublish}
						onReset={handleReset}
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
		<CardWrapper>
			<CardHeader>
				<CardTitle>Jupiter</CardTitle>
				<CardSubtitle>{t('jupiter.subtitle')}</CardSubtitle>
			</CardHeader>
			<Divider />
			<ConversationContainer>
				{messages.map((msg, index) =>
					msg.sender === 'bot' ? (
						<BotMessageGroup key={index}>
							<IconRow showIcon={!!msg.showIcon}>
								<Jupiter />
								<BotBubble isFirst={!!msg.showIcon}>{msg.content}</BotBubble>
							</IconRow>
						</BotMessageGroup>
					) : (
						<UserMessageGroup key={index}>
							<UserBubble>{msg.content}</UserBubble>
						</UserMessageGroup>
					)
				)}
				{renderStepChips()}
				<div ref={bottomRef} />
			</ConversationContainer>

			{isPublishing && (
				<>
					<PublishingOverlay />
					<PublishingMessageWrapper>
						<JupiterThinking />
					</PublishingMessageWrapper>
				</>
			)}
		</CardWrapper>
	);
};

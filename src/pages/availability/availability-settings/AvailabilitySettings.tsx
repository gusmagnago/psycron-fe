import { Fragment } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, Switch, TextField, Tooltip } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { DrawerBody, DrawerDesc } from '@psycron/components/drawer/Drawer.styles';
import { SettingsDrawer } from '@psycron/components/drawer/SettingsDrawer';
import { AddressForm } from '@psycron/components/form/components/address/AddressForm';
import { Account, CheckSuccess, Error, Lock, Refresh } from '@psycron/components/icons';
import { JupiterHelpCard } from '@psycron/components/jupiter-help-card/JupiterHelpCard';
import { JupiterTip } from '@psycron/components/jupiter-tip/JupiterTip';
import { Modal } from '@psycron/components/modal/Modal';
import { Select } from '@psycron/components/select/Select';
import { Text } from '@psycron/components/text/Text';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { BufferTimeEditor } from '@psycron/pages/availability/components/buffer-time-editor/BufferTimeEditor';
import { AVAILABILITYGENERATE, PRACTICEIMPORT } from '@psycron/pages/urls';

import {
	CalendarSyncRow,
	ChecklistCard,
	ChecklistDivider,
	ChecklistHeader,
	ChecklistProgress,
	ChecklistProgressBar,
	ChecklistProgressLabel,
	ChecklistRow,
	ChecklistRowContent,
	ChecklistRowDesc,
	ChecklistRowIcon,
	ChecklistRowTitle,
	ChecklistSubtitle,
	ChecklistTitle,
	ChecklistTitleRow,
	DrawerFieldGroup,
	DrawerFieldLabel,
	GcalBanner,
	GcalSyncCard,
	GcalSyncMeta,
	GcalSyncSub,
	GcalSyncTitle,
	JupiterAvailabilityPanel,
	MissingSetupBadge,
	OptionChip,
	OptionChipsRow,
	OptionDesc,
	RecommendedBadge,
	SettingsWrapper,
	StatusCard,
	StatusDivider,
	StatusStat,
	StatusStatLabel,
	StatusStatSub,
	StatusStatValue,
	TimeRangeRow,
	TimeRangeSeparator,
} from './AvailabilitySettings.styles';
import type { ChecklistItem } from './AvailabilitySettings.types';
import { useAvailabilitySettings } from './useAvailabilitySettings';

// ─── Static options ────────────────────────────────────────────────────────────

const WORKING_DAYS = [
	{ key: 'MONDAY', labelKey: 'jupiter.days.MONDAY' },
	{ key: 'TUESDAY', labelKey: 'jupiter.days.TUESDAY' },
	{ key: 'WEDNESDAY', labelKey: 'jupiter.days.WEDNESDAY' },
	{ key: 'THURSDAY', labelKey: 'jupiter.days.THURSDAY' },
	{ key: 'FRIDAY', labelKey: 'jupiter.days.FRIDAY' },
	{ key: 'SATURDAY', labelKey: 'jupiter.days.SATURDAY' },
	{ key: 'SUNDAY', labelKey: 'jupiter.days.SUNDAY' },
];

const SESSION_TYPE_OPTIONS = [
	{ key: 'ONLINE', labelKey: 'availability.settings.session-type-online' },
	{
		key: 'IN_PERSON',
		labelKey: 'availability.settings.session-type-in-person',
	},
	{ key: 'BOTH', labelKey: 'availability.settings.session-type-both' },
];

const SESSION_DURATION_OPTIONS = ['30', '45', '60', '90'];

const SPECIALTY_OPTIONS = [
	{ key: 'PSYCHOLOGY', labelKey: 'availability.settings.specialty-psychology' },
	{ key: 'PSYCHIATRY', labelKey: 'availability.settings.specialty-psychiatry' },
	{ key: 'PHYSIOTHERAPY', labelKey: 'availability.settings.specialty-physiotherapy' },
	{ key: 'NUTRITION', labelKey: 'availability.settings.specialty-nutrition' },
	{ key: 'COACHING', labelKey: 'availability.settings.specialty-coaching' },
	{ key: 'OCCUPATIONAL_THERAPY', labelKey: 'availability.settings.specialty-occupational-therapy' },
	{ key: 'SPEECH_THERAPY', labelKey: 'availability.settings.specialty-speech-therapy' },
	{ key: 'SOCIAL_WORK', labelKey: 'availability.settings.specialty-social-work' },
	{ key: 'OTHER', labelKey: 'availability.settings.specialty-other' },
];

const RECURRENCE_PATTERN_OPTIONS = [
	{
		descKey: 'availability.settings.recurrence-consistent-desc',
		key: 'WEEKLY',
		labelKey: 'availability.settings.recurrence-consistent',
	},
	{
		descKey: 'availability.settings.recurrence-flexible-desc',
		key: 'MONTHLY',
		labelKey: 'availability.settings.recurrence-flexible',
	},
];

const getTimezones = (): string[] => {
	try {
		return Intl.supportedValuesOf('timeZone');
	} catch {
		return [Intl.DateTimeFormat().resolvedOptions().timeZone];
	}
};

const TIMEZONES = getTimezones();

const formatLastSync = (iso: string, locale: string): string => {
	const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
	if (minutes < 1) return rtf.format(0, 'minute');
	if (minutes < 60) return rtf.format(-minutes, 'minute');
	const hours = Math.round(minutes / 60);
	if (hours < 24) return rtf.format(-hours, 'hour');
	return rtf.format(-Math.round(hours / 24), 'day');
};

// ─── Component ─────────────────────────────────────────────────────────────────

export const AvailabilitySettings = () => {
	const { t, i18n } = useTranslation();
	const { locale } = useParams<{ locale: string }>();
	const navigate = useNavigate();

	const {
		activeCount,
		activeDrawer,
		addressFormMethods,
		availability,
		bannerDismissed,
		bufferAdviceRequest,
		bufferInsights,
		bufferInput,
		cancelTimezoneWarning,
		checklistItems,
		closeDrawer,
		configuredCount,
		confirmTimezoneSave,
		endTimeInput,
		firstMissingRecommended,
		handleAddressSave,
		handleBufferSave,
		calendarList,
		handleChangeCalendar,
		handleDisconnectCalendar,
		handleGoogleCalendarConnect,
		handleJupiterCta,
		handleRecurrencePatternSave,
		handleSessionDurationSave,
		handleSpecialtySave,
		handleSyncNow,
		handleToggleCalendarSync,
		isAddressSaving,
		isConnecting,
		isDisconnecting,
		isSyncing,
		isTogglingSync,
		lastSyncAt,
		selectedCalendarId,
		syncEnabled,
		syncError,
		isJupiterCtaEnabled,
		handleSessionTypeSave,
		handleTimezoneSave,
		handleWorkingHoursSave,
		isSaving,
		isLoading,
		progress,
		recurrencePatternInput,
		renderActionLabel,
		showTimezoneWarning,
		sessionDurationInput,
		sessionTypeInput,
		specialtyDetailInput,
		setBannerDismissed,
		setRecurrencePatternInput,
		statusStats,
		setBufferInput,
		setEndTimeInput,
		setSessionDurationInput,
		setSessionTypeInput,
		setSpecialtyDetailInput,
		setSpecialtyInput,
		setStartTimeInput,
		setTimezoneInput,
		specialtyInput,
		startTimeInput,
		timezoneInput,
		toggleWorkingDay,
		workingDaysInput,
	} = useAvailabilitySettings();

	if (isLoading) return null;

	if (!availability) {
		return <Navigate replace to={`/${locale}/${AVAILABILITYGENERATE}`} />;
	}

	const missingRecommendedCount = checklistItems.filter(
		(item) => item.isRecommended && !item.isConfigured && !item.isDisabled
	).length;

	const renderChecklist = () =>
		checklistItems.map((item: ChecklistItem, idx: number) => (
			<Fragment key={`checklist-${item.id}`}>
				<ChecklistRow aria-label={t(item.titleKey)} role='listitem'>
					<ChecklistRowIcon aria-hidden='true' isConfigured={item.isConfigured}>
						{item.isConfigured ? <CheckSuccess /> : null}
					</ChecklistRowIcon>

					<ChecklistRowContent>
						<ChecklistRowTitle>
							{t(item.titleKey)}
							{item.isRecommended && !item.isConfigured && !item.isDisabled && (
								<RecommendedBadge component='span'>
									{t('jupiter.post-publish.checklist-badge-recommended')}
								</RecommendedBadge>
							)}
						</ChecklistRowTitle>
						<ChecklistRowDesc>{t(item.descKey)}</ChecklistRowDesc>
					</ChecklistRowContent>

					<Tooltip
						arrow
						title={
							item.isDisabled && !item.isConfigured
								? t('availability.settings.feature-disabled-tooltip')
								: ''
						}
					>
						<span>
							<Button
								small
								aria-label={`${renderActionLabel(item)} ${t(item.titleKey)}`}
								disabled={item.isDisabled && !item.isConfigured}
								onClick={item.isDisabled ? undefined : item.onConfigure}
								tertiary
								variant={item.isConfigured ? 'contained' : 'outlined'}
							>
								{renderActionLabel(item)}
							</Button>
						</span>
					</Tooltip>
				</ChecklistRow>
				{idx < checklistItems.length - 1 && (
					<ChecklistDivider key={`div-${item.id}`} />
				)}
			</Fragment>
		));

	return (
		<>
			<PageLayout
				isLoading={isLoading}
				backButton
				title={t('availability.settings.page-title')}
			>
				<SettingsWrapper>
					<ChecklistCard>
						<ChecklistHeader>
							<ChecklistTitleRow>
								<ChecklistTitle>
									{t('jupiter.post-publish.checklist-title')}
								</ChecklistTitle>
								{missingRecommendedCount > 0 && (
									<MissingSetupBadge component='span'>
										{t('availability.settings.checklist-todo-badge', {
											count: missingRecommendedCount,
										})}
									</MissingSetupBadge>
								)}
							</ChecklistTitleRow>
							<ChecklistSubtitle>
								{t('jupiter.post-publish.checklist-subtitle')}
							</ChecklistSubtitle>
							<ChecklistProgress>
								<ChecklistProgressBar
									aria-label={t(
										'jupiter.post-publish.checklist-progress-label',
										{
											count: configuredCount,
											total: activeCount,
										}
									)}
									value={progress}
									variant='determinate'
								/>
								<ChecklistProgressLabel>
									{configuredCount}/{activeCount}
								</ChecklistProgressLabel>
							</ChecklistProgress>
						</ChecklistHeader>

						<ChecklistDivider />

						{renderChecklist()}
					</ChecklistCard>
					<JupiterAvailabilityPanel>
						<StatusCard>
							<StatusStat>
								<StatusStatValue>
									{statusStats.activeHoursPerWeek}h
								</StatusStatValue>
								<StatusStatLabel>
									{t('jupiter.post-publish.status-active-hours')}
								</StatusStatLabel>
								<StatusStatSub>
									{t('jupiter.post-publish.status-this-week')}
								</StatusStatSub>
							</StatusStat>
							<StatusDivider />
							<StatusStat>
								<StatusStatValue>
									{statusStats.upcomingBookings}
								</StatusStatValue>
								<StatusStatLabel>
									{t('jupiter.post-publish.status-bookings')}
								</StatusStatLabel>
								{statusStats.upcomingBookings > 0 && (
									<StatusStatSub>
										{t('jupiter.post-publish.status-booked-label', {
											percent: statusStats.percentBooked,
										})}
									</StatusStatSub>
								)}
							</StatusStat>
						</StatusCard>

						{!bannerDismissed && firstMissingRecommended && (
							<JupiterTip
								ariaLabel={t('jupiter.post-publish.tip-title')}
								title={t('jupiter.post-publish.tip-title')}
								text={t(
									`jupiter.post-publish.tip-${firstMissingRecommended.id}`
								)}
								actionLabel={
									firstMissingRecommended.onConfigure
										? t('jupiter.post-publish.checklist-action-configure')
										: undefined
								}
								onAction={firstMissingRecommended.onConfigure}
								onDismiss={() => setBannerDismissed(true)}
							/>
						)}
						<JupiterHelpCard
							actionLabel={t('availability.settings.jupiter-help-action')}
							description={t('availability.settings.jupiter-help-description')}
							disabled={!isJupiterCtaEnabled}
							disabledTooltip={t(
								'availability.settings.jupiter-cta-disabled-tooltip'
							)}
							onAction={handleJupiterCta}
							title={t('availability.settings.jupiter-help-title')}
						/>
					</JupiterAvailabilityPanel>
				</SettingsWrapper>

				{/* ─── Working hours drawer ─────────────────────────────────────── */}
				{activeDrawer === 'working-hours' && (
					<SettingsDrawer
						ariaLabel={t('availability.settings.working-hours-drawer-title')}
						title={t('availability.settings.working-hours-drawer-title')}
						desc={t('availability.settings.working-hours-desc')}
						isSaving={isSaving}
						onClose={closeDrawer}
						onSave={handleWorkingHoursSave}
						saveDisabled={
							workingDaysInput.length === 0 || !startTimeInput || !endTimeInput
						}
					>
						<DrawerFieldGroup>
							<DrawerFieldLabel>
								{t('availability.settings.working-hours-days-label')}
							</DrawerFieldLabel>
							<OptionChipsRow
								aria-label={t('availability.settings.working-hours-days-label')}
								role='group'
							>
								{WORKING_DAYS.map((day) => (
									<OptionChip
										key={day.key}
										aria-checked={workingDaysInput.includes(day.key)}
										isSelected={workingDaysInput.includes(day.key)}
										onClick={() => toggleWorkingDay(day.key)}
										role='checkbox'
									>
										{t(day.labelKey)}
									</OptionChip>
								))}
							</OptionChipsRow>
						</DrawerFieldGroup>

						<DrawerFieldGroup>
							<DrawerFieldLabel>
								{t('availability.settings.working-hours-time-label')}
							</DrawerFieldLabel>
							<TimeRangeRow>
								<TextField
									fullWidth
									label={t('availability.settings.working-hours-start-label')}
									onChange={(e) => setStartTimeInput(e.target.value)}
									size='small'
									type='time'
									value={startTimeInput}
								/>
								<TimeRangeSeparator>–</TimeRangeSeparator>
								<TextField
									fullWidth
									label={t('availability.settings.working-hours-end-label')}
									onChange={(e) => setEndTimeInput(e.target.value)}
									size='small'
									type='time'
									value={endTimeInput}
								/>
							</TimeRangeRow>
						</DrawerFieldGroup>
					</SettingsDrawer>
				)}

				{/* ─── Session type drawer ──────────────────────────────────────── */}
				{activeDrawer === 'session-type' && (
					<SettingsDrawer
						ariaLabel={t('availability.settings.session-type-drawer-title')}
						title={t('availability.settings.session-type-drawer-title')}
						desc={t('availability.settings.session-type-desc')}
						isSaving={isSaving}
						onClose={closeDrawer}
						onSave={handleSessionTypeSave}
						saveDisabled={!sessionTypeInput}
					>
						<OptionChipsRow
							aria-label={t('availability.settings.session-type-drawer-title')}
							role='radiogroup'
						>
							{SESSION_TYPE_OPTIONS.map((option) => (
								<OptionChip
									key={option.key}
									aria-checked={sessionTypeInput === option.key}
									isSelected={sessionTypeInput === option.key}
									onClick={() => setSessionTypeInput(option.key)}
									role='radio'
								>
									{t(option.labelKey)}
								</OptionChip>
							))}
						</OptionChipsRow>
						{(sessionTypeInput === 'IN_PERSON' || sessionTypeInput === 'BOTH') && (
							<OptionDesc>
								{t('availability.settings.session-type-address-hint')}
							</OptionDesc>
						)}
					</SettingsDrawer>
				)}

				{/* ─── Session duration drawer ──────────────────────────────────── */}
				{activeDrawer === 'session-duration' && (
					<SettingsDrawer
						ariaLabel={t('availability.settings.session-duration-drawer-title')}
						title={t('availability.settings.session-duration-drawer-title')}
						desc={t('availability.settings.session-duration-desc')}
						isSaving={isSaving}
						onClose={closeDrawer}
						onSave={handleSessionDurationSave}
						saveDisabled={!sessionDurationInput}
					>
						<OptionChipsRow
							aria-label={t(
								'availability.settings.session-duration-drawer-title'
							)}
							role='radiogroup'
						>
							{SESSION_DURATION_OPTIONS.map((minutes) => (
								<OptionChip
									key={minutes}
									aria-checked={sessionDurationInput === minutes}
									isSelected={sessionDurationInput === minutes}
									onClick={() => setSessionDurationInput(minutes)}
									role='radio'
								>
									{minutes} min
								</OptionChip>
							))}
						</OptionChipsRow>
					</SettingsDrawer>
				)}

				{/* ─── Timezone drawer ──────────────────────────────────────────── */}
				{activeDrawer === 'timezone' && (
					<SettingsDrawer
						ariaLabel={t('availability.settings.timezone-drawer-title')}
						title={t('availability.settings.timezone-drawer-title')}
						desc={t('availability.settings.timezone-desc')}
						isSaving={isSaving}
						onClose={closeDrawer}
						onSave={handleTimezoneSave}
						saveDisabled={!timezoneInput}
					>
						<Autocomplete
							disableClearable
							onChange={(_, value) => value && setTimezoneInput(value)}
							options={TIMEZONES}
							renderInput={(params) => (
								<TextField
									{...params}
									label={t('availability.settings.timezone-input-label')}
									size='small'
								/>
							)}
							value={timezoneInput || null}
						/>
					</SettingsDrawer>
				)}

				{/* ─── Buffer time drawer ───────────────────────────────────────── */}
				{activeDrawer === 'buffer-time' && (
					<SettingsDrawer
						ariaLabel={t('jupiter.post-publish.buffer-drawer-title')}
						title={t('jupiter.post-publish.buffer-drawer-title')}
						desc={t('jupiter.post-publish.buffer-drawer-desc')}
						isSaving={isSaving}
						onClose={closeDrawer}
						onSave={handleBufferSave}
						saveDisabled={!bufferInput || Number(bufferInput) < 5 || Number(bufferInput) > 20}
						showCancel
					>
						<BufferTimeEditor
							adviceRequest={bufferAdviceRequest}
							bufferInput={bufferInput}
							insights={bufferInsights}
							onChange={setBufferInput}
						/>
					</SettingsDrawer>
				)}

				{/* ─── Recurrence pattern drawer ───────────────────────────────── */}
			{activeDrawer === 'recurrence-pattern' && (
				<SettingsDrawer
					ariaLabel={t('availability.settings.recurrence-pattern-drawer-title')}
					title={t('availability.settings.recurrence-pattern-drawer-title')}
					desc={t('availability.settings.recurrence-pattern-desc')}
					isSaving={isSaving}
					onClose={closeDrawer}
					onSave={handleRecurrencePatternSave}
					saveDisabled={!recurrencePatternInput}
				>
					<OptionChipsRow
						aria-label={t('availability.settings.recurrence-pattern-drawer-title')}
						role='radiogroup'
					>
						{RECURRENCE_PATTERN_OPTIONS.map((option) => (
							<OptionChip
								key={option.key}
								aria-checked={recurrencePatternInput === option.key}
								isSelected={recurrencePatternInput === option.key}
								onClick={() => setRecurrencePatternInput(option.key)}
								role='radio'
							>
								{t(option.labelKey)}
							</OptionChip>
						))}
					</OptionChipsRow>
					{recurrencePatternInput && (
						<OptionDesc>
							{t(
								RECURRENCE_PATTERN_OPTIONS.find(
									(o) => o.key === recurrencePatternInput
								)?.descKey ?? ''
							)}
						</OptionDesc>
					)}
				</SettingsDrawer>
			)}

			{/* ─── Google Calendar drawer ───────────────────────────────────── */}
				{activeDrawer === 'google-calendar' && (
					<Drawer
						ariaLabel={t('availability.settings.google-calendar-drawer-title')}
						onClose={closeDrawer}
						title={t('availability.settings.google-calendar-drawer-title')}
						actions={
							availability.googleCalendarConnected ? (
								<>
									<Button
										fullWidth
										loading={isDisconnecting}
										onClick={handleDisconnectCalendar}
										secondary
										severity='error'
									>
										{t('availability.settings.google-calendar-disconnect')}
									</Button>
									<Button fullWidth onClick={closeDrawer} secondary>
										{t('common.close')}
									</Button>
								</>
							) : (
								<>
									<Button
										fullWidth
										loading={isConnecting}
										onClick={handleGoogleCalendarConnect}
										tertiary
									>
										{t('availability.settings.google-calendar-connect-btn')}
									</Button>
									<Button fullWidth onClick={closeDrawer} secondary>
										{t('common.close')}
									</Button>
								</>
							)
						}
					>
						<DrawerBody>
							{availability.googleCalendarConnected ? (
								<>
									{syncError ? (
										<GcalBanner tone='error'>
											<Error />
											{t('availability.settings.google-calendar-sync-failed')}
										</GcalBanner>
									) : (
										<GcalBanner tone='success'>
											<CheckSuccess />
											{t('availability.settings.google-calendar-connected')}
										</GcalBanner>
									)}

									{calendarList.length > 0 && (
										<Select
											items={calendarList.map((c) => ({
												name: c.summary,
												value: c.id,
											}))}
											name='gcal-calendar'
											onChangeSelect={(e) =>
												handleChangeCalendar(String(e.target.value))
											}
											selectLabel={t(
												'availability.settings.google-calendar-select-label'
											)}
											value={selectedCalendarId ?? ''}
										/>
									)}

									<GcalSyncCard>
										<GcalSyncMeta>
											<GcalSyncTitle>
												{lastSyncAt
													? t('availability.settings.google-calendar-last-synced', {
															time: formatLastSync(lastSyncAt, i18n.language),
														})
													: t('availability.settings.google-calendar-not-synced')}
											</GcalSyncTitle>
											<GcalSyncSub>
												{t('availability.settings.google-calendar-sync-hint')}
											</GcalSyncSub>
										</GcalSyncMeta>
										<Button
											loading={isSyncing}
											onClick={handleSyncNow}
											secondary
											small
										>
											<Refresh />
											{t('availability.settings.google-calendar-sync-now')}
										</Button>
									</GcalSyncCard>

									<CalendarSyncRow>
										<Text>
											{t('availability.settings.google-calendar-sync-label')}
										</Text>
										<Switch
											checked={syncEnabled}
											disabled={isTogglingSync}
											onChange={handleToggleCalendarSync}
											size='small'
										/>
									</CalendarSyncRow>

									<Button
										fullWidth
										onClick={() => navigate(`/${locale}/${PRACTICEIMPORT}`)}
										secondary
										small
									>
										<Account />
										{t('availability.settings.import-from-google')}
									</Button>
								</>
							) : (
								<>
									<DrawerDesc>
										{t('availability.settings.google-calendar-desc')}
									</DrawerDesc>
									<GcalBanner tone='info'>
										<Lock />
										{t('availability.settings.google-calendar-privacy')}
									</GcalBanner>
								</>
							)}
						</DrawerBody>
					</Drawer>
				)}

			{/* ─── Session address drawer ───────────────────────────────────── */}
			{activeDrawer === 'session-address' && (
				<FormProvider {...addressFormMethods}>
					<SettingsDrawer
						ariaLabel={t('availability.settings.session-address-drawer-title')}
						title={t('availability.settings.session-address-drawer-title')}
						desc={t('availability.settings.session-address-desc')}
						isSaving={isAddressSaving}
						onClose={closeDrawer}
						onSave={handleAddressSave}
						showCancel
					>
						<AddressForm showGoogleAddressSearch />
					</SettingsDrawer>
				</FormProvider>
			)}

			{/* ─── Specialty drawer ─────────────────────────────────────────── */}
			{activeDrawer === 'specialty' && (
				<SettingsDrawer
					ariaLabel={t('availability.settings.specialty-drawer-title')}
					title={t('availability.settings.specialty-drawer-title')}
					desc={t('availability.settings.specialty-desc')}
					isSaving={isSaving}
					onClose={closeDrawer}
					onSave={handleSpecialtySave}
					saveDisabled={!specialtyInput}
					showCancel
				>
					<OptionChipsRow
						aria-label={t('availability.settings.specialty-drawer-title')}
						role='radiogroup'
					>
						{SPECIALTY_OPTIONS.map((option) => (
							<OptionChip
								key={option.key}
								aria-checked={specialtyInput === option.key}
								isSelected={specialtyInput === option.key}
								onClick={() => setSpecialtyInput(option.key)}
								role='radio'
							>
								{t(option.labelKey)}
							</OptionChip>
						))}
					</OptionChipsRow>
					<TextField
						fullWidth
						helperText={t('availability.settings.specialty-detail-helper')}
						label={t('availability.settings.specialty-detail-label')}
						onChange={(e) => setSpecialtyDetailInput(e.target.value)}
						size='small'
						value={specialtyDetailInput}
					/>
				</SettingsDrawer>
			)}
			</PageLayout>

			<Modal
				openModal={showTimezoneWarning}
				title={t('availability.settings.timezone-warning-title')}
				onClose={cancelTimezoneWarning}
				cardActionsProps={{
					actionName: t('availability.settings.timezone-warning-confirm'),
					hasSecondAction: true,
					onClick: confirmTimezoneSave,
					secondAction: cancelTimezoneWarning,
					secondActionName: t('common.cancel'),
				}}
			>
				{t('availability.settings.timezone-warning-body')}
			</Modal>
		</>
	);
};

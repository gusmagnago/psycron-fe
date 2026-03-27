import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { SettingsDrawer } from '@psycron/components/drawer/SettingsDrawer';
import { CheckSuccess } from '@psycron/components/icons';
import { JupiterHelpCard } from '@psycron/components/jupiter-help-card/JupiterHelpCard';
import { JupiterTip } from '@psycron/components/jupiter-tip/JupiterTip';
import { Modal } from '@psycron/components/modal/Modal';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { AVAILABILITYGENERATE } from '@psycron/pages/urls';

import {
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
	DrawerFieldGroup,
	DrawerFieldLabel,
	GoogleCalendarStatus,
	JupiterAvailabilityPanel,
	OptionChip,
	OptionChipsRow,
	RecommendedBadge,
	SettingsWrapper,
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

const getTimezones = (): string[] => {
	try {
		return Intl.supportedValuesOf('timeZone');
	} catch {
		return [Intl.DateTimeFormat().resolvedOptions().timeZone];
	}
};

const TIMEZONES = getTimezones();

// ─── Component ─────────────────────────────────────────────────────────────────

export const AvailabilitySettings = () => {
	const { t } = useTranslation();
	const { locale } = useParams<{ locale: string }>();

	const {
		activeCount,
		activeDrawer,
		availability,
		bannerDismissed,
		bufferInput,
		cancelTimezoneWarning,
		checklistItems,
		closeDrawer,
		configuredCount,
		confirmTimezoneSave,
		endTimeInput,
		firstMissingRecommended,
		handleBufferSave,
		handleGoogleCalendarConnect,
		handleJupiterCta,
		handleSessionDurationSave,
		isConnecting,
		isJupiterCtaEnabled,
		handleSessionTypeSave,
		handleTimezoneSave,
		handleWorkingHoursSave,
		isSaving,
		isLoading,
		progress,
		renderActionLabel,
		showTimezoneWarning,
		sessionDurationInput,
		sessionTypeInput,
		setBannerDismissed,
		setBufferInput,
		setEndTimeInput,
		setSessionDurationInput,
		setSessionTypeInput,
		setStartTimeInput,
		setTimezoneInput,
		startTimeInput,
		timezoneInput,
		toggleWorkingDay,
		workingDaysInput,
	} = useAvailabilitySettings();

	if (isLoading) return null;

	if (!availability) {
		return <Navigate replace to={`/${locale}/${AVAILABILITYGENERATE}`} />;
	}

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
							<ChecklistTitle>
								{t('jupiter.post-publish.checklist-title')}
							</ChecklistTitle>
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
						isSaving={isSaving}
						onClose={closeDrawer}
						onSave={handleBufferSave}
						saveDisabled={
							!bufferInput ||
							isNaN(parseInt(bufferInput, 10)) ||
							parseInt(bufferInput, 10) < 0 ||
							parseInt(bufferInput, 10) > 120
						}
						showCancel
					>
						<TextField
							autoFocus
							fullWidth
							helperText={t('jupiter.post-publish.buffer-input-helper')}
							label={t('jupiter.post-publish.buffer-input-label')}
							onChange={(e) => setBufferInput(e.target.value)}
							size='small'
							type='number'
							value={bufferInput}
						/>
					</SettingsDrawer>
				)}

				{/* ─── Google Calendar drawer ───────────────────────────────────── */}
				{activeDrawer === 'google-calendar' && (
					<SettingsDrawer
						ariaLabel={t('availability.settings.google-calendar-drawer-title')}
						title={t('availability.settings.google-calendar-drawer-title')}
						desc={
							availability.googleCalendarConnected
								? undefined
								: t('availability.settings.google-calendar-desc')
						}
						isSaving={isConnecting}
						onClose={closeDrawer}
						onSave={handleGoogleCalendarConnect}
						saveDisabled={availability.googleCalendarConnected}
						saveLabel={t('availability.settings.google-calendar-connect-btn')}
						showCancel
					>
						{availability.googleCalendarConnected && (
							<GoogleCalendarStatus>
								<CheckSuccess />
								{t('availability.settings.google-calendar-connected')}
							</GoogleCalendarStatus>
						)}
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

export const enum PostHogEvent {
	AppointmentCancelled = 'appointment cancelled',

	AppointmentRescheduled = 'appointment rescheduled',
	AuthContinueWithEmailClicked = 'auth continue with email clicked',

	AuthForgotPasswordClicked = 'auth forgot password clicked',
	AuthGoogleOAuthClicked = 'auth google oauth clicked',

	AuthLegalLinkClicked = 'auth legal link clicked',
	AuthLogoutFailed = 'auth logout failed',

	AuthLogoutSucceeded = 'auth logout succeeded',
	AuthMarketingConsentToggled = 'auth marketing consent toggled',

	AuthPasswordVisibilityToggled = 'auth password visibility toggled',
	AuthSessionInvalidated = 'auth session invalidated',

	AuthSignInFailed = 'auth sign in failed',
	AuthSignInStarted = 'auth sign in started',

	AuthSignInSucceeded = 'auth sign in succeeded',
	AuthSignUpFailed = 'auth sign up failed',

	AuthSignUpSucceeded = 'auth sign up succeeded',
	AuthSwitchFormClicked = 'auth switch form clicked',
	AuthVerifyEmailFailed = 'auth verify email failed',
	AuthVerifyEmailSucceeded = 'auth verify email succeeded',
	AvailabilityDayBlocked = 'availability day blocked',
	AvailabilityDayUnblocked = 'availability day unblocked',
	AvailabilityLetPatientChooseAddress = 'availability let patient choose address toggled',
	AvailabilitySettingSaved = 'availability setting saved',
	AvailabilitySlotBlocked = 'availability slot blocked',
	AvailabilitySlotUnblocked = 'availability slot unblocked',
	BackofficeWorkerSessionFailed = 'backoffice worker session failed',
	ConsentGranted = 'consent granted',
	ConsentRevoked = 'consent revoked',

	DashboardActionCenterItemClicked = 'dashboard action center item clicked',
	DashboardBillingReadinessClicked = 'dashboard billing readiness clicked',
	DashboardChartDayClicked = 'dashboard chart day clicked',
	DashboardCustomizeOpened = 'dashboard customize opened',
	DashboardLayoutOrganized = 'dashboard layout organized button clicked',
	DashboardLayoutReset = 'dashboard layout reset button clicked',
	DashboardNotificationStatusClicked = 'dashboard notification status clicked',
	DashboardPendingTaskClicked = 'dashboard pending task clicked',
	DashboardQuickActionClicked = 'dashboard quick action clicked',
	DashboardRecentPatientOpened = 'dashboard recent patient opened',
	DashboardScheduleSlotClicked = 'dashboard schedule slot clicked',
	DashboardSessionAnalyticsViewToggled = 'dashboard session analytics view toggled',
	DashboardTileHidden = 'dashboard tile hidden',
	DashboardTileOrientationToggled = 'dashboard tile orientation toggled',
	DashboardTileReordered = 'dashboard tile reordered',
	DashboardTileRestored = 'dashboard tile restored',
	DashboardWeatherResolved = 'dashboard weather resolved',
	DeletionRequested = 'deletion requested',
	EditUserSubmitted = 'edit user submitted',

	FeaturePageQueueExpansionChanged = 'feature page queue expansion changed',
	JupiterInsightActionClicked = 'jupiter insight action clicked',
	JupiterInsightDismissed = 'jupiter insight dismissed',
	JupiterInsightsFallbackUsed = 'jupiter insights fallback used',

	MarketingConsentToggleChanged = 'marketing consent toggle changed',
	MarketingConsentToggleFailed = 'marketing consent toggle failed',
	MarketingConsentToggleSaved = 'marketing consent toggle saved',
	NotificationArchived = 'notification archived',
	NotificationDeepLinkFollowed = 'notification deep link followed',
	NotificationFiltersApplied = 'notification filters applied',
	NotificationResent = 'notification resent',
	NotificationSettingsFailed = 'notification settings failed',
	NotificationSettingsSaved = 'notification settings saved',
	PatientCenterArchiveConfirmed = 'patient center archive confirmed',
	PatientCenterArchiveFailed = 'patient center archive failed',
	PatientCenterArchiveOpened = 'patient center archive opened',
	PatientCenterOpened = 'patient center opened',
	PatientCenterSessionCancelled = 'patient center session cancelled',
	PatientCenterSessionDrawerOpened = 'patient center session drawer opened',
	PatientCenterSessionNotified = 'patient center session notified',
	PatientCenterSessionRescheduled = 'patient center session rescheduled',
	PatientCenterTimelineFilterChanged = 'patient center timeline filter changed',
	PatientNotificationSettingsSaved = 'patient notification settings saved',
	PublicBookAppointmentDaySelected = 'public book appointment day selected',
	PublicBookAppointmentOpened = 'public book appointment opened',
	PublicBookAppointmentSlotSelected = 'public book appointment slot selected',
	PublicBookAppointmentSubmitted = 'public book appointment submitted',
	PublicBookAppointmentTimeFilterChanged = 'public book appointment time filter changed',
	PublicBookAppointmentViewChanged = 'public book appointment view changed',
	PublicPatientAgendaAppointmentOpened = 'public patient agenda appointment opened',
	PublicPatientAgendaDaySelected = 'public patient agenda day selected',
	PublicPatientAgendaOpened = 'public patient agenda opened',

	PublicPatientAgendaViewChanged = 'public patient agenda view changed',

	SettingsLegalLinkClicked = 'settings legal link clicked',

	UserDetailsClosed = 'user details closed',

	UserDetailsDataExportFailed = 'user details data export failed',

	UserDetailsDataExportSucceeded = 'user details data export succeeded',

	UserDetailsDeleteConfirmed = 'user details delete confirmed',

	UserDetailsDeleteDialogClosed = 'user details delete dialog closed',

	UserDetailsDeleteDialogOpened = 'user details delete dialog opened',

	UserDetailsDeleteFailed = 'user details delete failed',
	UserDetailsDeleteSucceeded = 'user details delete succeeded',
	UserDetailsEditSessionClicked = 'user details edit session clicked',
	UserDetailsEditUserClicked = 'user details edit user clicked',
	UserDetailsOpened = 'user details opened',
	UserDetailsPatientsCtaClicked = 'user details patients cta clicked',
	UserDetailsPatientsNavigationClicked = 'user details patients navigation clicked',
}

export type ExceptionContext = {
	action?: string;
	area?: 'therapist' | 'backoffice' | 'public';
	correlationId?: string;
	feature?: string;
	route?: string;
};

export type PostHogTrackViewProps = { view: 'overlay' | 'page' };

export type PostHogEventProps = {
	[PostHogEvent.AuthSessionInvalidated]: {
		status_code: number;
	};

	[PostHogEvent.AuthSignInSucceeded]: {
		audience: 'therapist' | 'worker';
		method: 'password' | 'google' | '2fa_whatsapp';
		stay_connected?: boolean;
	};
	[PostHogEvent.AuthSignInFailed]: {
		audience: 'therapist' | 'worker';
		error_code: string;
		method: 'password' | 'google';
	};

	[PostHogEvent.AuthSignUpSucceeded]: {
		audience: 'therapist' | 'worker';
		marketing_emails_accepted: boolean;
		method: 'email' | 'google';
		stay_connected: boolean;
	};
	[PostHogEvent.AuthSignUpFailed]: {
		audience: 'therapist' | 'worker';
		error_code: string;
		method: 'email' | 'google';
	};

	[PostHogEvent.AuthVerifyEmailSucceeded]: never;
	[PostHogEvent.AuthVerifyEmailFailed]: {
		error_code: string;
	};

	[PostHogEvent.AuthLogoutSucceeded]: never;
	[PostHogEvent.AuthLogoutFailed]: never;

	[PostHogEvent.UserDetailsOpened]: PostHogTrackViewProps;
	[PostHogEvent.UserDetailsClosed]: PostHogTrackViewProps;

	[PostHogEvent.UserDetailsDeleteDialogOpened]: never;
	[PostHogEvent.UserDetailsDeleteDialogClosed]: never;

	[PostHogEvent.UserDetailsEditUserClicked]: { target_user_id: string };
	[PostHogEvent.UserDetailsEditSessionClicked]: {
		session: string;
		target_user_id: string;
	};

	[PostHogEvent.UserDetailsDeleteConfirmed]: never;
	[PostHogEvent.UserDetailsDeleteSucceeded]: never;
	[PostHogEvent.UserDetailsDeleteFailed]: { error_code: string };

	[PostHogEvent.UserDetailsDataExportSucceeded]: { bytes: number };
	[PostHogEvent.UserDetailsDataExportFailed]: { error_code: string };

	[PostHogEvent.MarketingConsentToggleChanged]: { granted: boolean };
	[PostHogEvent.MarketingConsentToggleSaved]: { granted: boolean };
	[PostHogEvent.MarketingConsentToggleFailed]: {
		error_code: string;
		granted: boolean;
	};

	[PostHogEvent.AuthForgotPasswordClicked]: {
		audience: 'therapist' | 'worker';
		method: 'password' | 'google';
	};

	[PostHogEvent.AuthMarketingConsentToggled]: {
		granted: boolean;
		surface: 'signup email' | 'signup google' | 'settings';
	};

	[PostHogEvent.AuthLegalLinkClicked]: {
		doc: 'privacy' | 'terms' | 'marketing';
		surface: 'signup start' | 'signup email' | 'settings';
	};

	[PostHogEvent.AuthContinueWithEmailClicked]: {
		audience: 'therapist' | 'worker';
		surface: 'signup start';
	};

	[PostHogEvent.AuthPasswordVisibilityToggled]: {
		field: 'password' | 'confirm_password';
		visible: boolean;
	};

	[PostHogEvent.AuthSwitchFormClicked]: {
		from: 'sign in' | 'sign up';
		to: 'sign in' | 'sign up';
	};

	[PostHogEvent.UserDetailsPatientsNavigationClicked]: PostHogTrackViewProps;

	[PostHogEvent.UserDetailsPatientsCtaClicked]: PostHogTrackViewProps;

	[PostHogEvent.SettingsLegalLinkClicked]: {
		doc: 'privacy' | 'terms' | 'marketing';
		surface: 'signup start' | 'signup email' | 'settings' | 'security section';
	};

	[PostHogEvent.AuthGoogleOAuthClicked]: {
		area: 'therapist' | 'backoffice';
		audience: 'therapist' | 'worker';
		intent: 'signin' | 'signup';
		locale?: string;
		stay_connected: boolean;
	};

	[PostHogEvent.BackofficeWorkerSessionFailed]: {
		reason: 'not_authenticated' | 'missing_worker';
	};

	[PostHogEvent.ConsentGranted]: {
		channel: 'self_management' | 'therapist_booked' | 'web_booking';
		purpose:
			| 'data_processing'
			| 'marketing_communications'
			| 'third_party_sharing';
	};
	[PostHogEvent.ConsentRevoked]: {
		purpose:
			| 'data_processing'
			| 'marketing_communications'
			| 'third_party_sharing';
	};
	[PostHogEvent.DeletionRequested]: never;

	[PostHogEvent.AuthSignInStarted]: {
		audience: 'therapist' | 'worker';
		method: 'password' | 'google';
		stay_connected: boolean;
	};

	[PostHogEvent.EditUserSubmitted]: {
		sections: Array<'clinicAddress' | 'contacts' | 'name' | 'password'>;
		session: 'clinicAddress' | 'contacts' | 'default' | 'name' | 'password';
	};

	[PostHogEvent.AvailabilityLetPatientChooseAddress]: {
		enabled: boolean;
		source: 'drawer' | 'generator';
		specialty?: string;
	};

	[PostHogEvent.AvailabilitySettingSaved]: {
		new_value: string;
		setting:
			| 'working_hours'
			| 'session_type'
			| 'session_duration'
			| 'timezone'
			| 'buffer_time'
			| 'recurrence_pattern'
			| 'google_calendar'
			| 'session_address'
			| 'specialty'
			| 'specialty_detail';
	};

	[PostHogEvent.AvailabilityDayBlocked]: {
		blocked_count: number;
		day_date: string;
	};

	[PostHogEvent.AvailabilityDayUnblocked]: {
		day_date: string;
		unblocked_count: number;
	};

	[PostHogEvent.AvailabilitySlotBlocked]: {
		slot_start_time: string;
	};

	[PostHogEvent.AvailabilitySlotUnblocked]: {
		slot_start_time: string;
	};

	[PostHogEvent.AppointmentCancelled]: {
		reason_code: string;
		source:
			| 'availability_week_drawer'
			| 'patient_center_drawer'
			| 'public_patient_agenda';
		triggered_by: 'patient' | 'therapist';
	};

	[PostHogEvent.AppointmentRescheduled]: {
		new_slot_start_time: string;
		reason_code?: string;
		source:
			| 'availability_week_drawer'
			| 'patient_center_drawer'
			| 'public_patient_agenda';
		triggered_by: 'patient' | 'therapist';
	};

	[PostHogEvent.PatientCenterArchiveOpened]: {
		target_user_id: string;
	};
	[PostHogEvent.PatientCenterArchiveConfirmed]: {
		target_user_id: string;
	};
	[PostHogEvent.PatientCenterArchiveFailed]: {
		error_code: string;
		target_user_id: string;
	};
	[PostHogEvent.PatientCenterOpened]: {
		target_user_id: string;
	};
	[PostHogEvent.PatientCenterTimelineFilterChanged]: {
		filter: 'all' | 'cancelled' | 'completed' | 'upcoming';
		target_user_id: string;
	};
	[PostHogEvent.PatientCenterSessionDrawerOpened]: {
		session_status: 'cancelled' | 'past' | 'upcoming';
		source: 'timeline';
	};
	[PostHogEvent.PatientCenterSessionRescheduled]: {
		mode: 'cancelled' | 'upcoming';
		session_date: string;
	};
	[PostHogEvent.PatientCenterSessionCancelled]: {
		reason_code: string;
		session_date: string;
	};
	[PostHogEvent.PatientCenterSessionNotified]: {
		session_date: string;
		session_status: 'cancelled' | 'upcoming';
	};
	[PostHogEvent.PublicPatientAgendaOpened]: {
		patient_id: string;
		total_sessions: number;
	};
	[PostHogEvent.PublicPatientAgendaDaySelected]: {
		date: string;
		has_appointments: boolean;
		source: 'calendar' | 'next_appointments' | 'today';
	};
	[PostHogEvent.PublicPatientAgendaAppointmentOpened]: {
		date: string;
		session_status: 'booked' | 'cancelled' | 'past';
		source: 'day_list' | 'next_appointments';
	};
	[PostHogEvent.PublicPatientAgendaViewChanged]: {
		view: 'month' | 'week';
	};
	[PostHogEvent.PublicBookAppointmentOpened]: {
		therapist_id: string;
	};
	[PostHogEvent.PublicBookAppointmentDaySelected]: {
		date: string;
		source: 'calendar';
		view: 'month' | 'week';
	};
	[PostHogEvent.PublicBookAppointmentSubmitted]: {
		date: string;
		recurrence_pattern: string;
		slot_id: string;
		therapist_id: string;
	};
	[PostHogEvent.PublicBookAppointmentTimeFilterChanged]: {
		time_of_day: 'all' | 'afternoon' | 'evening' | 'morning';
	};
	[PostHogEvent.PublicBookAppointmentViewChanged]: {
		view: 'month' | 'week';
	};
	[PostHogEvent.PublicBookAppointmentSlotSelected]: {
		date: string;
		slot_id: string;
		start_time: string;
	};
	[PostHogEvent.FeaturePageQueueExpansionChanged]: {
		is_expanded: boolean;
		surface: string;
	};
	[PostHogEvent.NotificationArchived]: {
		channel: string;
		message_type: string;
		notification_id: string;
	};
	[PostHogEvent.NotificationDeepLinkFollowed]: {
		patient_id: string;
		source: 'slot_drawer';
	};
	[PostHogEvent.NotificationFiltersApplied]: {
		channel?: string;
		has_date_range: boolean;
		has_patient_filter: boolean;
		has_search: boolean;
		message_type?: string;
		status?: string;
	};
	[PostHogEvent.NotificationResent]: {
		channel: string;
		message_type: string;
		notification_id: string;
		previous_status: string;
	};
	[PostHogEvent.NotificationSettingsSaved]: {
		calendar_invite_enabled: boolean;
		confirmation_email: boolean;
		confirmation_whatsapp: boolean;
		reminder_enabled: boolean;
		reminder_lead_time_minutes: number;
	};
	[PostHogEvent.NotificationSettingsFailed]: {
		error_code: string;
	};
	[PostHogEvent.PatientNotificationSettingsSaved]: {
		confirmation_email: boolean;
		confirmation_whatsapp: boolean;
		reminder_enabled: boolean;
	};

	[PostHogEvent.DashboardCustomizeOpened]: never;
	[PostHogEvent.DashboardBillingReadinessClicked]: {
		percentage: number;
		source: 'dashboard-summary';
		tier: string;
		tile_id: string;
	};
	[PostHogEvent.DashboardChartDayClicked]: {
		date: string;
		source: 'dashboard-summary';
		tier: string;
		tile_id: string;
	};
	[PostHogEvent.DashboardLayoutOrganized]: never;
	[PostHogEvent.DashboardLayoutReset]: never;
	[PostHogEvent.DashboardPendingTaskClicked]: {
		count: number;
		source: 'dashboard-summary';
		task_type: string;
		tier: string;
		tile_id: string;
	};
	[PostHogEvent.DashboardQuickActionClicked]: {
		action_id: string;
		source: 'dashboard-summary';
		tier: string;
		tile_id: string;
	};
	[PostHogEvent.DashboardRecentPatientOpened]: {
		patient_id: string;
		source: 'dashboard-summary';
		tier: string;
		tile_id: string;
	};
	[PostHogEvent.DashboardSessionAnalyticsViewToggled]: {
		source: 'dashboard-summary';
		tier: string;
		tile_id: string;
		view_mode: 'month' | 'week';
	};
	[PostHogEvent.DashboardTileHidden]: { tile_id: string };
	[PostHogEvent.DashboardTileOrientationToggled]: {
		orientation: 'column' | 'row';
		tile_id: string;
	};
	[PostHogEvent.DashboardTileReordered]: {
		from_index: number;
		tile_id: string;
		to_index: number;
	};
	[PostHogEvent.DashboardTileRestored]: { tile_id: string };
	[PostHogEvent.DashboardWeatherResolved]: {
		provider: 'fallback' | 'google-weather' | 'open-meteo';
		source:
			| 'browser-geolocation'
			| 'geolocation-denied'
			| 'geolocation-unavailable'
			| 'request-failed';
		status: 'fallback' | 'loading' | 'ready';
		weather_type: 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm';
	};

	[PostHogEvent.JupiterInsightActionClicked]: {
		action_target?: string;
		insight_index: number;
		insight_type?: string;
		source?: string;
	};
	[PostHogEvent.JupiterInsightDismissed]: {
		insight_index: number;
		insight_type?: string;
		source?: string;
	};
	[PostHogEvent.JupiterInsightsFallbackUsed]: {
		tier: string;
	};
	[PostHogEvent.DashboardNotificationStatusClicked]: {
		status: 'FAILED' | 'PENDING' | 'SENT';
		tier: string;
	};
	[PostHogEvent.DashboardActionCenterItemClicked]: {
		count: number;
		item_type: string;
		tier: string;
	};
	[PostHogEvent.DashboardScheduleSlotClicked]: {
		date: string;
		tier: string;
		tile_id: string;
	};
};

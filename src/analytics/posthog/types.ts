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
	AvailabilitySettingSaved = 'availability setting saved',
	AvailabilitySlotBlocked = 'availability slot blocked',
	BackofficeWorkerSessionFailed = 'backoffice worker session failed',

	EditUserSubmitted = 'edit user submitted',
	MarketingConsentToggleChanged = 'marketing consent toggle changed',

	MarketingConsentToggleFailed = 'marketing consent toggle failed',
	MarketingConsentToggleSaved = 'marketing consent toggle saved',
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
		method: 'password' | 'google';
		stay_connected: boolean;
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

	[PostHogEvent.AuthSignInStarted]: {
		audience: 'therapist' | 'worker';
		method: 'password' | 'google';
		stay_connected: boolean;
	};

	[PostHogEvent.EditUserSubmitted]: {
		sections: Array<'name' | 'contacts' | 'password'>;
		session: 'default' | 'name' | 'contacts' | 'password';
	};

	[PostHogEvent.AvailabilitySettingSaved]: {
		new_value: string;
		setting: 'working_hours' | 'session_type' | 'session_duration' | 'timezone' | 'buffer_time' | 'recurrence_pattern' | 'google_calendar';
	};

	[PostHogEvent.AvailabilitySlotBlocked]: {
		slot_start_time: string;
	};

	[PostHogEvent.AppointmentCancelled]: {
		reason_code: string;
		triggered_by: 'therapist';
	};

	[PostHogEvent.AppointmentRescheduled]: {
		new_slot_start_time: string;
		reason_code: string;
	};
};

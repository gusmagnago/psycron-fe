import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPostHog } from '@psycron/analytics/posthog/config';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import {
	clearSentryUser,
	setSentryUser,
} from '@psycron/analytics/sentry/sentry';
import {
	getSession,
	logoutFc,
	signInFc,
	signUpFc,
	verifyEmail,
	verifyWhatsAppOtpFc,
} from '@psycron/api/auth';
import type { CustomError } from '@psycron/api/error';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
import type { ISignInForm } from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUpEmail.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { DASHBOARD, HOMEPAGE, WHATSAPP_OTP_CHALLENGE } from '@psycron/pages/urls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	clearAuthTokens,
	getAccessToken,
	setTokens,
} from './utils/tokenStorage';
import type {
	AuthContextType,
	AuthProviderProps,
	ITherapist,
	IUserData,
} from './UserAuthenticationContext.types';

const toAuthErrorCode = (error: CustomError): string => {
	const msg = String(error.message ?? '').toLowerCase();

	if (msg.includes('not-found')) return 'not_found';
	if (msg.includes('not-allowed') || msg.includes('forbidden'))
		return 'not_allowed';
	if (msg.includes('invalid') || msg.includes('credentials'))
		return 'invalid_credentials';
	if (msg.includes('verify') || msg.includes('verification'))
		return 'email_not_verified';
	if (msg.includes('already') || msg.includes('exists'))
		return 'already_exists';
	if (msg.includes('network')) return 'network';
	return 'unknown';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type LocationState = { from?: { pathname?: string } };

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();
	const { showAlert } = useAlert();

	const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);
	const [pendingChallenge, setPendingChallenge] = useState<{
		persist: boolean;
		therapistId: string;
	} | null>(null);

	const accessToken = getAccessToken();
	const hasAccessToken = Boolean(accessToken);

	const {
		data: sessionData,
		isLoading: isSessionLoading,
		isSuccess: isSessionSuccess,
		isError: isSessionError,
		error: sessionError,
	} = useQuery<IUserData>({
		queryKey: QUERY_KEYS.session(),
		queryFn: getSession,
		enabled: hasAccessToken,
		retry: false,
	});

	const isAuthenticated = Boolean(sessionData?.isAuthenticated);
	const user: ITherapist | null = sessionData?.user ?? null;

	useEffect(() => {
		if (!hasAccessToken || !isSessionError) return;

		const err = sessionError as unknown;

		if (err && typeof err === 'object' && 'statusCode' in err) {
			const statusCode = (err as { statusCode: number }).statusCode;

			if (statusCode === 401 || statusCode === 403) {
				capture(PostHogEvent.AuthSessionInvalidated, {
					status_code: statusCode,
				});
				clearAuthTokens();
				clearSentryUser();
			}
		}
	}, [hasAccessToken, isSessionError, sessionError]);

	useEffect(() => {
		if (isAuthenticated && user?._id) {
			setSentryUser(user._id, { area: 'therapist', role: 'therapist' });
		} else {
			clearSentryUser();
		}
	}, [isAuthenticated, user?._id]);

	const handleAuthSuccess = useCallback(
		async (args: {
			accessToken: string;
			persist: boolean;
			redirectTo?: string;
			refreshToken: string;
		}) => {
			if (!args.accessToken || !args.refreshToken) {
				clearAuthTokens();
				throw new Error('Missing auth tokens');
			}

			setTokens({
				accessToken: args.accessToken,
				refreshToken: args.refreshToken,
				persist: args.persist,
			});

			await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.session() });

			navigate(args.redirectTo ?? DASHBOARD, { replace: true });
		},
		[navigate, queryClient]
	);

	const signInMutation = useMutation({
		mutationFn: signInFc,
		onSuccess: async (res, variables: ISignInForm) => {
			if (res.mode === 'whatsapp_challenge') {
				setPendingChallenge({
					therapistId: res.therapistId,
					persist: Boolean(variables.stayConnected),
				});
				navigate(`/${i18n.language}/${WHATSAPP_OTP_CHALLENGE}`, {
					replace: true,
				});
				return;
			}

			const persist = Boolean(variables.stayConnected);
			const { token: accessToken, refreshToken } = res as {
				refreshToken: string;
				token: string;
			};

			await handleAuthSuccess({
				accessToken,
				refreshToken,
				persist,
				redirectTo: redirectAfterAuth ?? DASHBOARD,
			});

			capture(PostHogEvent.AuthSignInSucceeded, {
				method: 'password',
				audience: 'therapist',
				stay_connected: persist,
			});

			setRedirectAfterAuth(null);
		},
		onError: (error: CustomError) => {
			capture(PostHogEvent.AuthSignInFailed, {
				method: 'password',
				audience: 'therapist',
				error_code: toAuthErrorCode(error),
			});
			showAlert({ severity: 'error', message: t(error.message) });
		},
	});

	const verifyWhatsAppOtpMutation = useMutation({
		mutationFn: verifyWhatsAppOtpFc,
		onSuccess: async (res) => {
			const persist = pendingChallenge?.persist ?? false;
			setPendingChallenge(null);

			await handleAuthSuccess({
				accessToken: res.token,
				refreshToken: res.refreshToken,
				persist,
				redirectTo: redirectAfterAuth ?? DASHBOARD,
			});

			capture(PostHogEvent.AuthSignInSucceeded, {
				method: '2fa_whatsapp',
				audience: 'therapist',
			});

			setRedirectAfterAuth(null);
		},
		onError: (error: CustomError) => {
			showAlert({ severity: 'error', message: t(error.message) });
		},
	});

	const signUpMutation = useMutation({
		mutationFn: signUpFc,
		onSuccess: async (res, variables: ISignUpForm) => {
			if (!('token' in res) || !res.token) {
				showAlert({ severity: 'info', message: res.message });
				capture(PostHogEvent.AuthSignUpSucceeded, {
					method: 'email',
					audience: 'therapist',
					stay_connected: false,
					marketing_emails_accepted: false,
				});
				return;
			}

			const persist = Boolean(variables.stayConnected);

			await handleAuthSuccess({
				accessToken: res.token,
				refreshToken: res.refreshToken,
				persist,
				redirectTo: DASHBOARD,
			});

			capture(PostHogEvent.AuthSignUpSucceeded, {
				method: 'email',
				audience: 'therapist',
				stay_connected: persist,
				marketing_emails_accepted: Boolean(
					variables.consent.marketingEmailsAccepted
				),
			});
		},
		onError: (error: CustomError) => {
			capture(PostHogEvent.AuthSignUpFailed, {
				method: 'email',
				audience: 'therapist',
				error_code: toAuthErrorCode(error),
			});

			showAlert({ severity: 'error', message: t(error.message) });
		},
	});

	const verifyEmailMutation = useMutation({
		mutationFn: verifyEmail,
		onSuccess: () => {
			capture(PostHogEvent.AuthVerifyEmailSucceeded);
		},
		onError: (error: CustomError) => {
			capture(PostHogEvent.AuthVerifyEmailFailed, {
				error_code: toAuthErrorCode(error),
			});
			showAlert({ severity: 'error', message: t(error.message) });
		},
	});

	const verifyEmailToken = useCallback(
		async (token: string) => {
			return verifyEmailMutation.mutateAsync(token);
		},
		[verifyEmailMutation]
	);

	const logoutMutation = useMutation({
		mutationFn: logoutFc,
		onSuccess: async () => {
			capture(PostHogEvent.AuthLogoutSucceeded);
		},
		onError: async () => {
			capture(PostHogEvent.AuthLogoutFailed);
		},
		onSettled: async () => {
			resetPostHog();
			clearAuthTokens();
			clearSentryUser();
			await queryClient.removeQueries({ queryKey: QUERY_KEYS.session() });
			navigate(HOMEPAGE, { replace: true });
		},
	});

	const signIn = useCallback(
		(data: ISignInForm) => {
			const state = location.state as LocationState | null;
			const from = state?.from?.pathname;

			setRedirectAfterAuth(from ?? DASHBOARD);
			signInMutation.mutate(data);
		},
		[location.state, signInMutation]
	);

	const signUp = useCallback(
		(data: ISignUpForm) => {
			signUpMutation.mutate(data);
		},
		[signUpMutation]
	);

	const logout = useCallback(() => {
		logoutMutation.mutate();
	}, [logoutMutation]);

	const verifyWhatsAppOtp = useCallback(
		(otp: string) => {
			if (!pendingChallenge) return;
			verifyWhatsAppOtpMutation.mutate({
				therapistId: pendingChallenge.therapistId,
				otp,
			});
		},
		[pendingChallenge, verifyWhatsAppOtpMutation]
	);

	const value = useMemo<AuthContextType>(
		() => ({
			signIn,
			signUp,
			logout,
			isAuthenticated,
			isSessionLoading,
			isSessionSuccess,
			user,
			isSignInMutationLoading: signInMutation.isPending,
			isSignUpMutationLoading: signUpMutation.isPending,
			verifyEmailToken,
			isVerifyEmailLoading: verifyEmailMutation.isPending,
			verifyWhatsAppOtp,
			isVerifyWhatsAppOtpLoading: verifyWhatsAppOtpMutation.isPending,
			hasPendingWhatsAppChallenge: Boolean(pendingChallenge),
		}),
		[
			signIn,
			signUp,
			logout,
			isAuthenticated,
			isSessionLoading,
			isSessionSuccess,
			user,
			signInMutation.isPending,
			signUpMutation.isPending,
			verifyEmailToken,
			verifyEmailMutation.isPending,
			verifyWhatsAppOtp,
			verifyWhatsAppOtpMutation.isPending,
			pendingChallenge,
		]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
};

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
import {
	deleteUserById,
	exportUserDataById,
	getUserById,
	updateMarketingConsent as updateMarketingConsentApi,
} from '@psycron/api/user';
import { buildCdnUrl } from '@psycron/api/user/upload-picture';
import { useRuntimeEnv } from '@psycron/context/runtime/RuntimeEnvContext';
import { useSecureStorage } from '@psycron/hooks/useSecureStorage';
import { EDITUSERPATH } from '@psycron/pages/urls';
import { ID_TOKEN, REFRESH_TOKEN, THERAPIST_ID } from '@psycron/utils/tokens';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../auth/UserAuthenticationContext';
import type { ITherapist } from '../auth/UserAuthenticationContext.types';

import type {
	UserDetailsContextType,
	UserDetailsProviderProps,
} from './UserDetailsContext.types';
import {
	clearMockUserDetails,
	getMockUserDetails,
	setMockUserDetails,
} from './userDetailsMockStorage';

const toUserDetailsErrorCode = (error: unknown): string => {
	if (error instanceof Error) {
		const msg = error.message.toLowerCase();
		if (msg.includes('not-found')) return 'not_found';
		if (msg.includes('not-allowed') || msg.includes('forbidden'))
			return 'not_allowed';
		if (msg.includes('network')) return 'network';
	}
	return 'unknown';
};

export const UserDetailsContext = createContext<
	UserDetailsContextType | undefined
>(undefined);

const clearAuthTokens = (): void => {
	localStorage.removeItem(ID_TOKEN);
	localStorage.removeItem(REFRESH_TOKEN);
	localStorage.removeItem(THERAPIST_ID);
};

export const UserDetailsProvider = ({ children }: UserDetailsProviderProps) => {
	const [isUserDetailsVisible, setIsUserDetailsVisible] = useState(false);

	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const navigate = useNavigate();
	const { i18n } = useTranslation();
	const { user } = useAuth();

	const toggleUserDetails = useCallback((): void => {
		setIsUserDetailsVisible((prev) => {
			const next = !prev;
			capture(
				next ? PostHogEvent.UserDetailsOpened : PostHogEvent.UserDetailsClosed,
				{
					view: 'overlay',
				}
			);
			return next;
		});
	}, []);

	const openDeleteDialog = useCallback((): void => {
		capture(PostHogEvent.UserDetailsDeleteDialogOpened);
		setIsDeleteOpen(true);
	}, []);

	const closeDeleteDialog = useCallback((): void => {
		capture(PostHogEvent.UserDetailsDeleteDialogClosed);
		setIsDeleteOpen(false);
	}, []);
	const handleClickEditUser = useCallback(
		(id: string): void => {
			capture(PostHogEvent.UserDetailsEditUserClicked, { target_user_id: id });

			navigate(`/${i18n.language}/${EDITUSERPATH}/${id}`);

			if (isUserDetailsVisible === false) return;
			toggleUserDetails();
		},
		[i18n, isUserDetailsVisible, navigate, toggleUserDetails]
	);

	const handleClickEditSession = useCallback(
		(userId: string, session: string): void => {
			capture(PostHogEvent.UserDetailsEditSessionClicked, {
				target_user_id: userId,
				session,
			});

			navigate(`/${i18n.language}/${EDITUSERPATH}/${userId}/${session}`);

			toggleUserDetails();
		},
		[i18n, navigate, toggleUserDetails]
	);

	return (
		<UserDetailsContext.Provider
			value={{
				isUserDetailsVisible,
				toggleUserDetails,
				handleClickEditUser,
				handleClickEditSession,
				user,
				isDeleteOpen,
				openDeleteDialog,
				closeDeleteDialog,
			}}
		>
			{children}
		</UserDetailsContext.Provider>
	);
};

export const useUserDetails = (passedUserId?: string) => {
	const context = useContext(UserDetailsContext);
	if (!context) {
		throw new Error('useUserDetails must be used within a UserDetailsProvider');
	}

	const { user: sessionUser, toggleUserDetails, closeDeleteDialog } = context;

	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const { isTestingEnv } = useRuntimeEnv();

	const mockedUserDetails = isTestingEnv ? getMockUserDetails() : null;
	const isUsingMock = Boolean(mockedUserDetails);

	const sessionUserId = sessionUser?._id;
	const userId = passedUserId ?? sessionUserId ?? null;

	const isOwnSettings =
		Boolean(sessionUserId) &&
		(passedUserId == null || passedUserId === sessionUserId);

	const {
		data: userDetails,
		isLoading: isUserDetailsLoading,
		isSuccess: isUserDetailsSucces,
	} = useQuery<ITherapist>({
		queryKey: QUERY_KEYS.userDetails(userId),
		queryFn: async () => {
			if (!userId) throw new Error(t('auth.error.not-found'));
			return getUserById(userId);
		},
		enabled: Boolean(userId) && !isUsingMock,
		retry: false,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});

	const resolvedUserDetails = mockedUserDetails ?? userDetails ?? null;

	const pictureUrl = useMemo(() => {
		if (!userDetails) return null;

		const fromUser = buildCdnUrl(userDetails.picture);
		if (fromUser) return fromUser;

		return userDetails.google?.picture ?? null;
	}, [userDetails]);

	const latestSessionId = useMemo(() => {
		const ids = userDetails?.availability ?? [];
		return ids.length ? ids[ids.length - 1] : null;
	}, [userDetails?.availability]);

	const therapistIdFromStorage = useSecureStorage(
		THERAPIST_ID,
		userDetails?._id,
		1440,
		'local'
	);

	const therapistId = useMemo(() => {
		return sessionUserId ?? therapistIdFromStorage ?? userDetails?._id ?? '';
	}, [sessionUserId, therapistIdFromStorage, userDetails?._id]);

	const deleteMyAccountMutation = useMutation({
		mutationFn: async () => {
			capture(PostHogEvent.UserDetailsDeleteConfirmed);

			if (!sessionUserId) throw new Error(t('auth.error.not-found'));
			if (!isOwnSettings) throw new Error(t('auth.error.not-allowed'));
			return deleteUserById(sessionUserId);
		},
		onSuccess: async () => {
			capture(PostHogEvent.UserDetailsDeleteSucceeded);

			clearAuthTokens();
			queryClient.clear();
			closeDeleteDialog();
			toggleUserDetails();
		},
		onError: (error: Error) => {
			capture(PostHogEvent.UserDetailsDeleteFailed, {
				error_code: toUserDetailsErrorCode(error),
			});
		},
	});

	const deleteMyAccount = useCallback(() => {
		deleteMyAccountMutation.mutate();
	}, [deleteMyAccountMutation]);

	const downloadMyDataMutation = useMutation({
		mutationFn: async () => {
			if (!sessionUserId) throw new Error(t('auth.error.not-found'));
			if (!isOwnSettings) throw new Error(t('auth.error.not-allowed'));
			return exportUserDataById(sessionUserId);
		},
		onSuccess: (blob) => {
			capture(PostHogEvent.UserDetailsDataExportSucceeded, {
				bytes: blob.size,
			});
			const profile = userDetails ?? sessionUser;
			const safeFirst = profile?.firstName ?? 'User';
			const safeLast = profile?.lastName ?? 'Psycron';

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${safeFirst}-${safeLast}-Psycron-data-export.json`;

			document.body.appendChild(a);
			a.click();
			a.remove();

			window.URL.revokeObjectURL(url);
		},
		onError: (error: Error) => {
			capture(PostHogEvent.UserDetailsDataExportFailed, {
				error_code: toUserDetailsErrorCode(error),
			});
		},
	});

	const downloadMyData = useCallback(() => {
		downloadMyDataMutation.mutate();
	}, [downloadMyDataMutation]);

	const updateMarketingConsentMutation = useMutation<void, Error, boolean>({
		mutationFn: async (granted: boolean): Promise<void> => {
			capture(PostHogEvent.MarketingConsentToggleChanged, { granted });

			if (!sessionUserId) throw new Error(t('auth.error.not-found'));
			if (!isOwnSettings) throw new Error(t('auth.error.not-allowed'));

			await updateMarketingConsentApi(sessionUserId, granted);
		},
		onSuccess: async (_data, granted) => {
			capture(PostHogEvent.MarketingConsentToggleSaved, { granted });

			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.userDetails(sessionUserId),
			});
		},
		onError: (error: Error, granted) => {
			capture(PostHogEvent.MarketingConsentToggleFailed, {
				granted,
				error_code: toUserDetailsErrorCode(error),
			});
		},
	});

	const updateMarketingConsent = useCallback(
		(granted: boolean, onError?: () => void) => {
			updateMarketingConsentMutation.mutate(granted, {
				onError,
			});
		},
		[updateMarketingConsentMutation]
	);

	return {
		...context,
		userDetails: resolvedUserDetails,
		isMockedUserDetails: isUsingMock,
		setMockUserDetails: (u: ITherapist) => setMockUserDetails(u),
		clearMockUserDetails: () => clearMockUserDetails(),
		pictureUrl,
		isUserDetailsLoading,
		isUserDetailsSucces,
		therapistId,
		latestSessionId,
		isOwnSettings,

		deleteMyAccount,
		isDeletePending: deleteMyAccountMutation.isPending,
		deleteError: deleteMyAccountMutation.error,

		downloadMyData,
		isDownloadPending: downloadMyDataMutation.isPending,
		downloadError: downloadMyDataMutation.error,

		updateMarketingConsent,
		isUpdatingMarketingConsent: updateMarketingConsentMutation.isPending,
		marketingConsentError: updateMarketingConsentMutation.error,
	};
};

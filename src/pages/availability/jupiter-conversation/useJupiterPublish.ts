import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { syncGoogleCalendar } from '@psycron/api/auth';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import { generateJupiterAvailability } from '@psycron/api/jupiter';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { AVAILABILITYPATH } from '@psycron/pages/urls';
import { useQueryClient } from '@tanstack/react-query';

import type {
	JupiterAnswers,
	JupiterMessage,
	JupiterPublishOutcome,
} from './JupiterConversation.types';
import {
	ONBOARDING_KEY,
	PUBLISHED_KEY,
	STORAGE_KEY,
} from './jupiterFlow.constants';

interface UseJupiterPublishParams {
	addBotMessage: (
		content: string,
		showIcon?: boolean,
		note?: JupiterMessage['note']
	) => void;
	answers: JupiterAnswers;
	therapistId?: string;
}

/**
 * Owns publishing the assembled availability and the post-publish Google busy
 * sync: the bounded client-side retry, the `sync-pending` outcome, and the
 * navigation to the live availability page. Cache invalidation that the
 * availability surfaces depend on lives here too.
 */
export const useJupiterPublish = ({
	answers,
	therapistId,
	addBotMessage,
}: UseJupiterPublishParams) => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [isPublishing, setIsPublishing] = useState(false);

	// Bounded client-side retry of the Google busy-time sync after a publish that
	// came back calendarSynced=false. Returns true on the first successful sync.
	const retryCalendarSync = useCallback(async (): Promise<boolean> => {
		const MAX_ATTEMPTS = 2;
		const RETRY_DELAY = 1200;
		for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
			try {
				await syncGoogleCalendar();
				queryClient.invalidateQueries({
					queryKey: QUERY_KEYS.therapistAvailability(therapistId),
				});
				return true;
			} catch {
				if (attempt < MAX_ATTEMPTS - 1) {
					await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				}
			}
		}
		return false;
	}, [queryClient, therapistId]);

	// Lands the user on the live availability page once we're done here.
	const goToAvailability = useCallback(() => {
		showAlert({
			message: t('jupiter.post-publish.welcome-toast'),
			severity: 'success',
		});
		navigate(`/${i18n.language}/${AVAILABILITYPATH}`);
	}, [i18n.language, navigate, showAlert, t]);

	const handlePublish = useCallback(async (): Promise<JupiterPublishOutcome> => {
		if (
			!answers.workingDays?.length ||
			!answers.timeRange ||
			!answers.sessionDuration ||
			!answers.sessionType ||
			!answers.timezone ||
			!answers.recurrencePattern
		)
			return 'failed';

		setIsPublishing(true);
		try {
			const { availabilityId, calendarSynced } =
				await generateJupiterAvailability({
					recurrencePattern: answers.recurrencePattern,
					workingDays: answers.workingDays,
					timeRange: answers.timeRange,
					sessionDuration: answers.sessionDuration,
					sessionType: answers.sessionType,
					timezone: answers.timezone,
				});
			localStorage.removeItem(STORAGE_KEY);
			localStorage.setItem(ONBOARDING_KEY, 'true');
			localStorage.setItem(PUBLISHED_KEY, 'true');
			const record: IAvailabilityRecord = {
				availabilityId,
				recurrencePattern: answers.recurrencePattern,
				sessionDuration: answers.sessionDuration,
				sessionType: answers.sessionType,
				timeRange: answers.timeRange,
				timezone: answers.timezone,
				workingDays: answers.workingDays,
			};
			queryClient.setQueryData<IAvailabilityRecord>(['availability'], record);
			queryClient.setQueryData<IAvailabilityRecord>(
				['availabilityGate'],
				record
			);
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.therapistAvailability(therapistId),
			});
			// Refetch the data the availability page actually renders from — the
			// config (['availability']) and, crucially, the week-grid slots
			// (['jupiterAvailability', …]) — so it populates on first paint after
			// navigation instead of showing the stale (empty) cache until reload.
			queryClient.invalidateQueries({ queryKey: ['availability'] });
			queryClient.invalidateQueries({ queryKey: ['jupiterAvailability'] });
			// Refresh the Practice Importer preview so the "patients found in
			// your calendar" prompt reflects the freshly-synced events.
			queryClient.invalidateQueries({ queryKey: ['practiceImportPreview'] });

			// The publish itself succeeded (the availability doc is saved). For a
			// Google-connected therapist, the BE also tries to pull busy times
			// synchronously and reports it via calendarSynced. If that failed
			// (transient Google/token hiccup), retry the sync from the client a
			// couple of times. If it still fails, stay on this page as
			// 'sync-pending' so the user can retry in place rather than being
			// sent away to Settings.
			const isGoogleConnected =
				answers.availabilitySource === 'google-import' ||
				answers.availabilitySource === 'google-manual';
			let synced = calendarSynced ?? false;
			if (isGoogleConnected && !synced) {
				synced = await retryCalendarSync();
			}

			if (isGoogleConnected && !synced) {
				showAlert({
					message: t('jupiter.post-publish.sync-pending-toast'),
					severity: 'warning',
				});
				return 'sync-pending';
			}

			showAlert({
				message: t('jupiter.post-publish.success-toast'),
				severity: 'success',
			});
			goToAvailability();
			return 'published';
		} catch {
			addBotMessage(t('jupiter.errors.save-fail'));
			return 'failed';
		} finally {
			setIsPublishing(false);
		}
	}, [
		answers,
		addBotMessage,
		goToAvailability,
		queryClient,
		retryCalendarSync,
		showAlert,
		t,
		therapistId,
	]);

	// Retry the Google sync from the 'sync-pending' state. On success we surface
	// the normal success toast and continue to availability; otherwise we stay
	// put so the user can try again.
	const handleRetrySync = useCallback(async (): Promise<boolean> => {
		setIsPublishing(true);
		try {
			const synced = await retryCalendarSync();
			if (synced) {
				showAlert({
					message: t('jupiter.post-publish.success-toast'),
					severity: 'success',
				});
				goToAvailability();
			} else {
				showAlert({
					message: t('jupiter.post-publish.sync-pending-toast'),
					severity: 'warning',
				});
			}
			return synced;
		} finally {
			setIsPublishing(false);
		}
	}, [goToAvailability, retryCalendarSync, showAlert, t]);

	// User chooses to leave the 'sync-pending' state without a successful sync.
	const handleContinueWithoutSync = useCallback(() => {
		goToAvailability();
	}, [goToAvailability]);

	return {
		isPublishing,
		handlePublish,
		handleRetrySync,
		handleContinueWithoutSync,
	};
};

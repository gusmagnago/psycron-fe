import { useTranslation } from 'react-i18next';
import {
	commitPracticeImport,
	getPracticeImportPreview,
	type ImportDecision,
} from '@psycron/api/practice-import';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const PRACTICE_IMPORT_PREVIEW_KEY = 'practiceImportPreview';

/**
 * Practice Importer review data: fetches the read-only preview of patients
 * detected in the therapist's synced Google events, and commits the therapist's
 * accept/reject decisions (which creates patients + links the booked slots).
 */
export const usePracticeImport = (therapistId?: string) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const preview = useQuery({
		queryKey: [PRACTICE_IMPORT_PREVIEW_KEY, therapistId],
		queryFn: () => getPracticeImportPreview(therapistId as string),
		enabled: Boolean(therapistId),
		staleTime: 1000 * 60 * 5,
	});

	const commit = useMutation({
		mutationFn: (decisions: ImportDecision[]) =>
			commitPracticeImport(therapistId as string, decisions),
		onSuccess: (result) => {
			showAlert({
				message: t('practice-import.commit-success', {
					count: result.created,
				}),
				severity: 'success',
			});
			// Refresh everything the new patients + linked slots feed into so the UI
			// updates without a page reload:
			//  - the week grid (AvailabilityContext → therapistAvailability) so the
			//    booked slots now show the linked patient,
			//  - the patient list,
			//  - the availability config + calendar views,
			//  - the dashboard summary (recent patients, practice readiness, action
			//    center all read from it),
			//  - this importer's own preview (so the nudges/banner update their count).
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.therapistAvailability(),
			});
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availabilityByDay() });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patientList() });
			queryClient.invalidateQueries({ queryKey: ['availability'] });
			queryClient.invalidateQueries({ queryKey: ['jupiterAvailability'] });
			queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
			queryClient.invalidateQueries({
				queryKey: [PRACTICE_IMPORT_PREVIEW_KEY, therapistId],
			});
		},
		onError: () => {
			showAlert({
				message: t('practice-import.commit-error'),
				severity: 'error',
			});
		},
	});

	return { preview, commit };
};

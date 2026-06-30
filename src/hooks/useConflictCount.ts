import { QUERY_KEYS } from '@psycron/api/queryKeys';
import { getConflictCount } from '@psycron/api/user/conflicts';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useQuery } from '@tanstack/react-query';

interface UseConflictCountReturn {
	count: number;
	isLoading: boolean;
}

/**
 * Live count of OPEN conflicts for the therapist. Single source shared by the
 * action-center nav badge and the availability readiness strip so both always
 * show the same number. Pass `therapistIdOverride` when the id is already known
 * (e.g. the app layout) to keep one cache entry regardless of route params.
 */
export const useConflictCount = (
	therapistIdOverride?: string
): UseConflictCountReturn => {
	const resolvedTherapistId = useTherapistId();
	const therapistId = therapistIdOverride ?? resolvedTherapistId;

	const { data, isLoading } = useQuery({
		queryKey: QUERY_KEYS.conflictCount(therapistId ?? ''),
		queryFn: () => getConflictCount(therapistId ?? ''),
		enabled: Boolean(therapistId),
		// Poll (foreground only) so the action-center badge updates without a reload.
		staleTime: 1000 * 30,
		refetchInterval: 1000 * 30,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: true,
	});

	return { count: data?.count ?? 0, isLoading };
};

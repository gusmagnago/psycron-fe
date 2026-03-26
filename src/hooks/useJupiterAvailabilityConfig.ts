import { getAvailability } from '@psycron/api/availability';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import { useQuery } from '@tanstack/react-query';

export const JUPITER_AVAILABILITY_CONFIG_KEY = 'availability' as const;

export interface UseJupiterAvailabilityConfigReturn {
	availability: IAvailabilityRecord | null | undefined;
	isLoading: boolean;
}

export const useJupiterAvailabilityConfig = (): UseJupiterAvailabilityConfigReturn => {
	const { data, isLoading } = useQuery<IAvailabilityRecord | null>({
		queryFn: () => getAvailability(),
		queryKey: [JUPITER_AVAILABILITY_CONFIG_KEY],
		retry: false,
		staleTime: 1000 * 60 * 5,
	});

	return { availability: data ?? null, isLoading };
};

import { useEffect, useMemo, useState } from 'react';
import type { IBufferTimeAdviceRequest } from '@psycron/api/jupiter';
import { getBufferTimeAdvice } from '@psycron/api/jupiter';
import { useQuery } from '@tanstack/react-query';

const DEBOUNCE_MS = 350;

export const useBufferTimeAdvice = (
	request: IBufferTimeAdviceRequest | null
) => {
	const requestKey = useMemo(
		() => (request ? JSON.stringify(request) : ''),
		[request]
	);
	const [debouncedRequestKey, setDebouncedRequestKey] = useState(requestKey);

	useEffect(() => {
		if (!requestKey) {
			setDebouncedRequestKey('');
			return;
		}

		const timer = setTimeout(() => {
			setDebouncedRequestKey(requestKey);
		}, DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [requestKey]);

	return useQuery({
		queryKey: ['bufferTimeAdvice', debouncedRequestKey],
		queryFn: () => getBufferTimeAdvice(JSON.parse(debouncedRequestKey)),
		enabled: !!debouncedRequestKey,
		retry: 1,
		staleTime: 1000 * 60,
	});
};

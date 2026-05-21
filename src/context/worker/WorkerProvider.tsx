import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	clearSentryUser,
	setSentryUser,
} from '@psycron/analytics/sentry/sentry';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
import { getWorkerMe } from '@psycron/api/worker';
import type { IWorker } from '@psycron/api/worker/index.types';
import { useQuery } from '@tanstack/react-query';
import posthog from 'posthog-js';

import {
	clearWorkerTokens,
	getWorkerAccessToken,
} from './utils/workerTokenStorage';
import type { WorkerContextValue } from './WorkerProvider.types';

const WorkerAuthContext = createContext<WorkerContextValue | null>(null);

const getErrorMessage = (err: unknown): string => {
	if (err instanceof Error) return err.message;
	return 'Failed to load worker session';
};

export const WorkerProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const [version, setVersion] = useState<number>(0);

	const accessToken = useMemo(() => {
		void version;
		return getWorkerAccessToken();
	}, [version]);

	const isAuthenticated = Boolean(accessToken);

	const {
		data: worker,
		isLoading,
		error,
	} = useQuery<IWorker, Error>({
		queryKey: QUERY_KEYS.workerMe(),
		queryFn: async () => getWorkerMe(),
		enabled: isAuthenticated,
		retry: false,
		staleTime: 60_000,
	});

	useEffect((): void => {
		if (!worker?._id) return;

		const name =
			`${worker.firstName ?? ''} ${worker.lastName ?? ''}`.trim() || null;

		posthog.identify(worker._id, {
			role: 'worker',
			name,
			email: worker.email ?? null,
		});
		setSentryUser(worker._id, { area: 'backoffice', role: 'worker' });
	}, [worker?._id, worker?.firstName, worker?.lastName, worker?.email]);

	const logout = (): void => {
		clearWorkerTokens();
		clearSentryUser();
		posthog.reset();
		setVersion((v) => v + 1);
	};

	const value: WorkerContextValue = {
		isAuthenticated,
		worker: worker ?? null,
		isLoading,
		error: error ? getErrorMessage(error) : null,
		logout,
	};

	return (
		<WorkerAuthContext.Provider value={value}>
			{children}
		</WorkerAuthContext.Provider>
	);
};

export const useWorker = (): WorkerContextValue => {
	const ctx = useContext(WorkerAuthContext);
	if (!ctx) {
		throw new Error('useWorker must be used within WorkerProvider');
	}
	return ctx;
};

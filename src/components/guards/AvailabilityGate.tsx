import { type ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvailability } from '@psycron/api/availability';
import { Loader } from '@psycron/components/loader/Loader';
import { useAlert } from '@psycron/context/alert/AlertContext';
import {
	ONBOARDING_KEY,
	STORAGE_KEY,
} from '@psycron/pages/availability/jupiter-conversation/useJupiterFlow';
import { AVAILABILITYGENERATE } from '@psycron/pages/urls';
import { useQuery } from '@tanstack/react-query';

interface AvailabilityGateProps {
	children: ReactNode;
}

export const AvailabilityGate = ({ children }: AvailabilityGateProps) => {
	const navigate = useNavigate();
	const { i18n, t } = useTranslation();
	const location = useLocation();
	const { showAlert } = useAlert();
	const hasAlerted = useRef(false);

	const { data, isLoading } = useQuery({
		queryKey: ['availabilityGate'],
		queryFn: () => getAvailability(),
		staleTime: 1000 * 60 * 10,
	});

	const isOnGeneratePage = location.pathname.includes(AVAILABILITYGENERATE);
	const hasAvailability = data !== null;
	const hasDraft = !!localStorage.getItem(STORAGE_KEY);
	// Published availability is authoritative: a leftover onboarding draft must
	// never bounce a user who already has availability back into the generate
	// flow. A draft only means "resume onboarding" when no availability exists.
	// Once the query resolves, a missing availability means we are about to
	// redirect — we must not render children for that frame, or the dashboard
	// flashes briefly before the navigation lands.
	const willRedirect = !isLoading && !isOnGeneratePage && !hasAvailability;

	useEffect(() => {
		if (isLoading) return;

		if (hasAvailability) {
			// Drop a stale draft so it can't trap the user in generate on the
			// next load — but not while they're actively on the generate page
			// (e.g. regenerating), where the draft is legitimately in flight.
			if (hasDraft && !isOnGeneratePage) {
				localStorage.removeItem(STORAGE_KEY);
			}
			return;
		}

		if (isOnGeneratePage) return;

		if (!hasAlerted.current && !!localStorage.getItem(ONBOARDING_KEY)) {
			hasAlerted.current = true;
			showAlert({
				message: t('availability.gate.deleted-notice'),
				severity: 'warning',
			});
		}
		navigate(`/${i18n.language}/${AVAILABILITYGENERATE}`, { replace: true });
	}, [
		hasAvailability,
		hasDraft,
		isLoading,
		isOnGeneratePage,
		navigate,
		i18n.language,
		showAlert,
		t,
	]);

	if ((isLoading && data === undefined) || willRedirect) {
		return <Loader />;
	}

	return <>{children}</>;
};

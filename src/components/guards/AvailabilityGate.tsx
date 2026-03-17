import { type ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvailability } from '@psycron/api/availability';
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
		queryFn: getAvailability,
		staleTime: 1000 * 60 * 10,
	});

	useEffect(() => {
		if (isLoading) return;

		const isOnGeneratePage = location.pathname.includes(AVAILABILITYGENERATE);
		if (isOnGeneratePage) return;

		const hasDraft = !!localStorage.getItem(STORAGE_KEY);
		const hasOnboarded = !!localStorage.getItem(ONBOARDING_KEY);
		const hasAvailability = data !== null;

		if (!hasAvailability && !hasOnboarded) {
			navigate(`/${i18n.language}/${AVAILABILITYGENERATE}`, { replace: true });
			return;
		}

		if (!hasAvailability && hasOnboarded && !hasAlerted.current) {
			hasAlerted.current = true;
			showAlert({
				message: t('availability.gate.deleted-notice'),
				severity: 'warning',
			});
			return;
		}

		if (hasAvailability && hasDraft) {
			navigate(`/${i18n.language}/${AVAILABILITYGENERATE}`, { replace: true });
		}
	}, [data, isLoading, location.pathname, navigate, i18n.language, showAlert, t]);

	return <>{children}</>;
};

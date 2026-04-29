import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import { AppAnalytics } from '@psycron/analytics/posthog/AppAnalytics';
import { getAvailabilityCalendar } from '@psycron/api/user';
import { getConflictCount } from '@psycron/api/user/conflicts';
import { EnvironmentBanner } from '@psycron/components/environment-banner/EnvironmentBanner';
import { AvailabilityGate } from '@psycron/components/guards/AvailabilityGate';
import {
	Alert,
	Calendar,
	DashboardIcon,
	Help,
	Language,
	Logout,
	Notifications,
	PatientList,
	Payment,
	UserSettings,
} from '@psycron/components/icons';
import { Localization } from '@psycron/components/localization/Localization';
import { Navbar } from '@psycron/components/navbar/Navbar';
import { UserDetailsCard } from '@psycron/components/user/components/user-details-card/UserDetailsCard';
import { useRuntimeEnv } from '@psycron/context/runtime/RuntimeEnvContext';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useAuthSession } from '@psycron/hooks/useAuthSession';
import useViewport from '@psycron/hooks/useViewport';
import {
	buildCancellationRecoveryRows,
	formatRecoverySearchRange,
	isRecoveryStateResolved,
} from '@psycron/pages/availability/cancellation-recovery/CancellationRecoveryPage.utils';
import {
	AVAILABILITYPATH,
	AVAILABILITYRECOVERY,
	CONFLICTS,
	DASHBOARD,
	LOGOUT,
	PATIENTS,
	PAYMENTS,
} from '@psycron/pages/urls';
import { useQuery } from '@tanstack/react-query';

import {
	Content,
	DividerWrapper,
	LayoutWrapper,
	NavBarWrapper,
} from './AppLayout.styles';

export const AppLayout: FC = () => {
	const { t } = useTranslation();
	const { isMobile, isTablet } = useViewport();
	const { isTestingEnv } = useRuntimeEnv();

	const { isAuthenticated } = useAuth();

	const sessionStatus = useAuthSession();

	const { isUserDetailsVisible, userDetails, toggleUserDetails } =
		useUserDetails();
	const { data: conflictCountData } = useQuery({
		queryKey: ['conflictCount', userDetails?._id],
		queryFn: () => getConflictCount(userDetails?._id ?? ''),
		enabled: Boolean(userDetails?._id),
	});

	const recoverySearchRange = useMemo(
		() => formatRecoverySearchRange(new Date()),
		[]
	);
	const { data: cancellationRecoveryData } = useQuery({
		queryKey: [
			'cancellationRecovery',
			userDetails?._id,
			recoverySearchRange.from,
			recoverySearchRange.to,
		],
		queryFn: () =>
			getAvailabilityCalendar(userDetails?._id ?? '', {
				from: recoverySearchRange.from,
				to: recoverySearchRange.to,
			}),
		enabled: Boolean(userDetails?._id),
		gcTime: 1000 * 60 * 30,
		staleTime: 1000 * 60 * 5,
	});
	const cancellationRecoveryCount = useMemo(
		() =>
			buildCancellationRecoveryRows({
				dates: cancellationRecoveryData?.dates,
			}).filter((row) => !isRecoveryStateResolved(row.recoveryState)).length,
		[cancellationRecoveryData?.dates]
	);

	const menuItems = [
		{
			name: t('components.navbar.dashboard'),
			icon: <DashboardIcon />,
			path: DASHBOARD,
		},
		{
			name: t('components.navbar.user-settings'),
			icon: <UserSettings />,
			path: `${userDetails?._id}`,
			onClick: () => toggleUserDetails(),
		},
		{
			name: t('globals.appointments-manager'),
			icon: <Calendar />,
			path: AVAILABILITYPATH,
		},
		{
			name: t('components.navbar.conflicts'),
			icon: <Alert />,
			path: CONFLICTS,
			badgeCount: conflictCountData?.count ?? 0,
		},
		{
			name: t('availability.cancellation-recovery.title'),
			icon: <Notifications />,
			path: AVAILABILITYRECOVERY,
			badgeCount: cancellationRecoveryCount,
		},
		{
			name: t('globals.patients'),
			icon: <PatientList />,
			path: PATIENTS,
		},
		{
			name: t('globals.billing-manager'),
			icon: <Payment />,
			path: PAYMENTS,
			disabled: true,
		},
	];

	const footerItems = [
		{
			name: t('globals.change-language'),
			icon: <Language />,
			component: <Localization />,
		},
		{
			name: t('globals.help'),
			icon: <Help />,
			path: '/help-center',
			disabled: true,
		},
		{ name: t('globals.logout'), icon: <Logout />, path: LOGOUT },
	];

	const distinctId =
		isAuthenticated && userDetails?._id ? userDetails._id : null;

	if (sessionStatus) return sessionStatus;

	return (
		<LayoutWrapper>
			<AppAnalytics isAuthenticated={isAuthenticated} distinctId={distinctId} />
			<NavBarWrapper>
				<Box>
					<Navbar items={menuItems} footerItems={footerItems} />
				</Box>
				<DividerWrapper>
					<Divider
						orientation={isMobile || isTablet ? 'horizontal' : 'vertical'}
					/>
				</DividerWrapper>
			</NavBarWrapper>
			<Content>
				<EnvironmentBanner isVisible={isTestingEnv} />
				<AvailabilityGate>
					<Outlet />
				</AvailabilityGate>
				{isAuthenticated && isUserDetailsVisible && (
					<UserDetailsCard user={userDetails} />
				)}
			</Content>
		</LayoutWrapper>
	);
};

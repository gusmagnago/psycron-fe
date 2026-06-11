import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import { AppAnalytics } from '@psycron/analytics/posthog/AppAnalytics';
import { getNotifications } from '@psycron/api/notifications';
import { getAvailabilityCalendar } from '@psycron/api/user';
import { EnvironmentBanner } from '@psycron/components/environment-banner/EnvironmentBanner';
import { AvailabilityGate } from '@psycron/components/guards/AvailabilityGate';
import {
	Bell,
	Calendar,
	DashboardIcon,
	Help,
	Logout,
	PatientList,
	Settings,
	TriangleAlert,
	Wallet,
} from '@psycron/components/icons';
import { Localization } from '@psycron/components/localization/Localization';
import { Modal } from '@psycron/components/modal/Modal';
import { Navbar } from '@psycron/components/navbar/Navbar';
import { UserDetailsCard } from '@psycron/components/user/components/user-details-card/UserDetailsCard';
import { useRuntimeEnv } from '@psycron/context/runtime/RuntimeEnvContext';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useAuthSession } from '@psycron/hooks/useAuthSession';
import { useConflictCount } from '@psycron/hooks/useConflictCount';
import useViewport from '@psycron/hooks/useViewport';
import {
	buildCancellationRecoveryRows,
	formatRecoverySearchRange,
	isRecoveryStateResolved,
} from '@psycron/pages/action-center/cancellation-recovery/CancellationRecoveryPage.utils';
import {
	ACTIONCENTER,
	AVAILABILITYPATH,
	DASHBOARD,
	getHelpUrl,
	LOGOUT,
	NOTIFICATIONS,
	PATIENTS,
	PAYMENTS,
} from '@psycron/pages/urls';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

import {
	HelpCenterBody,
	HelpCenterIntro,
	HelpCenterOption,
	HelpCenterOptionBody,
	HelpCenterOptionList,
	HelpCenterOptionTitle,
} from './AppHelpCenter.styles';
import {
	Content,
	DividerWrapper,
	LayoutWrapper,
	NavBarWrapper,
} from './AppLayout.styles';

export const AppLayout: FC = () => {
	const { t, i18n } = useTranslation();
	const { isMobile, isTablet } = useViewport();
	const { isTestingEnv } = useRuntimeEnv();
	const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);

	const { isAuthenticated } = useAuth();

	const sessionStatus = useAuthSession();

	const { isUserDetailsVisible, userDetails, toggleUserDetails } =
		useUserDetails();
	const { count: conflictCount } = useConflictCount(userDetails?._id);

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

	// Badge the Notifications item with failed deliveries from the last day —
	// the actionable subset a practitioner needs to retry.
	const notificationsFrom = useMemo(
		() => format(subDays(new Date(), 1), 'yyyy-MM-dd'),
		[]
	);
	const { data: failedNotificationsData } = useQuery({
		queryKey: ['failedNotificationsCount', userDetails?._id, notificationsFrom],
		queryFn: () =>
			getNotifications({
				from: notificationsFrom,
				limit: 100,
				status: 'FAILED',
			}),
		enabled: Boolean(userDetails?._id),
		gcTime: 1000 * 60 * 30,
		staleTime: 1000 * 60 * 5,
	});
	const failedNotificationsCount =
		failedNotificationsData?.total ??
		failedNotificationsData?.notifications.length ??
		0;

	const openExternalHelp = () => {
		window.open(getHelpUrl(i18n.language), '_blank', 'noopener,noreferrer');
	};

	const menuItems = [
		{
			name: t('components.navbar.dashboard'),
			icon: <DashboardIcon />,
			path: DASHBOARD,
		},
		{
			name: t('globals.appointments-manager'),
			icon: <Calendar />,
			path: AVAILABILITYPATH,
		},
		{
			name: t('components.navbar.action-center'),
			icon: <TriangleAlert />,
			path: ACTIONCENTER,
			badgeCount: conflictCount + cancellationRecoveryCount,
		},
		{
			name: t('components.navbar.notifications'),
			icon: <Bell />,
			path: NOTIFICATIONS,
			badgeCount: failedNotificationsCount,
		},
		{
			name: t('globals.patients'),
			icon: <PatientList />,
			path: PATIENTS,
		},
		{
			name: t('globals.billing-manager'),
			icon: <Wallet />,
			path: PAYMENTS,
			disabled: true,
			comingSoon: true,
		},
	];

	const footerItems = [
		{
			name: t('components.navbar.user-settings'),
			icon: <Settings />,
			path: `${userDetails?._id}`,
			onClick: () => toggleUserDetails(),
		},
		{
			name: t('globals.change-language'),
			component: <Localization iconVariant />,
		},
		{
			name: t('globals.help'),
			icon: <Help />,
			onClick: () => setIsHelpCenterOpen(true),
		},
		{ name: t('globals.logout'), icon: <Logout />, path: LOGOUT },
	];

	const distinctId =
		isAuthenticated && userDetails?._id ? userDetails._id : null;

	if (sessionStatus) return sessionStatus;

	return (
		<LayoutWrapper data-testid='app-layout-wrapper' id='app-layout-wrapper'>
			<AppAnalytics isAuthenticated={isAuthenticated} distinctId={distinctId} />
			<NavBarWrapper data-testid='app-navbar-wrapper' id='app-navbar-wrapper'>
				<Box>
					<Navbar items={menuItems} footerItems={footerItems} />
				</Box>
				<DividerWrapper data-testid='app-navbar-divider' id='app-navbar-divider'>
					<Divider
						orientation={isMobile || isTablet ? 'horizontal' : 'vertical'}
					/>
				</DividerWrapper>
			</NavBarWrapper>
			<Content data-testid='app-layout-content' id='app-layout-content'>
				<EnvironmentBanner isVisible={isTestingEnv} />
				<AvailabilityGate>
					<Outlet />
				</AvailabilityGate>
				{isAuthenticated && isUserDetailsVisible && (
					<UserDetailsCard user={userDetails} />
				)}
			</Content>
			<Modal
				openModal={isHelpCenterOpen}
				title={t('components.help-center.title')}
				onClose={() => setIsHelpCenterOpen(false)}
				cardActionsProps={{
					actionName: t('components.help-center.open-help'),
					hasSecondAction: true,
					onClick: openExternalHelp,
					secondAction: () => setIsHelpCenterOpen(false),
					secondActionName: t('common.close'),
				}}
			>
				<HelpCenterBody>
					<HelpCenterIntro>
						{t('components.help-center.description')}
					</HelpCenterIntro>
					<HelpCenterOptionList>
						<HelpCenterOption>
							<HelpCenterOptionTitle>
								{t('components.help-center.options.support.title')}
							</HelpCenterOptionTitle>
							<HelpCenterOptionBody>
								{t('components.help-center.options.support.body')}
							</HelpCenterOptionBody>
						</HelpCenterOption>
						<HelpCenterOption>
							<HelpCenterOptionTitle>
								{t('components.help-center.options.feedback.title')}
							</HelpCenterOptionTitle>
							<HelpCenterOptionBody>
								{t('components.help-center.options.feedback.body')}
							</HelpCenterOptionBody>
						</HelpCenterOption>
						<HelpCenterOption>
							<HelpCenterOptionTitle>
								{t('components.help-center.options.future.title')}
							</HelpCenterOptionTitle>
							<HelpCenterOptionBody>
								{t('components.help-center.options.future.body')}
							</HelpCenterOptionBody>
						</HelpCenterOption>
					</HelpCenterOptionList>
				</HelpCenterBody>
			</Modal>
		</LayoutWrapper>
	);
};

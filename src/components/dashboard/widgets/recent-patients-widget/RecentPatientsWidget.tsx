import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { Avatar as MUIAvatar } from '@mui/material';
import { ChevronRight, Messenger } from '@psycron/components/icons';
import { formatDistanceToNow, parseISO } from 'date-fns';

import { WidgetHeader, WidgetTitle } from '../schedule-widget/ScheduleWidget.styles';

import {
	EmptyPatientsState,
	MessageButton,
	PatientInfo,
	PatientMeta,
	PatientName,
	PatientRow,
	PatientsList,
	ViewAllLink,
} from './RecentPatientsWidget.styles';
import type { RecentPatientsWidgetProps } from './RecentPatientsWidget.types';

const rowVariants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.05, duration: 0.22, ease: 'easeOut' },
	}),
};

const stringToColor = (s: string): string => {
	let hash = 0;
	for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
	let color = '#';
	for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
	return color;
};

const getActivityLabel = (
	patient: RecentPatientsWidgetProps['patients'][number],
	t: ReturnType<typeof useTranslation>['t']
): string => {
	const activity = t(
		`page.dashboard.widgets.recent-patients.activity.${patient.lastActivityType}`
	);
	if (!patient.lastActivityAt) return activity;

	return `${activity} · ${formatDistanceToNow(parseISO(patient.lastActivityAt), {
		addSuffix: true,
	})}`;
};

export const RecentPatientsWidget = ({
	isLoading,
	onViewAll,
	patients,
}: RecentPatientsWidgetProps) => {
	const { t } = useTranslation();

	if (isLoading) {
		return (
			<Box display='flex' flexDirection='column' gap={1}>
				{[...Array(4)].map((_, i) => (
					<Box key={`rp-skeleton-${i}`} display='flex' gap={1.5} alignItems='center'>
						<Skeleton variant='circular' width={36} height={36} />
						<Box flex={1}>
							<Skeleton height={16} width='50%' />
							<Skeleton height={13} width='35%' />
						</Box>
					</Box>
				))}
			</Box>
		);
	}

	return (
		<>
			<WidgetHeader>
				<WidgetTitle>{t('page.dashboard.widgets.recent-patients.title')}</WidgetTitle>
				{onViewAll && (
					<ViewAllLink onClick={onViewAll} role='button'>
						{t('page.dashboard.widgets.recent-patients.view-all')}
						<ChevronRight height={13} width={13} />
					</ViewAllLink>
				)}
			</WidgetHeader>

			{patients.length === 0 ? (
				<EmptyPatientsState>
					{t('page.dashboard.widgets.recent-patients.empty')}
				</EmptyPatientsState>
			) : (
				<PatientsList>
					{patients.map((patient, i) => {
						const name = `${patient.firstName} ${patient.lastName}`;
						return (
							<PatientRow
								animate='visible'
								custom={i}
								initial='hidden'
								key={patient.id}
								onClick={patient.onOpen}
								variants={rowVariants}
							>
								<MUIAvatar
									alt={name}
									sx={{
										bgcolor: stringToColor(name),
										fontSize: 13,
										fontWeight: 700,
										height: 36,
										width: 36,
									}}
								>
									{patient.firstName[0]}
									{patient.lastName[0]}
								</MUIAvatar>
								<PatientInfo>
									<PatientName>{name}</PatientName>
									<PatientMeta>{getActivityLabel(patient, t)}</PatientMeta>
								</PatientInfo>
								{patient.onMessage && (
									<MessageButton
										aria-label={t('page.dashboard.widgets.recent-patients.message-aria', { name })}
										onClick={(e) => {
											e.stopPropagation();
											patient.onMessage?.();
										}}
									>
										<Messenger height={16} width={16} />
									</MessageButton>
								)}
							</PatientRow>
						);
					})}
				</PatientsList>
			)}
		</>
	);
};

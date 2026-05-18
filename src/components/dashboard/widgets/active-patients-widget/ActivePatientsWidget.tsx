import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { stringToColor } from '@psycron/utils/patient/patient.utils';
import { parseISO } from 'date-fns';

import { WidgetHeader, WidgetTitle } from '../schedule-widget/ScheduleWidget.styles';

import {
	EmptyState,
	PatientAvatar,
	PatientDate,
	PatientInfo,
	PatientList,
	PatientName,
	PatientRow,
} from './ActivePatientsWidget.styles';
import type { ActivePatientsWidgetProps } from './ActivePatientsWidget.types';

const rowVariants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.05, duration: 0.22, ease: 'easeOut' },
	}),
};

export const ActivePatientsWidget = ({
	isLoading,
	onPatientClick,
	patients,
}: ActivePatientsWidgetProps) => {
	const { t, i18n } = useTranslation();

	if (isLoading) {
		return (
			<Box display='flex' flexDirection='column' gap={1}>
				<Skeleton height={20} width='60%' />
				{[...Array(5)].map((_, i) => (
					<Box alignItems='center' display='flex' gap={1.5} key={`ap-skeleton-${i}`}>
						<Skeleton height={36} variant='circular' width={36} />
						<Box flex={1}>
							<Skeleton height={14} width='55%' />
							<Skeleton height={12} width='35%' />
						</Box>
					</Box>
				))}
			</Box>
		);
	}

	return (
		<>
			<WidgetHeader>
				<WidgetTitle>{t('page.dashboard.widgets.active-patients.title')}</WidgetTitle>
			</WidgetHeader>

			{patients.length === 0 ? (
				<EmptyState>{t('page.dashboard.widgets.active-patients.empty')}</EmptyState>
			) : (
				<PatientList>
					{patients.map((patient, i) => {
						const name = `${patient.firstName} ${patient.lastName}`;
						const color = stringToColor(name);
						const dateLabel = new Intl.DateTimeFormat(i18n.language, {
							dateStyle: 'medium',
						}).format(parseISO(patient.createdAt));

						return (
							<PatientRow
								animate='visible'
								aria-label={name}
								avatarColor={color}
								custom={i}
								initial='hidden'
								key={patient.id}
								onClick={() => onPatientClick(patient.id)}
								variants={rowVariants}
							>
								<PatientAvatar alt={name} avatarColor={color}>
									{patient.firstName[0]}
									{patient.lastName[0]}
								</PatientAvatar>
								<PatientInfo>
									<PatientName>{name}</PatientName>
									<PatientDate>{dateLabel}</PatientDate>
								</PatientInfo>
							</PatientRow>
						);
					})}
				</PatientList>
			)}
		</>
	);
};

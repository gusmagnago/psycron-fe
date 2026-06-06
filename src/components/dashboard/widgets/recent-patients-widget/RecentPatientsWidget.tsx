import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { Messenger, Patients } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import {
	EmptyPatientsState,
	MessageButton,
	PatientAvatar,
	PatientInfo,
	PatientMeta,
	PatientName,
	PatientRow,
	PatientsList,
} from './RecentPatientsWidget.styles';
import type { RecentPatientsWidgetProps } from './RecentPatientsWidget.types';
import { getActivityLabel, rowVariants } from './RecentPatientsWidget.utils';

export const RecentPatientsWidget = ({
	colSpan,
	isLoading,
	onViewAll,
	patients,
}: RecentPatientsWidgetProps) => {
	const isWide = (colSpan ?? 0) >= 6;
	const { t } = useTranslation();

	const headerActions = useMemo(
		() => (
			<>
				{onViewAll && (
					<Tooltip
						aria-label={t('page.dashboard.widgets.recent-patients.view-all')}
						onClick={onViewAll}
						placement='bottom'
						title={t('page.dashboard.widgets.recent-patients.view-all')}
					>
						<Patients />
					</Tooltip>
				)}
			</>
		),
		[onViewAll, t]
	);

	const body = isLoading ? (
		<Box display='flex' flexDirection='column' gap={1}>
			{[...Array(4)].map((_, i) => (
				<Box
					alignItems='center'
					display='flex'
					gap={1.5}
					key={`rp-skeleton-${i}`}
				>
					<Skeleton height={36} variant='circular' width={36} />
					<Box flex={1}>
						<Skeleton height={16} width='50%' />
						<Skeleton height={13} width='35%' />
					</Box>
				</Box>
			))}
		</Box>
	) : patients.length === 0 ? (
		<EmptyPatientsState>
			{t('page.dashboard.widgets.recent-patients.empty')}
		</EmptyPatientsState>
	) : (
		<PatientsList isWide={isWide}>
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
						<PatientAvatar
							firstName={patient.firstName}
							lastName={patient.lastName}
							size={36}
						/>
						<PatientInfo>
							<PatientName>{name}</PatientName>
							<PatientMeta>{getActivityLabel(patient, t)}</PatientMeta>
						</PatientInfo>
						{patient.onMessage && (
							<MessageButton
								aria-label={t(
									'page.dashboard.widgets.recent-patients.message-aria',
									{ name }
								)}
								onClick={(e) => {
									e.stopPropagation();
									patient.onMessage?.();
								}}
							>
								<Messenger />
							</MessageButton>
						)}
					</PatientRow>
				);
			})}
		</PatientsList>
	);

	return (
		<WidgetLayout
			body={body}
			headerActions={headerActions}
			title={t('page.dashboard.widgets.recent-patients.title')}
		/>
	);
};

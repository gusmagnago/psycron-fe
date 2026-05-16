import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';
import { ChevronRight, Messenger } from '@psycron/components/icons';

import {
	EmptyPatientsState,
	MessageButton,
	PatientAvatar,
	PatientInfo,
	PatientMeta,
	PatientName,
	PatientRow,
	PatientsList,
	ViewAllLink,
} from './RecentPatientsWidget.styles';
import type { RecentPatientsWidgetProps } from './RecentPatientsWidget.types';
import { getActivityLabel, rowVariants } from './RecentPatientsWidget.utils';

export const RecentPatientsWidget = ({
	isLoading,
	onViewAll,
	patients,
}: RecentPatientsWidgetProps) => {
	const { t } = useTranslation();

	const headerActions = useMemo(
		() =>
			onViewAll ? (
				<ViewAllLink onClick={onViewAll}>
					{t('page.dashboard.widgets.recent-patients.view-all')}
					<ChevronRight />
				</ViewAllLink>
			) : undefined,
		[onViewAll, t]
	);

	useBentoTileChrome({
		headerActions,
		title: t('page.dashboard.widgets.recent-patients.title'),
	});

	if (isLoading) {
		return (
			<Box display='flex' flexDirection='column' gap={1}>
				{[...Array(4)].map((_, i) => (
					<Box alignItems='center' display='flex' gap={1.5} key={`rp-skeleton-${i}`}>
						<Skeleton height={36} variant='circular' width={36} />
						<Box flex={1}>
							<Skeleton height={16} width='50%' />
							<Skeleton height={13} width='35%' />
						</Box>
					</Box>
				))}
			</Box>
		);
	}

	return patients.length === 0 ? (
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
};

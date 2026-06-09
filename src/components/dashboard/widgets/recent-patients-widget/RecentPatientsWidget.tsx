import { type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { Messenger } from '@psycron/components/icons';

import {
	EmptyPatientsState,
	MessageButton,
	PatientInfo,
	PatientMeta,
	PatientName,
	PatientRow,
	PatientsList,
} from './RecentPatientsWidget.styles';
import type { RecentPatientsWidgetProps } from './RecentPatientsWidget.types';
import { getCreatedAtLabel, rowVariants } from './RecentPatientsWidget.utils';

const RECENT_PATIENTS_WIDGET_ID_PREFIX = 'dashboard-recent-patients-widget';

export const RecentPatientsWidget = ({
	colSpan,
	isLoading,
	patients,
}: RecentPatientsWidgetProps) => {
	const isWide = (colSpan ?? 0) >= 6;
	const { i18n, t } = useTranslation();

	const body = isLoading ? (
		<Box
			data-testid={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading`}
			display='flex'
			flexDirection='column'
			gap={1}
			id={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading`}
		>
			{[...Array(4)].map((_, i) => (
				<Box
					alignItems='center'
					display='flex'
					gap={1.5}
					data-testid={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-row-${i}`}
					id={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-row-${i}`}
					key={`rp-skeleton-${i}`}
				>
					<Skeleton
						data-testid={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-avatar-${i}`}
						height={36}
						id={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-avatar-${i}`}
						variant='circular'
						width={36}
					/>
					<Box
						data-testid={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-copy-${i}`}
						flex={1}
						id={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-copy-${i}`}
					>
						<Skeleton
							data-testid={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-name-${i}`}
							height={16}
							id={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-name-${i}`}
							width='50%'
						/>
						<Skeleton
							data-testid={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-meta-${i}`}
							height={13}
							id={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-loading-meta-${i}`}
							width='35%'
						/>
					</Box>
				</Box>
			))}
		</Box>
	) : patients.length === 0 ? (
		<EmptyPatientsState
			data-testid={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-empty`}
			id={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-empty`}
		>
			{t('page.dashboard.widgets.recent-patients.empty')}
		</EmptyPatientsState>
	) : (
		<PatientsList
			data-testid={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-list`}
			id={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-list`}
			isWide={isWide}
		>
			{patients.map((patient, i) => {
				const name = `${patient.firstName} ${patient.lastName}`;
				const rowId = `${RECENT_PATIENTS_WIDGET_ID_PREFIX}-row-${patient.id}`;
				const createdAtLabel = getCreatedAtLabel(patient.createdAt, i18n.language);
				return (
					<PatientRow
						animate='visible'
						aria-label={name}
						custom={i}
						data-testid={rowId}
						initial='hidden'
						id={rowId}
						key={patient.id}
						onClick={patient.onOpen}
						onKeyDown={
							patient.onOpen
								? (event: KeyboardEvent<HTMLDivElement>) => {
										if (event.key === 'Enter' || event.key === ' ') {
											event.preventDefault();
											patient.onOpen?.();
										}
									}
								: undefined
						}
						variants={rowVariants}
						role={patient.onOpen ? 'button' : undefined}
						tabIndex={patient.onOpen ? 0 : undefined}
					>
						<PatientInfo
							data-testid={`${rowId}-info`}
							id={`${rowId}-info`}
						>
							<PatientName
								data-testid={`${rowId}-name`}
								id={`${rowId}-name`}
							>
								{name}
							</PatientName>
							<PatientMeta
								data-testid={`${rowId}-meta`}
								id={`${rowId}-meta`}
							>
								{createdAtLabel}
							</PatientMeta>
						</PatientInfo>
						{patient.onMessage && (
							<MessageButton
								aria-label={t(
									'page.dashboard.widgets.recent-patients.message-aria',
									{ name }
								)}
								data-testid={`${rowId}-message`}
								id={`${rowId}-message`}
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
			titleId={`${RECENT_PATIENTS_WIDGET_ID_PREFIX}-title`}
			title={t('page.dashboard.widgets.recent-patients.title')}
		/>
	);
};

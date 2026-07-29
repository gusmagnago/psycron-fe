import type { KeyboardEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Phone } from '@psycron/components/icons';
import { formatTimezoneLabel } from '@psycron/utils/date/date.utils';

import { BillingCell } from '../cells/BillingCell';
import { NextSessionCell } from '../cells/NextSessionCell';
import {
	patientCardScrollVariants,
	patientCardScrollViewport,
} from '../PatientListPage.motion';
import {
	ActionPill,
	ContactIcon,
	ContactValue,
	OpenAction,
	PatientCell,
	PatientSummary,
	PatientTableRow,
	PrimaryValue,
	SecondaryValue,
	SimpleValue,
} from '../PatientListPage.styles';
import { getPreferredContactIcon } from '../PatientListPage.utils';
import type {
	PatientWorkspaceColumn,
	PatientWorkspaceRow,
} from '../PatientsPage.types';
import { getPreferredContactLabelKey } from '../PatientsPage.utils';

interface PatientRowProps {
	isSelected: boolean;
	onGoToConflicts: (event: MouseEvent<HTMLElement>) => void;
	onOpenWorkflow: (patient: PatientWorkspaceRow) => void;
	onRowKeyDown: (
		event: KeyboardEvent<HTMLTableRowElement>,
		patient: PatientWorkspaceRow
	) => void;
	patient: PatientWorkspaceRow;
	patientIndex: number;
	shouldAnimate: boolean;
	visibleColumnSet: Set<PatientWorkspaceColumn>;
}

export const PatientRow = ({
	isSelected,
	onGoToConflicts,
	onOpenWorkflow,
	onRowKeyDown,
	patient,
	patientIndex,
	shouldAnimate,
	visibleColumnSet,
}: PatientRowProps) => {
	const { i18n, t } = useTranslation();
	const rowTestId = `patients-workspace-row-${patient.uiRowKey}`;
	const contactValue =
		patient.contacts?.phone ||
		patient.contacts?.email ||
		patient.contacts?.whatsapp;
	const contactIconType = patient.contacts?.phone
		? 'phone'
		: patient.contacts?.email
			? 'email'
			: patient.contacts?.whatsapp
				? 'whatsapp'
				: patient.preferredContactType;

	return (
		<PatientTableRow
			aria-label={t('patients.list.open-workflow', {
				patient: patient.fullName,
			})}
			custom={patientIndex}
			data-testid={rowTestId}
			id={rowTestId}
			initial={shouldAnimate ? 'hidden' : false}
			layout={shouldAnimate ? 'position' : false}
			data-selected={isSelected}
			onClick={() => onOpenWorkflow(patient)}
			onKeyDown={(event) => onRowKeyDown(event, patient)}
			tabIndex={0}
			variants={patientCardScrollVariants}
			viewport={patientCardScrollViewport}
			whileInView={shouldAnimate ? 'visible' : undefined}
		>
			<PatientCell
				data-column='patient'
				data-label={t('patients.list.columns.patient')}
				data-testid={`${rowTestId}-patient`}
			>
				<PatientSummary data-testid={`${rowTestId}-patient-summary`}>
					<PrimaryValue>{patient.fullName}</PrimaryValue>
					<SecondaryValue>
						{t(getPreferredContactLabelKey(patient.preferredContactType))}{' '}
						·{' '}
						{formatTimezoneLabel(
							patient.timeZone,
							i18n.language,
							t('patients.list.not-available')
						)}
					</SecondaryValue>
				</PatientSummary>
			</PatientCell>
			{visibleColumnSet.has('contact') ? (
				<PatientCell
					data-column='contact'
					data-label={t('patients.list.columns.contact')}
					data-testid={`${rowTestId}-contact`}
				>
					<ContactValue
						data-missing={!patient.hasContact}
						data-testid={`${rowTestId}-contact-value`}
						role={!patient.hasContact ? 'status' : undefined}
						aria-label={
							!patient.hasContact
								? t('patients.list.contact-missing-aria')
								: undefined
						}
					>
						<ContactIcon
							id={`${rowTestId}-contact-icon`}
							data-testid={`${rowTestId}-contact-icon`}
						>
							{patient.hasContact ? (
								getPreferredContactIcon(contactIconType)
							) : (
								<Phone />
							)}
						</ContactIcon>
						<span>{contactValue || t('patients.list.contact-missing')}</span>
					</ContactValue>
				</PatientCell>
			) : null}
			{visibleColumnSet.has('next-action') ? (
				<PatientCell
					data-column='next-action'
					data-label={t('patients.list.columns.next-action')}
					data-testid={`${rowTestId}-next-action`}
				>
					<ActionPill
						data-action={patient.nextAction}
						data-testid={`${rowTestId}-next-action-status`}
						id={`${rowTestId}-next-action-status`}
						onClick={(event) => {
							event.stopPropagation();
							if (patient.nextAction === 'review-duplicate')
								onGoToConflicts(event);
							else onOpenWorkflow(patient);
						}}
						type='button'
					>
						{t(`patients.list.next-actions.${patient.nextAction}`)}
					</ActionPill>
				</PatientCell>
			) : null}
			{visibleColumnSet.has('next-session') ? (
				<PatientCell
					data-column='next-session'
					data-label={t('patients.list.columns.next-session')}
					data-testid={`${rowTestId}-next-session`}
				>
					<NextSessionCell patient={patient} />
				</PatientCell>
			) : null}
			{visibleColumnSet.has('billing') ? (
				<PatientCell
					data-column='billing'
					data-label={t('patients.list.columns.billing')}
					data-testid={`${rowTestId}-billing`}
				>
					<BillingCell patient={patient} />
				</PatientCell>
			) : null}
			{visibleColumnSet.has('sessions') ? (
				<PatientCell
					data-column='sessions'
					data-label={t('patients.list.columns.sessions')}
					data-testid={`${rowTestId}-sessions`}
				>
					<SimpleValue>{patient.totalSessions}</SimpleValue>
				</PatientCell>
			) : null}
			<PatientCell data-column='open' data-testid={`${rowTestId}-open`}>
				<OpenAction
					aria-label={t('patients.list.open-workflow', {
						patient: patient.fullName,
					})}
					data-testid={`${rowTestId}-open-action`}
					id={`${rowTestId}-open-action`}
					onClick={(event) => {
						event.stopPropagation();
						onOpenWorkflow(patient);
					}}
					type='button'
				>
					<ChevronRight />
				</OpenAction>
			</PatientCell>
		</PatientTableRow>
	);
};

import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { CheckSuccess, HealthTracker } from '@psycron/components/icons';
import { formatLocalizedDate } from '@psycron/utils/date/date.utils';
import { getPatientBillingViewModel } from '@psycron/utils/patient/patient.utils';

import {
	WorkflowApproval,
	WorkflowDetail,
	WorkflowDetailGrid,
	WorkflowDetailLabel,
	WorkflowDetailValue,
	WorkflowDrawerBody,
	WorkflowDrawerSubtitle,
	WorkflowGuidance,
	WorkflowNextStep,
	WorkflowNextStepCopy,
	WorkflowNextStepIcon,
	WorkflowNextStepTitle,
	WorkflowSectionTitle,
	WorkflowStatus,
	WorkflowSummary,
} from './PatientWorkflowDrawer.styles';
import type { PatientWorkflowDrawerProps } from './PatientWorkflowDrawer.types';

export const PatientWorkflowDrawer = ({
	onClose,
	onCompleteNextAction,
	onOpenProfile,
	patient,
}: PatientWorkflowDrawerProps) => {
	const { i18n, t } = useTranslation();
	const billing = getPatientBillingViewModel(
		patient.billing,
		i18n.language,
		t
	);
	const billingLabel = [billing.summaryPrimary, billing.summarySecondary]
		.filter(Boolean)
		.join(' ');
	const nextActionLabel = t(
		`patients.list.next-actions.${patient.nextAction}`
	);
	const nextSessionLabel = patient.nextSessionDate
		? formatLocalizedDate(
				patient.nextSessionDate,
				t('patients.list.next-session.none'),
				i18n.language,
				'PPp'
			)
		: t('patients.list.next-session.none');
	const contactLabel = patient.hasContact
		? t('patients.list.drawer.contact-ready')
		: t('patients.list.contact-missing');
	const guidance =
		patient.nextAction === 'ready'
			? t('patients.list.drawer.guidance-ready')
			: t('patients.list.drawer.guidance');

	return (
		<Drawer
			actions={
				<>
					<Button
						data-testid='patients-drawer-primary-action'
						fullWidth
						id='patients-drawer-primary-action'
						onClick={() => onOpenProfile(patient._id)}
						type='button'
					>
						{t('patients.list.drawer.open-profile')}
					</Button>
					{patient.nextAction !== 'ready' ? (
						<Button
							data-testid='patients-drawer-secondary-action'
							fullWidth
							id='patients-drawer-secondary-action'
							onClick={() => onCompleteNextAction(patient)}
							tertiary
							type='button'
							variant='outlined'
						>
							{nextActionLabel}
						</Button>
					) : null}
				</>
			}
			ariaLabel={t('patients.list.drawer.aria-label', {
				patient: patient.fullName,
			})}
			backdropId='patients-workflow-scrim'
			backdropTestId='patients-workflow-scrim'
			closeButtonId='patients-workflow-drawer-close'
			closeButtonTestId='patients-workflow-drawer-close'
			contentId='patients-workflow-drawer-content'
			contentTestId='patients-workflow-drawer-content'
			data-testid='patients-workflow-drawer'
			headerExtra={
				<WorkflowDrawerSubtitle
					data-testid='patients-drawer-subtitle'
					id='patients-drawer-subtitle'
				>
					{t('patients.list.drawer.subtitle')}
				</WorkflowDrawerSubtitle>
			}
			id='patients-workflow-drawer'
			onClose={onClose}
			title={
				<span
					data-testid='patients-drawer-title'
					id='patients-drawer-title'
				>
					{patient.fullName}
				</span>
			}
		>
			<WorkflowDrawerBody
				data-testid='patients-workflow-drawer-body'
				id='patients-workflow-drawer-body'
			>
				<WorkflowSummary
					data-testid='patients-drawer-summary'
					id='patients-drawer-summary'
				>
					<WorkflowStatus
						data-action={patient.nextAction}
						data-testid='patients-drawer-status'
						id='patients-drawer-status'
					>
						{nextActionLabel}
					</WorkflowStatus>
					<WorkflowDetailGrid
						data-testid='patients-drawer-details'
						id='patients-drawer-details'
					>
						<WorkflowDetail data-testid='patients-drawer-next-session'>
							<WorkflowDetailLabel>
								{t('patients.list.columns.next-session')}
							</WorkflowDetailLabel>
							<WorkflowDetailValue
								data-testid='patients-drawer-next'
								id='patients-drawer-next'
							>
								{nextSessionLabel}
							</WorkflowDetailValue>
						</WorkflowDetail>
						<WorkflowDetail data-testid='patients-drawer-billing-detail'>
							<WorkflowDetailLabel>
								{t('patients.list.columns.billing')}
							</WorkflowDetailLabel>
							<WorkflowDetailValue
								data-testid='patients-drawer-billing'
								id='patients-drawer-billing'
							>
								{billingLabel}
							</WorkflowDetailValue>
						</WorkflowDetail>
						<WorkflowDetail data-testid='patients-drawer-contact-detail'>
							<WorkflowDetailLabel>
								{t('patients.list.columns.contact')}
							</WorkflowDetailLabel>
							<WorkflowDetailValue
								data-testid='patients-drawer-contact'
								id='patients-drawer-contact'
							>
								{contactLabel}
							</WorkflowDetailValue>
						</WorkflowDetail>
						<WorkflowDetail data-testid='patients-drawer-sessions-detail'>
							<WorkflowDetailLabel>
								{t('patients.list.columns.sessions')}
							</WorkflowDetailLabel>
							<WorkflowDetailValue
								data-testid='patients-drawer-sessions'
								id='patients-drawer-sessions'
							>
								{patient.totalSessions}
							</WorkflowDetailValue>
						</WorkflowDetail>
					</WorkflowDetailGrid>
				</WorkflowSummary>

				<WorkflowSummary
					data-testid='patients-drawer-recommendation'
					id='patients-drawer-recommendation'
				>
					<WorkflowSectionTitle>
						{t('patients.list.drawer.recommended-step')}
					</WorkflowSectionTitle>
					<WorkflowNextStep>
						<WorkflowNextStepIcon
							aria-hidden='true'
							data-testid='patients-drawer-recommendation-icon'
							id='patients-drawer-recommendation-icon'
						>
							<HealthTracker />
						</WorkflowNextStepIcon>
						<WorkflowNextStepCopy>
							<WorkflowNextStepTitle
								data-testid='patients-drawer-action'
								id='patients-drawer-action'
							>
								{nextActionLabel}
							</WorkflowNextStepTitle>
							<WorkflowGuidance
								data-testid='patients-drawer-guidance'
								id='patients-drawer-guidance'
							>
								{guidance}
							</WorkflowGuidance>
						</WorkflowNextStepCopy>
					</WorkflowNextStep>
					<WorkflowApproval
						data-testid='patients-drawer-approval'
						id='patients-drawer-approval'
					>
						<CheckSuccess aria-hidden='true' />
						<span>{t('patients.list.drawer.approval')}</span>
					</WorkflowApproval>
				</WorkflowSummary>
			</WorkflowDrawerBody>
		</Drawer>
	);
};

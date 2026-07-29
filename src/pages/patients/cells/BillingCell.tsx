import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mui/material';
import { getPatientBillingViewModel } from '@psycron/utils/patient/patient.utils';

import {
	BillingSummary,
	BillingTooltipContent,
	BillingTooltipRow,
	MetaLabel,
	SecondaryValue,
	SimpleValue,
} from '../PatientListPage.styles';
import type { PatientWorkspaceRow } from '../PatientsPage.types';

interface BillingCellProps {
	patient: PatientWorkspaceRow;
}

export const BillingCell = ({ patient }: BillingCellProps) => {
	const { i18n, t } = useTranslation();
	const billingViewModel = getPatientBillingViewModel(
		patient.billing,
		i18n.language,
		t
	);

	const tooltipContent = billingViewModel.isConfigured ? (
		<BillingTooltipContent>
			<BillingTooltipRow>
				<MetaLabel>{t('patients.profile.billing.model')}</MetaLabel>
				<SimpleValue>{billingViewModel.modelLabel}</SimpleValue>
			</BillingTooltipRow>
			<BillingTooltipRow>
				<MetaLabel>{t('patients.profile.billing.category')}</MetaLabel>
				<SimpleValue>{billingViewModel.categoryLabel}</SimpleValue>
			</BillingTooltipRow>
			<BillingTooltipRow>
				<MetaLabel>{t('patients.profile.billing.amount')}</MetaLabel>
				<SimpleValue>{billingViewModel.amountLabel}</SimpleValue>
			</BillingTooltipRow>
		</BillingTooltipContent>
	) : (
		t('patients.list.billing.none')
	);

	return (
		<Tooltip arrow placement='top' title={tooltipContent}>
			<BillingSummary data-configured={billingViewModel.isConfigured}>
				<SimpleValue>{billingViewModel.summaryPrimary}</SimpleValue>
				{billingViewModel.summarySecondary ? (
					<SecondaryValue>{billingViewModel.summarySecondary}</SecondaryValue>
				) : null}
			</BillingSummary>
		</Tooltip>
	);
};

import { useTranslation } from 'react-i18next';
import { AlarmClock } from '@psycron/components/icons';
import { formatLocalizedDate } from '@psycron/utils/date/date.utils';

import { NextSessionValue } from '../PatientListPage.styles';
import type { PatientWorkspaceRow } from '../PatientsPage.types';

interface NextSessionCellProps {
	patient: PatientWorkspaceRow;
}

export const NextSessionCell = ({ patient }: NextSessionCellProps) => {
	const { i18n, t } = useTranslation();

	if (!patient.nextSessionDate) {
		return (
			<NextSessionValue data-state='none'>
				{t('patients.list.next-session.none')}
			</NextSessionValue>
		);
	}

	const formattedDate = formatLocalizedDate(
		patient.nextSessionDate,
		t('patients.list.next-session.none'),
		i18n.language,
		'PPp'
	);
	const minutesUntil = Math.max(
		0,
		Math.ceil((new Date(patient.nextSessionDate).getTime() - Date.now()) / 60000)
	);
	const label =
		patient.nextSessionState === 'now'
			? t('patients.list.next-session.now')
			: patient.nextSessionState === 'approaching' ||
				  patient.nextSessionState === 'imminent'
				? t('patients.list.next-session.soon', {
						minutes: minutesUntil,
						time: formattedDate,
					})
				: formattedDate;

	return (
		<NextSessionValue data-state={patient.nextSessionState}>
			{patient.nextSessionState !== 'normal' ? <AlarmClock /> : null}
			{label}
		</NextSessionValue>
	);
};

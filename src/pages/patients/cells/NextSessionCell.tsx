import { useTranslation } from 'react-i18next';
import { AlarmClock } from '@psycron/components/icons';
import { useNow } from '@psycron/hooks/useNow';
import { formatLocalizedDate } from '@psycron/utils/date/date.utils';

import { NextSessionValue } from '../PatientListPage.styles';
import type { PatientWorkspaceRow } from '../PatientsPage.types';
import { getPatientNextSessionState } from '../PatientsPage.utils';

interface NextSessionCellProps {
	patient: PatientWorkspaceRow;
}

// The urgency thresholds are 15 and 120 minutes, so a half-minute tick moves a
// row into 'imminent'/'now' well inside the minute it is displayed as.
const URGENCY_TICK_IN_MS = 30_000;

export const NextSessionCell = ({ patient }: NextSessionCellProps) => {
	const { i18n, t } = useTranslation();
	// Derived at render off a ticking clock, not frozen at fetch time: this
	// surface exists to answer "what needs attention now", so a session crossing
	// a threshold has to light up without waiting for a refetch.
	const now = useNow(URGENCY_TICK_IN_MS);
	const nextSessionState = getPatientNextSessionState(
		patient.nextSessionDate,
		now
	);

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
		Math.ceil(
			(new Date(patient.nextSessionDate).getTime() - now.getTime()) / 60000
		)
	);
	const label =
		nextSessionState === 'now'
			? t('patients.list.next-session.now')
			: nextSessionState === 'approaching' || nextSessionState === 'imminent'
				? t('patients.list.next-session.soon', {
						minutes: minutesUntil,
						time: formattedDate,
					})
				: formattedDate;

	return (
		<NextSessionValue data-state={nextSessionState}>
			{nextSessionState !== 'normal' ? <AlarmClock /> : null}
			{label}
		</NextSessionValue>
	);
};

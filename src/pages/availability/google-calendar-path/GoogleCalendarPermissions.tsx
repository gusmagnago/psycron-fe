import { useTranslation } from 'react-i18next';
import { CheckSuccess, ChevronLeft } from '@psycron/components/icons';

import { StatusNote } from '../jupiter-conversation/status-note/StatusNote';

import {
	BackButton,
	ButtonRow,
	ContinueBtn,
	PermissionItem,
	PermissionList,
	PermissionsCard,
	PermissionsIntro,
	PrivacyNote,
} from './GoogleCalendarPermissions.styles';

interface GoogleCalendarPermissionsProps {
	onBack: () => void;
	onContinue: () => void;
}

const TID = 'jupiter-onboarding';

export const GoogleCalendarPermissions = ({
	onContinue,
	onBack,
}: GoogleCalendarPermissionsProps) => {
	const { t } = useTranslation();

	return (
		<PermissionsCard
			aria-describedby={`${TID}-google-permissions-desc`}
			aria-labelledby={`${TID}-google-permissions-title`}
			data-testid={`${TID}-google-permissions`}
			id={`${TID}-google-permissions`}
			role='group'
		>
			<PermissionsIntro
				data-testid={`${TID}-google-permissions-title`}
				id={`${TID}-google-permissions-title`}
			>
				{t('jupiter.google-calendar.permissions-intro')}
			</PermissionsIntro>

			<StatusNote
				id={`${TID}-google-permission-note`}
				testId={`${TID}-google-permission-note`}
				text={t('jupiter.notes.google-permission')}
				type='google'
			/>

			<PermissionList
				aria-label={t('jupiter.google-calendar.permissions-list-label')}
				data-testid={`${TID}-google-permissions-list`}
				id={`${TID}-google-permissions-list`}
			>
				<PermissionItem
					data-testid={`${TID}-google-permission-1`}
					id={`${TID}-google-permission-1`}
				>
					<span aria-hidden='true'>
						<CheckSuccess />
					</span>
					<span>{t('jupiter.google-calendar.permission-1')}</span>
				</PermissionItem>
				<PermissionItem
					data-testid={`${TID}-google-permission-2`}
					id={`${TID}-google-permission-2`}
				>
					<span aria-hidden='true'>
						<CheckSuccess />
					</span>
					<span>{t('jupiter.google-calendar.permission-2')}</span>
				</PermissionItem>
				<PermissionItem
					data-testid={`${TID}-google-permission-3`}
					id={`${TID}-google-permission-3`}
				>
					<span aria-hidden='true'>
						<CheckSuccess />
					</span>
					<span>{t('jupiter.google-calendar.permission-3')}</span>
				</PermissionItem>
			</PermissionList>

			<PrivacyNote
				data-testid={`${TID}-google-permissions-desc`}
				id={`${TID}-google-permissions-desc`}
			>
				{t('jupiter.google-calendar.privacy-note')}
			</PrivacyNote>

			<ButtonRow>
				<BackButton
					aria-label={t('jupiter.google-calendar.back-aria')}
					data-testid={`${TID}-google-permissions-back`}
					id={`${TID}-google-permissions-back`}
					onClick={onBack}
				>
					<span aria-hidden='true'>
						<ChevronLeft />
					</span>
					{t('jupiter.google-calendar.back')}
				</BackButton>
				<ContinueBtn
					data-testid={`${TID}-google-permissions-continue`}
					id={`${TID}-google-permissions-continue`}
					onClick={onContinue}
				>
					{t('jupiter.google-calendar.continue')}
				</ContinueBtn>
			</ButtonRow>
		</PermissionsCard>
	);
};

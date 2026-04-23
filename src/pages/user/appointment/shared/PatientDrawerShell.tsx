import { Button } from '@psycron/components/button/Button';
import { CloseButton } from '@psycron/components/button/close/CloseButton';
import { Divider } from '@psycron/components/divider/Divider';
import { DrawerBackdrop } from '@psycron/components/drawer/Drawer.styles';
import { Text } from '@psycron/components/text/Text';

import {
	AccentBar,
	Actions,
	FallbackActions,
	HeaderContent,
	HeaderRow,
	RoleChip,
	ShellBody,
	ShellContent,
	ShellHeader,
	ShellPanel,
	StatusChip,
} from './PatientDrawerShell.styles';
import type { PatientDrawerShellProps } from './PatientDrawerShell.types';

export const PatientDrawerShell = ({
	accentColor,
	actions,
	ariaLabel,
	children,
	closeLabel = 'Close',
	onClose,
	roleLabel,
	statusLabel,
	subtitle,
	title,
}: PatientDrawerShellProps) => (
	<>
		<DrawerBackdrop aria-hidden='true' onClick={onClose} role='presentation' />
		<ShellPanel aria-label={ariaLabel} aria-modal='true' role='dialog'>
			<AccentBar accentColor={accentColor} />
			<ShellContent>
				<ShellHeader>
					<HeaderContent>
						<RoleChip label={roleLabel} size='small' />
						<HeaderRow>
							<Text variant='h6'>{title}</Text>
							{statusLabel ? (
								<StatusChip
									accentColor={accentColor}
									label={statusLabel}
									size='small'
								/>
							) : null}
						</HeaderRow>
						{subtitle ? (
							<Text color='text.secondary' variant='body2'>
								{subtitle}
							</Text>
						) : null}
					</HeaderContent>
					<CloseButton onClick={onClose} />
				</ShellHeader>

				<ShellBody>{children}</ShellBody>

				{actions ? (
					<>
						<Divider />
						<Actions>{actions}</Actions>
					</>
				) : (
					<FallbackActions>
						<Button onClick={onClose} tertiary variant='text'>
							{closeLabel}
						</Button>
					</FallbackActions>
				)}
			</ShellContent>
		</ShellPanel>
	</>
);

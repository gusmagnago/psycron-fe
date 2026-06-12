import { Button } from '@psycron/components/button/Button';

import type { IDrawerActionsProps } from './DrawerActions.types';

export const DrawerActions = ({ config }: IDrawerActionsProps) => {
	return (
		<>
			{config.primary && (
				<Button
					fullWidth
					disabled={config.primary.disabled}
					loading={config.primary.loading}
					onClick={config.primary.onClick}
					severity={config.primary.severity}
					tertiary={config.primary.tertiary}
					variant={config.primary.variant}
				>
					{config.primary.label}
				</Button>
			)}
			{config.secondary && (
				<Button
					fullWidth
					disabled={config.secondary.disabled}
					onClick={config.secondary.onClick}
					severity={config.secondary.severity}
					tertiary={config.secondary.tertiary}
					variant={config.secondary.variant}
				>
					{config.secondary.label}
				</Button>
			)}
			{config.tertiaryAction && (
				<Button
					fullWidth
					disabled={config.tertiaryAction.disabled}
					loading={config.tertiaryAction.loading}
					onClick={config.tertiaryAction.onClick}
					severity={config.tertiaryAction.severity}
					tertiary={config.tertiaryAction.tertiary}
					variant={config.tertiaryAction.variant}
				>
					{config.tertiaryAction.label}
				</Button>
			)}
		</>
	);
};

export interface IDrawerActionConfig {
	disabled?: boolean;
	label: string;
	loading?: boolean;
	onClick: () => void;
	severity?: 'error';
	tertiary?: boolean;
	variant?: 'contained';
}

export interface IDrawerActionsConfig {
	primary?: IDrawerActionConfig;
	secondary?: IDrawerActionConfig;
	// Optional third action, rendered after secondary (e.g. "Mark as busy"
	// alongside booking + block on an available slot).
	tertiaryAction?: IDrawerActionConfig;
}

export interface IDrawerActionsProps {
	config: IDrawerActionsConfig;
}

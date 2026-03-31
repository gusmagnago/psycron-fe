export interface IDrawerActionConfig {
	disabled?: boolean;
	label: string;
	onClick: () => void;
	severity?: 'error';
	tertiary?: boolean;
	variant?: 'contained';
}

export interface IDrawerActionsConfig {
	primary?: IDrawerActionConfig;
	secondary?: IDrawerActionConfig;
}

export interface IDrawerActionsProps {
	config: IDrawerActionsConfig;
}

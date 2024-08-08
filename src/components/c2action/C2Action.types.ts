export interface IWaitlistSubs {
	email: string;
	language: string;
}

export interface IC2ActionProps {
	bttnText: string;
	error: string | null;
	i18nKey?: string;
	isLoading?: boolean;
	label: string;
	onSubmit: (data: IWaitlistSubs) => void;
}

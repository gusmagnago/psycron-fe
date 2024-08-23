export interface IWaitlistSubs {
	email: string;
	language: string;
}

export interface IGetSubscriber {
	token: string;
}

export interface WaitlistResponse {
	data?: {
		email: string;
		language: string;
	};
	message: string;
	success: boolean;
}

export interface Subscriber {
	data: {
		email: string;
		subscribed: boolean;
	};
	message?: string;
	success: boolean;
}

export interface UnsubscribeResponse {
	message: string;
	success: boolean;
}

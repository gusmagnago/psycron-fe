import { BACKOFFICE, DASHBOARD } from '@psycron/pages/urls';
import { PSYCRON_BASE_API } from '@psycron/utils/variables';

import type { StartGoogleOAuthArgs } from './GoogleOAuthButton.types';

const getTimeZone = (): string =>
	Intl.DateTimeFormat().resolvedOptions().timeZone;

const makeUrl = (base: string, path: string): URL => {
	const normalizedBase = base.endsWith('/') ? base : `${base}/`;
	const normalizedPath = path.replace(/^\//, '');
	return new URL(normalizedPath, normalizedBase);
};

const getOAuthConfig = (
	audience: StartGoogleOAuthArgs['audience']
): {
	path: string;
	returnPath: string;
	shouldIncludeStayConnected: boolean;
} => {
	if (audience === 'worker') {
		return {
			path: 'auth/worker/google',
			returnPath: BACKOFFICE,
			shouldIncludeStayConnected: true,
		};
	}

	return {
		path: 'auth/google',
		returnPath: DASHBOARD,
		shouldIncludeStayConnected: true,
	};
};

export const startGoogleOAuth = ({
	stayConnected,
	locale,
	intent,
	audience,
}: StartGoogleOAuthArgs): void => {
	const apiBase = PSYCRON_BASE_API;

	const { path, returnPath, shouldIncludeStayConnected } =
		getOAuthConfig(audience);

	const url = makeUrl(apiBase, path);

	url.searchParams.set('timeZone', getTimeZone());
	url.searchParams.set('returnTo', `/${returnPath}`);
	url.searchParams.set('intent', intent);
	url.searchParams.set('frontendOrigin', window.location.origin);

	if (shouldIncludeStayConnected && typeof stayConnected === 'boolean') {
		url.searchParams.set('stayConnected', String(stayConnected));
	}

	if (locale) {
		url.searchParams.set('locale', locale);
	}

	window.location.assign(url.toString());
};

import ReactGA from 'react-ga4';

export const trackLinkClick = (label: string) => {
	ReactGA.event({
		category: 'Link',
		action: 'Click',
		label,
	});
};

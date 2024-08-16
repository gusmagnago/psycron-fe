import type { FC } from 'react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

export const AnalyticsTracker: FC = () => {
	const location = useLocation();

	useEffect(() => {
		ReactGA.send({
			hitType: 'pageview',
			page: location.pathname + location.search,
			title: document.title,
		});
	}, [location]);

	return null;
};

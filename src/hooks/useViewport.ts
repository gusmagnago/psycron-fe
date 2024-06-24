import { useEffect,useState } from 'react';
import { breakpoints } from '@psycron/theme/media-queries/mediaQueries';


const getDeviceConfig = (width: number) => {
	if (width <= breakpoints.mobile) {
		return { isMobile: true, isTablet: false, isMedium: false, isLarge: false };
	} else if (width > breakpoints.mobile && width <= breakpoints.tablet) {
		return { isMobile: false, isTablet: true, isMedium: false, isLarge: false };
	} else if (width > breakpoints.tablet && width <= breakpoints.medium) {
		return { isMobile: false, isTablet: false, isMedium: true, isLarge: false };
	} else {
		return { isMobile: false, isTablet: false, isMedium: false, isLarge: true };
	}
};

const useViewport = () => {
	const [viewport, setViewport] = useState(getDeviceConfig(window.innerWidth));

	useEffect(() => {
		const handleResize = () => {
			setViewport(getDeviceConfig(window.innerWidth));
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return viewport;
};

export default useViewport;

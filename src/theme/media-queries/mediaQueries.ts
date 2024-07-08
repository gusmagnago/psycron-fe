export const breakpoints = {
	mobile: 767, // Extra small devices (phones)
	tablet: 1023, // Small devices (tablets)
	medium: 1439, // Medium devices (small laptops)
	large: 1440, // Large devices (desktops)
};

export const mediaQueries = {
	isSmallerThanTablet: `(max-width: ${breakpoints.mobile}px)`, // <= 767px
	isBetweenTabletAndMedium: `(min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`, // 768px - 1023px
	isBetweenMediumAndLarge: `(min-width: ${breakpoints.tablet + 1}px) and (max-width: ${breakpoints.medium}px)`, // 1024px - 1439px
	isBiggerThanLarge: `(min-width: ${breakpoints.large}px)`, // >= 1440px
	isBiggerThanTablet: `(min-width: ${breakpoints.mobile + 1}px)`, // >= 768px
	isBiggerThanMedium: `(min-width: ${breakpoints.tablet + 1}px)`, // >= 1024px
	isSmallerThanTabletOnly: `(max-width: ${breakpoints.tablet}px)`, // <= 1023px
	isSmallerThanMediumOnly: `(max-width: ${breakpoints.medium}px)`, // <= 1439px
};

/* Prefixed with @media */
export const isMobileMedia = `@media ${mediaQueries.isSmallerThanTablet}`; // <= 767px
export const isTabletMedia = `@media ${mediaQueries.isBetweenTabletAndMedium}`; // 768px - 1023px
export const isMediumMedia = `@media ${mediaQueries.isBetweenMediumAndLarge}`; // 1024px - 1439px
export const isLargeMedia = `@media ${mediaQueries.isBiggerThanLarge}`; // >= 1440px

export const isBiggerThanTabletMedia = `@media ${mediaQueries.isBiggerThanTablet}`; // >= 768px
export const isBiggerThanMediumMedia = `@media ${mediaQueries.isBiggerThanMedium}`; // >= 1024px

export const isSmallerThanTabletMedia = `@media ${mediaQueries.isSmallerThanTabletOnly}`; // <= 1023px
export const isSmallerThanMediumMedia = `@media ${mediaQueries.isSmallerThanMediumOnly}`; // <= 1439px

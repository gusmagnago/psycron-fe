const baseFontSize = 16;

const pxToRem = (px: number) => px / baseFontSize;

export const pixBreakpoints = {
  mobile: 767,
  tablet: 1023,
  medium: 1439,
  large: 1440,
};

export const breakpoints = {
  mobile: pxToRem(pixBreakpoints.mobile), // 47.9375rem
  tablet: pxToRem(pixBreakpoints.tablet), // 63.9375rem
  medium: pxToRem(pixBreakpoints.medium), // 89.9375rem
  large: pxToRem(pixBreakpoints.large), // 90rem
};

export const mediaQueries = {
  isSmallerThanTablet: `(max-width: ${breakpoints.mobile}rem)`, // <= 47.9375rem
  isBetweenTabletAndMedium: `(min-width: ${breakpoints.mobile + 0.0625}rem) and (max-width: ${breakpoints.tablet}rem)`, // 48rem - 63.9375rem
  isBetweenMediumAndLarge: `(min-width: ${breakpoints.tablet + 0.0625}rem) and (max-width: ${breakpoints.medium}rem)`, // 64rem - 89.9375rem
  isBiggerThanLarge: `(min-width: ${breakpoints.large}rem)`, // >= 90rem
  isBiggerThanTablet: `(min-width: ${breakpoints.mobile + 0.0625}rem)`, // >= 48rem
  isBiggerThanMedium: `(min-width: ${breakpoints.tablet + 0.0625}rem)`, // >= 64rem
  isSmallerThanTabletOnly: `(max-width: ${breakpoints.tablet}rem)`, // <= 63.9375rem
  isSmallerThanMediumOnly: `(max-width: ${breakpoints.medium}rem)`, // <= 89.9375rem
};

/* Prefixed with @media */
export const isMobileMedia = `@media ${mediaQueries.isSmallerThanTablet}`; // <= 47.9375rem
export const isTabletMedia = `@media ${mediaQueries.isBetweenTabletAndMedium}`; // 48rem - 63.9375rem
export const isMediumMedia = `@media ${mediaQueries.isBetweenMediumAndLarge}`; // 64rem - 89.9375rem
export const isLargeMedia = `@media ${mediaQueries.isBiggerThanLarge}`; // >= 90rem

export const isBiggerThanTabletMedia = `@media ${mediaQueries.isBiggerThanTablet}`; // >= 48rem
export const isBiggerThanMediumMedia = `@media ${mediaQueries.isBiggerThanMedium}`; // >= 64rem

export const isSmallerThanTabletMedia = `@media ${mediaQueries.isSmallerThanTabletOnly}`; // <= 63.9375rem
export const isSmallerThanMediumMedia = `@media ${mediaQueries.isSmallerThanMediumOnly}`; // <= 89.9375rem
